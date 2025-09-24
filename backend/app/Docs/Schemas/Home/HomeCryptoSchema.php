<?php

namespace App\Docs\Schemas\Home;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="HomeCrypto",
 *     type="object",
 *     title="Criptomoneda en Home",
 *     @OA\Property(property="uuid", type="string", example="Qwsogvtv82FCd"),
 *     @OA\Property(property="name", type="string", example="Bitcoin"),
 *     @OA\Property(property="symbol", type="string", example="BTC"),
 *     @OA\Property(property="iconUrl", type="string", format="url", example="https://cdn.coinranking.com/btc.svg"),
 *     @OA\Property(property="price", type="string", example="27345.50"),
 *     @OA\Property(property="change", type="string", example="-0.52"),
 *     @OA\Property(property="marketCap", type="string", example="530000000000")
 * )
 */
class HomeCryptoSchema {}