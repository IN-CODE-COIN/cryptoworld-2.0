<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CoinLoreService
{
    private const API_BASE = 'https://api.coinlore.net/api';
    private const CACHE_DURATION = 60; // 1 minuto

    /**
     * Obtener todas las criptomonedas con paginación
     *
     * @param int $start
     * @param int $limit
     * @return array
     */
    public function getAllCoins(int $start = 0, int $limit = 100): array
    {
        $cacheKey = "coinlore_coins_{$start}_{$limit}";

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($start, $limit) {
            $response = Http::get(self::API_BASE . '/tickers/', [
                'start' => $start,
                'limit' => $limit,
            ]);

            if (!$response->successful()) {
                return [];
            }

            return $response->json()['data'] ?? [];
        });
    }

    /**
     * Obtener datos de una criptomoneda específica por ID
     *
     * @param string $coinId
     * @return array|null
     */
    public function getCoinById(string $coinId): ?array
    {
        $cacheKey = "coinlore_coin_{$coinId}";

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($coinId) {
            $response = Http::get(self::API_BASE . '/ticker/', [
                'id' => $coinId,
            ]);

            if (!$response->successful()) {
                return null;
            }

            $data = $response->json();
            return $data[0] ?? null;
        });
    }

    /**
     * Obtener datos de múltiples monedas por IDs
     *
     * @param array $coinIds
     * @return array
     */
    public function getCoinsByIds(array $coinIds): array
    {
        $coins = [];

        foreach ($coinIds as $id) {
            $coin = $this->getCoinById($id);
            if ($coin) {
                $coins[] = $coin;
            }
        }

        return $coins;
    }

    /**
     * Mapear datos de CoinLore al formato esperado por el frontend
     *
     * @param array $coin
     * @return array
     */
    public function formatCoin(array $coin): array
    {
        return [
            'id' => $coin['id'] ?? null,
            'uuid' => $coin['id'] ?? null, // CoinLore usa 'id' como identificador
            'name' => $coin['name'] ?? 'Unknown',
            'symbol' => $coin['symbol'] ?? 'UNKNOWN',
            'price' => floatval($coin['price_usd'] ?? 0),
            'change' => floatval($coin['percent_change_24h'] ?? 0),
            'marketCap' => floatval($coin['market_cap_usd'] ?? 0),
        ];
    }

    /**
     * Obtener estadísticas globales
     *
     * @return array
     */
    public function getGlobalStats(): array
    {
        $cacheKey = 'coinlore_global_stats';

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () {
            $response = Http::get(self::API_BASE . '/global/');

            if (!$response->successful()) {
                return [];
            }

            return $response->json();
        });
    }

    /**
     * Obtener top N criptomonedas
     *
     * @param int $limit
     * @return array
     */
    public function getTopCoins(int $limit = 10): array
    {
        $coins = $this->getAllCoins(0, $limit);

        return array_map(fn($coin) => $this->formatCoin($coin), $coins);
    }

    /**
     * Buscar criptomoneda por símbolo
     *
     * @param string $symbol
     * @return array|null
     */
    public function searchBySymbol(string $symbol): ?array
    {
        $topCoins = $this->getAllCoins(0, 100);

        foreach ($topCoins as $coin) {
            if (strtoupper($coin['symbol']) === strtoupper($symbol)) {
                return $this->formatCoin($coin);
            }
        }

        return null;
    }

    /**
     * Obtener datos de mercados para una criptomoneda
     *
     * @param string $coinId
     * @return array
     */
    public function getCoinMarkets(string $coinId): array
    {
        $cacheKey = "coinlore_markets_{$coinId}";

        return Cache::remember($cacheKey, self::CACHE_DURATION * 5, function () use ($coinId) {
            $response = Http::get(self::API_BASE . '/coin/markets/', [
                'id' => $coinId,
            ]);

            if (!$response->successful()) {
                return [];
            }

            return $response->json();
        });
    }
}
