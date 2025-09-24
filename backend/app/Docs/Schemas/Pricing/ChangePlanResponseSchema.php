<?php

namespace App\Docs\Schemas\Pricing;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="ChangePlanResponseSchema",
 *     type="object",
 *     title="Respuesta al cambiar plan",
 *     @OA\Property(property="message", type="string", example="Tu plan ha sido cambiado a pro."),
 *     @OA\Property(
 *         property="user",
 *         type="object",
 *         description="Información del usuario",
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="rol", type="string", example="pro"),
 *         @OA\Property(property="frequency", type="string", example="mensual"),
 *         @OA\Property(property="trial_ends_at", type="string", format="date-time", nullable=true),
 *         @OA\Property(property="pro_started_at", type="string", format="date-time", nullable=true)
 *     )
 * )
 */
class ChangePlanResponseSchema {}
