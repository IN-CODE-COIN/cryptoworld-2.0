<?php

namespace App\Docs\Schemas\Pricing;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="ChangePlanInputSchema",
 *     type="object",
 *     required={"rol"},
 *     @OA\Property(property="rol", type="string", enum={"normal","pro"}, example="pro"),
 *     @OA\Property(property="frequency", type="string", enum={"mensual","anual"}, nullable=true, example="mensual")
 * )
 */
class ChangePlanInputSchema {}
