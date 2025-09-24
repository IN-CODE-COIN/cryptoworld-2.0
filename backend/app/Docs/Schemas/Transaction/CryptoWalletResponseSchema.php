<?php

namespace App\Docs\Schemas\Transaction;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="CryptoWalletResponse",
 *     type="object",
 *     @OA\Property(property="status", type="string", example="success"),
 *     @OA\Property(
 *         property="cryptos",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             @OA\Property(property="crypto_id", type="string", example="Qwsogvtv82FCd"),
 *             @OA\Property(property="crypto_name", type="string", example="Bitcoin")
 *         )
 *     )
 * )
 */
class CryptoWalletResponseSchema {}