<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

use OpenApi\Annotations as OA;

class CryptoController extends Controller
{
    /**
     * Buscar criptomoneda por nombre o símbolo
     *
     * @OA\Get(
     *     path="/api/crypto/search",
     *     tags={"Criptomonedas"},
     *     summary="Buscar criptomoneda",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="query",
     *         in="query",
     *         required=true,
     *         description="Texto a buscar (nombre o símbolo de la criptomoneda)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Criptomoneda encontrada",
     *         @OA\JsonContent(ref="#/components/schemas/CoinSearchResult")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No encontrada",
     *         @OA\JsonContent(ref="#/components/schemas/NotFound")
     *     )
     * )
     */
    public function search(Request $request)
    {
        $query = $request->input('query');

        $http = Http::withHeaders([
            'x-access-token' => env('COINRANKING_API_KEY')
        ]);

        if (app()->environment('local')) {
            $http = $http->withOptions(['verify' => false]);
        }

        $response = $http->get('https://api.coinranking.com/v2/coins', [
            'search' => $query,
            'limit' => 1
        ]);

        $coin = collect($response->json()['data']['coins'])->first();

        return response()->json($coin);
    }

    /**
     * Obtener detalles de una criptomoneda por UUID
     *
     * @OA\Get(
     *     path="/api/crypto/{uuid}",
     *     tags={"Criptomonedas"},
     *     summary="Detalle de criptomoneda",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="path",
     *         required=true,
     *         description="UUID de la criptomoneda",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalle de la criptomoneda",
     *         @OA\JsonContent(ref="#/components/schemas/CoinDetailResponse")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Criptomoneda no encontrada",
     *         @OA\JsonContent(ref="#/components/schemas/NotFound")
     *     )
     * )
     */
    public function show($uuid)
    {
        $http = Http::withHeaders([
            'x-access-token' => env('COINRANKING_API_KEY')
        ]);

        if (app()->environment('local')) {
            $http = $http->withOptions(['verify' => false]);
        }

        $response = $http->get("https://api.coinranking.com/v2/coin/{$uuid}");

        if (!$response->successful()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener la criptomoneda',
                'body' => $response->body()
            ], $response->status());
        }

        $coin = $response->json()['data']['coin'];

        $watchlistUuids = Auth::user()?->watchlist()->pluck('coin_uuid')->toArray();

        return response()->json([
            'coin' => $coin,
            'watchlistUuids' => $watchlistUuids
        ]);
    }

    /**
     * Autocompletar búsqueda de criptomonedas
     *
     * @OA\Get(
     *     path="/api/crypto/autocomplete",
     *     tags={"Criptomonedas"},
     *     summary="Autocompletar búsqueda",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="query",
     *         in="query",
     *         required=true,
     *         description="Texto parcial del nombre o símbolo de la criptomoneda",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de coincidencias",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/CoinSearchResult"))
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Parámetro faltante",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     )
     * )
     */
    public function autocomplete(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        $http = Http::withHeaders([
            'x-access-token' => env('COINRANKING_API_KEY'),
        ]);

        if (app()->environment('local')) {
            $http = $http->withOptions(['verify' => false]);
        }

        $response = $http->get('https://api.coinranking.com/v2/coins', [
            'search' => $query,
            'limit' => 5,
        ]);

        $coins = $response->json()['data']['coins'];

        $results = array_map(function ($coin) {
            return [
                'uuid' => $coin['uuid'],
                'name' => $coin['name'],
                'symbol' => $coin['symbol'],
                'iconUrl' => $coin['iconUrl'],
            ];
        }, $coins);

        return response()->json($results);
    }

    /**
     * Obtener precio histórico de una criptomoneda
     *
     * @OA\Get(
     *     path="/api/crypto/price",
     *     tags={"Criptomonedas"},
     *     summary="Precio de criptomoneda por timestamp",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="uuid",
     *         in="query",
     *         required=true,
     *         description="UUID de la criptomoneda",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="timestamp",
     *         in="query",
     *         required=true,
     *         description="Timestamp en segundos",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Precio obtenido correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/CoinPriceResponse")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Parámetros faltantes",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Error en Coinranking",
     *         @OA\JsonContent(ref="#/components/schemas/ServerError")
     *     )
     * )
     */
    public function getPrice(Request $request)
    {
        $uuid = $request->query('uuid');
        $timestamp = $request->query('timestamp');

        if (!$uuid || !$timestamp) {
            return response()->json([
                'status' => 'error',
                'message' => 'Faltan parámetros uuid o timestamp'
            ], 400);
        }

        $apiKey = env('COINRANKING_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'status' => 'error',
                'message' => 'API key no configurada'
            ], 500);
        }

        try {
            $url = "https://api.coinranking.com/v2/coin/{$uuid}/price";

            $httpClient = Http::withHeaders([
                'x-access-token' => $apiKey,
            ]);

            // Configurar SSL verification para desarrollo local
            if (app()->environment('local')) {
                $httpClient = $httpClient->withOptions(['verify' => false]);
            }

            $response = $httpClient->timeout(10)->get($url, [
                'timestamp' => $timestamp,
            ]);

            if (!$response->successful()) {
                \Log::error('Coinranking API Error', [
                    'uuid' => $uuid,
                    'timestamp' => $timestamp,
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se pudo obtener el precio histórico',
                    'data' => null
                ], 200); // Devolver 200 para que el frontend lo maneje gracefully
            }

            $data = $response->json();
            return response()->json([
                'status' => 'success',
                'data' => $data['data'] ?? null
            ]);
        } catch (\Exception $e) {
            \Log::error('Precio histórico - Excepción', [
                'error' => $e->getMessage(),
                'uuid' => $uuid,
                'timestamp' => $timestamp
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener precio histórico',
                'data' => null
            ], 200); // Devolver 200 para que el frontend lo maneje gracefully
        }
    }
}
