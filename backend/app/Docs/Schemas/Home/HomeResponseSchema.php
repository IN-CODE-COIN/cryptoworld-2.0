<?php

namespace App\Docs\Schemas\Home;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="HomeResponse",
 *     type="object",
 *     title="Respuesta Home",
 *     @OA\Property(
 *         property="topCryptos",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/HomeCrypto")
 *     ),
 *     @OA\Property(
 *         property="watchlistUuids",
 *         type="array",
 *         description="UUIDs de las criptomonedas en la lista del usuario",
 *         @OA\Items(type="string", example="Qwsogvtv82FCd")
 *     )
 * )
 */
class HomeResponseSchema {}