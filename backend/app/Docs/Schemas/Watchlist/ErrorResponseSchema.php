<?php

namespace App\Docs\Schemas\Watchlist;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Error con la operación solicitada")
 * )
 */
class ErrorResponseSchema {}