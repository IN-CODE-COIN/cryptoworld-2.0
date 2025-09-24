<?php

namespace App\Docs\Schemas\Transaction;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="CryptoTransactionResponse",
 *     type="object",
 *     @OA\Property(property="status", type="string", example="success"),
 *     @OA\Property(property="message", type="string", example="Transacción registrada correctamente."),
 *     @OA\Property(property="transaction", type="object"),
 *     @OA\Property(property="position", type="object"),
 *     @OA\Property(property="balance", type="number", example=1000.50)
 * )
 */
class CryptoTransactionResponseSchema {}