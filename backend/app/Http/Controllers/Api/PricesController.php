<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CoinLoreService;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

class PricesController extends Controller
{
    private CoinLoreService $coinLoreService;

    public function __construct(CoinLoreService $coinLoreService)
    {
        $this->coinLoreService = $coinLoreService;
    }

    /**
     * Obtener precios actualizados de la watchlist del usuario
     *
     * @OA\Get(
     *     path="/api/prices/watchlist",
     *     tags={"Prices"},
     *     summary="Obtener precios actualizados de la watchlist",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Precios actualizados",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="uuid", type="string"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="symbol", type="string"),
     *                     @OA\Property(property="price", type="number"),
     *                     @OA\Property(property="change", type="number"),
     *                     @OA\Property(property="marketCap", type="number")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function getWatchlistPrices()
    {
        try {
            $user = Auth::guard('api')->user();

            if (!$user) {
                return response()->json(['message' => 'No autorizado'], 401);
            }

            $watchlist = $user->watchlist()->get();

            $updatedPrices = $watchlist->map(function ($coin) {
                // Obtener los datos actuales de CoinLore usando el ID
                $coinData = $this->coinLoreService->getCoinById($coin->coin_uuid);

                if ($coinData) {
                    return [
                        'id' => $coin->id,
                        'uuid' => $coin->coin_uuid,
                        'name' => $coinData['name'] ?? $coin->name,
                        'symbol' => $coinData['symbol'] ?? $coin->symbol,
                        'icon_url' => $coin->icon_url,
                        'price' => floatval($coinData['price_usd'] ?? $coin->price),
                        'change' => floatval($coinData['percent_change_24h'] ?? $coin->change),
                        'marketCap' => floatval($coinData['market_cap_usd'] ?? $coin->market_cap),
                    ];
                }

                // Fallback a datos almacenados si la API falla
                return [
                    'id' => $coin->id,
                    'uuid' => $coin->coin_uuid,
                    'name' => $coin->name,
                    'symbol' => $coin->symbol,
                    'icon_url' => $coin->icon_url,
                    'price' => floatval($coin->price),
                    'change' => floatval($coin->change),
                    'marketCap' => floatval($coin->market_cap),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $updatedPrices
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener precios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener top criptomonedas con precios actualizados
     *
     * @OA\Get(
     *     path="/api/prices/top",
     *     tags={"Prices"},
     *     summary="Obtener top criptomonedas con precios actualizados",
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Número de monedas",
     *         @OA\Schema(type="integer", default=10)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Top criptomonedas",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="topCryptos",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="uuid", type="string"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="symbol", type="string"),
     *                     @OA\Property(property="price", type="number"),
     *                     @OA\Property(property="change", type="number"),
     *                     @OA\Property(property="marketCap", type="number")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="watchlistUuids",
     *                 type="array",
     *                 @OA\Items(type="string")
     *             )
     *         )
     *     )
     * )
     */
    public function getTopPrices()
    {
        try {
            $limit = request()->query('limit', 10);

            $topCoins = $this->coinLoreService->getTopCoins($limit);

            $user = Auth::guard('api')->user();
            $watchlistUuids = $user ? $user->watchlist()->pluck('coin_uuid')->toArray() : [];

            // Mapear al formato esperado por el frontend
            $topCryptos = array_map(function ($coin) {
                return [
                    'uuid' => $coin['uuid'] ?? $coin['id'],
                    'name' => $coin['name'],
                    'symbol' => $coin['symbol'],
                    'iconUrl' => $coin['icon_url'] ?? 'https://via.placeholder.com/24',
                    'price' => $coin['price'],
                    'change' => $coin['change'],
                    'marketCap' => $coin['marketCap'],
                ];
            }, $topCoins);

            return response()->json([
                'topCryptos' => $topCryptos,
                'watchlistUuids' => $watchlistUuids,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener precios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener precio actual de una moneda específica
     *
     * @OA\Get(
     *     path="/api/prices/{coinId}",
     *     tags={"Prices"},
     *     summary="Obtener precio de una moneda específica",
     *     @OA\Parameter(
     *         name="coinId",
     *         in="path",
     *         required=true,
     *         description="ID de la moneda (ej: 1 para Bitcoin)",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Datos de la moneda",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="uuid", type="string"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="symbol", type="string"),
     *             @OA\Property(property="price", type="number"),
     *             @OA\Property(property="change", type="number"),
     *             @OA\Property(property="marketCap", type="number")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Moneda no encontrada")
     * )
     */
    public function getCoinPrice(string $coinId)
    {
        try {
            $coin = $this->coinLoreService->getCoinById($coinId);

            if (!$coin) {
                return response()->json([
                    'message' => 'Moneda no encontrada'
                ], 404);
            }

            return response()->json($this->coinLoreService->formatCoin($coin));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener precio: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener precios por símbolo de monedas (para cartera, etc)
     *
     * @OA\Post(
     *     path="/api/prices/by-symbols",
     *     tags={"Prices"},
     *     summary="Obtener precios de múltiples monedas por símbolo",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="symbols",
     *                 type="array",
     *                 @OA\Items(type="string", example="BTC"),
     *                 description="Array de símbolos (BTC, ETH, etc)"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Precios obtenidos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="symbol", type="string"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="price", type="number"),
     *                     @OA\Property(property="change", type="number"),
     *                     @OA\Property(property="marketCap", type="number")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getPricesBySymbols(\Illuminate\Http\Request $request)
    {
        try {
            $request->validate([
                'symbols' => 'required|array',
                'symbols.*' => 'required|string',
            ]);

            $symbols = array_map('strtoupper', $request->input('symbols', []));
            $allCoins = $this->coinLoreService->getAllCoins(0, 500);

            $results = [];
            foreach ($allCoins as $coin) {
                if (in_array(strtoupper($coin['symbol']), $symbols)) {
                    $results[] = [
                        'symbol' => $coin['symbol'],
                        'name' => $coin['name'] ?? 'Unknown',
                        'price' => floatval($coin['price_usd'] ?? 0),
                        'change' => floatval($coin['percent_change_24h'] ?? 0),
                        'marketCap' => floatval($coin['market_cap_usd'] ?? 0),
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener precios: ' . $e->getMessage()
            ], 500);
        }
    }
}
