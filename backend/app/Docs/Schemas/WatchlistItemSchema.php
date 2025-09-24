<?php

namespace App\Docs\Schemas;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WatchlistItem",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="coin_uuid", type="string", example="Qwsogvtv82FCd"),
 *     @OA\Property(property="name", type="string", example="Bitcoin"),
 *     @OA\Property(property="symbol", type="string", example="BTC"),
 *     @OA\Property(property="icon_url", type="string", example="https://cdn.coinranking.com/btc.png"),
 *     @OA\Property(property="price", type="number", example=45000.50),
 *     @OA\Property(property="change", type="number", example=-2.15),
 *     @OA\Property(property="market_cap", type="number", example=850000000000)
 * )
 */
class WatchlistItemSchema {}