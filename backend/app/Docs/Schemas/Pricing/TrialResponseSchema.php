<?php

namespace App\Docs\Schemas\Pricing;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="TrialResponseSchema",
 *     type="object",
 *     title="Respuesta al iniciar prueba gratuita",
 *     @OA\Property(property="message", type="string", example="Tu prueba gratuita ha comenzado y durará 7 días."),
 *     @OA\Property(property="trialEndsAt", type="string", format="date-time", example="2025-10-01T00:00:00Z")
 * )
 */
class TrialResponseSchema {}
