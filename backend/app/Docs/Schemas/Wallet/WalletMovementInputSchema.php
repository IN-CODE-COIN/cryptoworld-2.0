<?php

namespace App\Docs\Schemas\Wallet;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WalletMovementInput",
 *     type="object",
 *     required={"type","amount","method"},
 *     @OA\Property(property="type", type="string", enum={"deposito","retirada"}, example="deposito"),
 *     @OA\Property(property="amount", type="number", example=200.50),
 *     @OA\Property(property="description", type="string", example="Depósito vía tarjeta"),
 *     @OA\Property(property="method", type="string", enum={"transfer","card","paypal"}, example="card")
 * )
 */
class WalletMovementInputSchema {}
