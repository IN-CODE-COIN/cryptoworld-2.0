<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

class WalletController extends Controller
{
     /**
     * Obtener resumen de la wallet del usuario
     *
     * @OA\Get(
     *     path="/api/wallet",
     *     tags={"Wallet"},
     *     summary="Resumen de la wallet (balance, movimientos recientes y posiciones)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Resumen de la wallet",
     *         @OA\JsonContent(ref="#/components/schemas/WalletSummary")
     *     ),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function index()
    {
        $user = Auth::user();
        $balance = $user->fundMovements()->sum('amount');
        $movements = $user->fundMovements()->orderBy('date', 'desc')->take(5)->get();

        $positions = $user->cryptoPositions()
            ->where('amount', '>', 0)
            ->get()
            ->map(function ($pos) {
                $coinUuid = $pos->crypto_id;
                $cryptoName = $pos->crypto_name;

                $http = Http::withHeaders([
                    'x-access-token' => env('COINRANKING_API_KEY')
                ]);

                if (app()->environment('local')) {
                    $http = $http->withOptions(['verify' => false]);
                }

                $response = $http->get("https://api.coinranking.com/v2/coin/{$coinUuid}");

                $data = $response->json();

                $currentPrice = isset($data['data']['coin']['price']) ? floatval($data['data']['coin']['price']) : 0;
                $currentValue = $currentPrice * $pos->amount;
                $profit = $currentValue - $pos->invested_usd;
                $change = $pos->invested_usd > 0 ? ($profit / $pos->invested_usd) * 100 : 0;

                return (object) [
                    'uuid'          => $pos->crypto_id,
                    'symbol'        => strtoupper($cryptoName),
                    'amount'        => $pos->amount,
                    'quantity'      => $pos->invested_usd,
                    'average_price' => $pos->average_price,
                    'current_price' => $currentPrice,
                    'profit'        => $profit,
                    'total_change'  => $change,
                    'totalValue'    => $currentPrice * $pos->amount,
                ];
            });

        $totalInvested = $positions->sum('quantity');
        $totalCurrent = $positions->sum(fn($pos) => $pos->current_price * $pos->amount);

        $totalProfit = $totalCurrent - $totalInvested;
        $totalChange = $totalInvested > 0 ? ($totalProfit / $totalInvested) * 100 : 0;

        return response()->json([
            'balance'      => $balance,
            'movements'    => $movements,
            'positions'    => $positions,
            'totalValue'   => $totalCurrent,
            'totalProfit'  => $totalProfit,
            'totalChange'  => $totalChange,
        ]);
    }

    /**
     * Obtener balance actual del usuario
     *
     * @OA\Get(
     *     path="/api/wallet/create",
     *     tags={"Wallet"},
     *     summary="Balance disponible del usuario",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Balance actual",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="balance", type="number", example=1500.75)
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function create()
    {
        $user = Auth::user();
        return response()->json(['balance' => $user->balance]);
    }

    /**
     * Registrar un movimiento (depósito o retirada)
     *
     * @OA\Post(
     *     path="/api/wallet",
     *     tags={"Wallet"},
     *     summary="Registrar depósito o retirada",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/WalletMovementInput")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Movimiento registrado",
     *         @OA\JsonContent(ref="#/components/schemas/WalletMovementResponse")
     *     ),
     *     @OA\Response(response=400, description="Saldo insuficiente"),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type'        => 'required|in:deposito,retirada',
            'amount'      => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'method'      => 'required|in:transfer,card,paypal',
        ]);

        $user = Auth::user();
        $amount = $data['type'] === 'retirada' ? -$data['amount'] : $data['amount'];

        // Verificar saldo
        $currentBalance = $user->balance;
        if ($data['type'] === 'retirada' && $data['amount'] > $currentBalance) {
            return response()->json([
                'status'  => 'error',
                'message' => "Saldo insuficiente. Tu saldo disponible es de $" . number_format($currentBalance, 2)
            ], 400);
        }

        // Actualiza saldo
        $user->balance += $amount;
        $user->save();

        // Registro movimiento
        $movement = $user->fundMovements()->create([
            'user_id'    => $user->id,
            'type'       => $data['type'],
            'amount'     => $data['amount'],
            'description'=> $data['description'],
            'method'     => $data['method'],
            'date'       => now(),
        ]);

        return response()->json([
            'status'   => 'success',
            'message'  => 'Movimiento registrado correctamente.',
            'balance'  => $user->balance,
            'movement' => $movement
        ], 201);
    }

    /**
     * Listar todos los movimientos del usuario
     *
     * @OA\Get(
     *     path="/api/wallet/movements",
     *     tags={"Wallet"},
     *     summary="Obtener todos los movimientos",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de movimientos",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/WalletMovement"))
     *     ),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function show()
    {
        $user = Auth::user();
        $movements = $user->fundMovements()->orderBy('date', 'desc')->get();
        return response()->json($movements);
    }

    /**
     * Actualizar descripción de un movimiento
     *
     * @OA\Put(
     *     path="/api/wallet/{id}",
     *     tags={"Wallet"},
     *     summary="Actualizar descripción de un movimiento",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del movimiento",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="description", type="string", example="Actualización de descripción")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Descripción actualizada",
     *         @OA\JsonContent(ref="#/components/schemas/WalletMovementResponse")
     *     ),
     *     @OA\Response(response=404, description="Movimiento no encontrado"),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'description' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $movement = $user->fundMovements()->findOrFail($id);
        $movement->description = $data['description'];
        $movement->save();

        return response()->json([
            'status'   => 'success',
            'message'  => 'Descripción actualizada correctamente.',
            'movement' => $movement
        ], 201);
    }
}
