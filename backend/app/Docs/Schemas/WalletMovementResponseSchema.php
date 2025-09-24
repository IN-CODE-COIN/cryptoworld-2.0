<?php

namespace App\Docs\Schemas;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WalletMovementResponse",
 *     type="object",
 *     title="Respuesta al registrar movimiento",
 *     @OA\Property(property="status", type="string", example="success"),
 *     @OA\Property(property="message", type="string", example="Movimiento registrado correctamente."),
 *     @OA\Property(property="balance", type="number", example=1500.75),
 *     @OA\Property(property="movement", ref="#/components/schemas/WalletMovement")
 * )
 */
class WalletMovementResponseSchema {}