<?php
namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="Coin",
 *     type="object",
 *     title="Criptomoneda",
 *     required={"uuid", "name", "symbol", "price"},
 *     @OA\Property(property="uuid", type="string", example="Qwsogvtv82FCd"),
 *     @OA\Property(property="name", type="string", example="Bitcoin"),
 *     @OA\Property(property="symbol", type="string", example="BTC"),
 *     @OA\Property(property="iconUrl", type="string", format="uri", example="https://cdn.coinranking.com/btc.svg"),
 *     @OA\Property(property="price", type="string", example="27000.50"),
 *     @OA\Property(property="marketCap", type="string", example="520000000000"),
 *     @OA\Property(property="change", type="string", example="-0.25")
 * )
 */
class CoinSchema {}

/**
 * @OA\Schema(
 *     schema="CoinSearchResult",
 *     type="object",
 *     title="Resultado búsqueda de criptomoneda",
 *     required={"uuid","name","symbol","iconUrl"},
 *     @OA\Property(property="uuid", type="string", example="razxDUgYGNAdQ"),
 *     @OA\Property(property="name", type="string", example="Ethereum"),
 *     @OA\Property(property="symbol", type="string", example="ETH"),
 *     @OA\Property(property="iconUrl", type="string", format="uri", example="https://cdn.coinranking.com/eth.svg")
 * )
 */
class CoinSearchResultSchema {}

/**
 * @OA\Schema(
 *     schema="CoinDetailResponse",
 *     type="object",
 *     title="Detalle Criptomoneda",
 *     @OA\Property(property="coin", ref="#/components/schemas/Coin"),
 *     @OA\Property(
 *         property="watchlistUuids",
 *         type="array",
 *         @OA\Items(type="string"),
 *         example={"Qwsogvtv82FCd", "razxDUgYGNAdQ"}
 *     )
 * )
 */
class CoinDetailResponseSchema {}

/**
 * @OA\Schema(
 *     schema="CoinPriceResponse",
 *     type="object",
 *     title="Precio histórico de criptomoneda",
 *     required={"status","data"},
 *     @OA\Property(property="status", type="string", example="success"),
 *     @OA\Property(
 *         property="data",
 *         type="object",
 *         @OA\Property(property="price", type="string", example="26543.21"),
 *         @OA\Property(property="timestamp", type="integer", example=1695158400)
 *     )
 * )
 */
class CoinPriceResponseSchema {}
