<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
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

                $response = Http::withHeaders([
                    'x-access-token' => env('COINRANKING_API_KEY')
                ])->get("https://api.coinranking.com/v2/coin/{$coinUuid}");

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

    public function create()
    {
        $user = Auth::user();
        return response()->json(['balance' => $user->balance]);
    }

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

    public function show()
    {
        $user = Auth::user();
        $movements = $user->fundMovements()->orderBy('date', 'desc')->get();
        return response()->json($movements);
    }

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
