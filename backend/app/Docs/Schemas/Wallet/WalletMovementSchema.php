<?php

namespace App\Docs\Schemas\Wallet;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WalletMovement",
 *     type="object",
 *     title="Movimiento en Wallet",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="type", type="string", example="deposito"),
 *     @OA\Property(property="amount", type="number", example=500),
 *     @OA\Property(property="description", type="string", example="Depósito inicial"),
 *     @OA\Property(property="method", type="string", example="card"),
 *     @OA\Property(property="date", type="string", format="date-time", example="2025-09-23T18:25:43.511Z")
 * )
 */
class WalletMovementSchema {}