<?php

namespace App\Docs\Schemas\Pricing;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="PricingStatusSchema",
 *     type="object",
 *     title="Estado del plan del usuario",
 *     @OA\Property(property="rol", type="string", example="normal"),
 *     @OA\Property(property="onTrial", type="boolean", example=true),
 *     @OA\Property(property="trialEndsAt", type="string", format="date-time", example="2025-10-01T00:00:00Z")
 * )
 */
class PricingStatusSchema {}
