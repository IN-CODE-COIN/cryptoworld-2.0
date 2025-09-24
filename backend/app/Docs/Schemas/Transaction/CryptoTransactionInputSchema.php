<?php

namespace App\Docs\Schemas\Transaction;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="CryptoTransactionInput",
 *     type="object",
 *     required={"crypto_id","crypto_name","type","date","amount_usd","price_usd","quantity"},
 *     @OA\Property(property="crypto_id", type="string", example="Qwsogvtv82FCd"),
 *     @OA\Property(property="crypto_name", type="string", example="Bitcoin"),
 *     @OA\Property(property="type", type="string", enum={"buy","sell"}, example="buy"),
 *     @OA\Property(property="date", type="string", format="date", example="2025-09-24"),
 *     @OA\Property(property="amount_usd", type="number", format="float", example=500),
 *     @OA\Property(property="price_usd", type="number", format="float", example=27345.50),
 *     @OA\Property(property="quantity", type="number", format="float", example=0.018),
 *     @OA\Property(property="fees", type="number", format="float", example=2)
 * )
 */
class CryptoTransactionInputSchema {}