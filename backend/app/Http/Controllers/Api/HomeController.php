<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

class HomeController extends Controller
{
    /**
     * Obtener las 10 criptomonedas principales y la watchlist del usuario autenticado
     *
     * @OA\Get(
     *     path="/api/home",
     *     tags={"Home"},
     *     summary="Top 10 criptomonedas y watchlist del usuario",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de criptomonedas principales y watchlist del usuario",
     *         @OA\JsonContent(ref="#/components/schemas/HomeResponse")
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error en la consulta",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Error al obtener las criptomonedas")
     *         )
     *     )
     * )
     */
    public function index()
    {
        $http = Http::withHeaders([
            'x-access-token' => env('COINRANKING_API_KEY'),
        ]);

        // Deshabilitar verificación SSL solo en desarrollo local
        if (app()->environment('local')) {
            $http = $http->withOptions(['verify' => false]);
        }

        $response = $http->get('https://api.coinranking.com/v2/coins', [
            'limit' => 10,
        ]);

        $apiCoins = $response->json()['data']['coins'] ?? [];

        $topCryptos = array_map(function ($coin) {
            return [
                'uuid' => $coin['uuid'],
                'name' => $coin['name'],
                'symbol' => $coin['symbol'],
                'iconUrl' => $coin['iconUrl'],
                'price' => $coin['price'],
                'change' => $coin['change'],
                'marketCap' => $coin['marketCap'],
            ];
        }, $apiCoins);

        $watchlistUuids = Auth::check()
            ? Auth::user()->watchlist()->pluck('coin_uuid')->toArray()
            : [];

        return response()->json([
            'topCryptos' => $topCryptos,
            'watchlistUuids' => $watchlistUuids,
        ]);
    }
}
