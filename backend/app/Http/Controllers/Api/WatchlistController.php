<?php

namespace App\Http\Controllers\Api;

use App\Models\Watchlist;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

class WatchlistController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * Listar criptomonedas en la watchlist del usuario autenticado
     *
     * @OA\Get(
     *     path="/api/watchlist",
     *     tags={"Watchlist"},
     *     summary="Obtener lista de criptomonedas en la watchlist",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de criptomonedas obtenida con éxito",
     *         @OA\JsonContent(ref="#/components/schemas/WatchlistResponse")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autorizado",
     *         @OA\JsonContent(ref="#/components/schemas/Unauthorized")
     *     )
     * )
     */
    public function index()
    {
        $coins = Auth::user()->watchlist;

        $watchlist = $coins->map(function ($coin) {
            $http = Http::withHeaders([
                'x-access-token' => env('COINRANKING_API_KEY')
            ]);

            if (app()->environment('local')) {
                $http = $http->withOptions(['verify' => false]);
            }

            $response = $http->get("https://api.coinranking.com/v2/coin/{$coin->coin_uuid}");

            $data = $response->json();

            return [
                'id' => $coin->id,
                'name' => $coin->name,
                'symbol' => $coin->symbol,
                'icon_url' => $coin->icon_url,
                'price' => floatval($data['data']['coin']['price'] ?? 0),
                'change' => floatval($data['data']['coin']['change'] ?? 0),
                'market_cap' => floatval($data['data']['coin']['marketCap'] ?? 0),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $watchlist
        ]);
    }

    /**
     * Agregar una criptomoneda a la watchlist
     *
     * @OA\Post(
     *     path="/api/watchlist",
     *     tags={"Watchlist"},
     *     summary="Agregar criptomoneda a la watchlist",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/WatchlistInput")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Criptomoneda añadida con éxito",
     *         @OA\JsonContent(ref="#/components/schemas/WatchlistItem")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Límite de monedas alcanzado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Moneda duplicada en la lista",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autorizado",
     *         @OA\JsonContent(ref="#/components/schemas/Unauthorized")
     *     )
     * )
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'uuid' => 'required|string',
            'name' => 'required|string',
            'symbol' => 'required|string',
            'iconUrl' => 'nullable|string',
            'price' => 'required|numeric',
            'change' => 'nullable|numeric',
            'marketCap' => 'nullable|numeric',
        ]);

        if ($user->watchlist()->where('coin_uuid', $request->uuid)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Esta criptomoneda ya está en tu lista de seguimiento.'
            ], 409);
        }

        $count = $user->watchlist()->count();
        if ($count >= 5 && !$user->isPro() && !$user->onTrial()) {
            return response()->json([
                'success' => false,
                'message' => 'Has alcanzado el límite de 5 criptomonedas en tu lista de seguimiento.'
            ], 403);
        }

        $watchlist = $user->watchlist()->create([
            'coin_uuid' => $request->uuid,
            'name' => $request->name,
            'symbol' => $request->symbol,
            'icon_url' => $request->iconUrl,
            'price' => $request->price,
            'change' => $request->change,
            'market_cap' => $request->marketCap,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Criptomoneda añadida a tu lista de seguimiento.',
            'data' => $watchlist
        ], 201);
    }

    /**
     * Eliminar criptomoneda de la watchlist
     *
     * @OA\Delete(
     *     path="/api/watchlist/{id}",
     *     tags={"Watchlist"},
     *     summary="Eliminar criptomoneda de la watchlist",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la moneda en la watchlist",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Cripto eliminada con éxito",
     *         @OA\JsonContent(ref="#/components/schemas/SuccessResponse")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autorizado",
     *         @OA\JsonContent(ref="#/components/schemas/Unauthorized")
     *     )
     * )
     */
    public function destroy(Watchlist $watchlist)
    {
        $this->authorize('delete', $watchlist);
        $watchlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cripto eliminada de la lista de seguimiento.'
        ]);
    }
}
