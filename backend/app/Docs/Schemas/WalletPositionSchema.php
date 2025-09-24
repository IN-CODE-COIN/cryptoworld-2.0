<?php

namespace App\Docs\Schemas;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WalletPosition",
 *     type="object",
 *     title="Posición en criptomoneda",
 *     @OA\Property(property="uuid", type="string", example="Qwsogvtv82FCd"),
 *     @OA\Property(property="symbol", type="string", example="BTC"),
 *     @OA\Property(property="amount", type="number", example=0.5),
 *     @OA\Property(property="quantity", type="number", example=10000),
 *     @OA\Property(property="average_price", type="number", example=20000),
 *     @OA\Property(property="current_price", type="number", example=22000),
 *     @OA\Property(property="profit", type="number", example=1000),
 *     @OA\Property(property="total_change", type="number", example=10),
 *     @OA\Property(property="totalValue", type="number", example=11000)
 * )
 */
class WalletPositionSchema {}