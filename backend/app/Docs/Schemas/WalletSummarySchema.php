<?php

namespace App\Docs\Schemas;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WalletSummary",
 *     type="object",
 *     title="Resumen de Wallet",
 *     @OA\Property(property="balance", type="number", example=1200.50),
 *     @OA\Property(property="movements", type="array", @OA\Items(ref="#/components/schemas/WalletMovement")),
 *     @OA\Property(property="positions", type="array", @OA\Items(ref="#/components/schemas/WalletPosition")),
 *     @OA\Property(property="totalValue", type="number", example=2500.75),
 *     @OA\Property(property="totalProfit", type="number", example=300.20),
 *     @OA\Property(property="totalChange", type="number", example=12.5)
 * )
 */
class WalletSummarySchema {}
