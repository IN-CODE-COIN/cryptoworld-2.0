<?php

namespace App\Docs\Schemas\Watchlist;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WatchlistInput",
 *     type="object",
 *     required={"uuid","name","symbol","price"},
 *     @OA\Property(property="uuid", type="string", example="Qwsogvtv82FCd"),
 *     @OA\Property(property="name", type="string", example="Bitcoin"),
 *     @OA\Property(property="symbol", type="string", example="BTC"),
 *     @OA\Property(property="iconUrl", type="string", example="https://cdn.coinranking.com/btc.png"),
 *     @OA\Property(property="price", type="number", example=45000.50),
 *     @OA\Property(property="change", type="number", example=-2.15),
 *     @OA\Property(property="marketCap", type="number", example=850000000000)
 * )
 */
class WatchlistInputSchema {}
