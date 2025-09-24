<?php

namespace App\Docs\Schemas\Watchlist;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="WatchlistResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/WatchlistItem")
 *     )
 * )
 */
class WatchlistResponseSchema {}