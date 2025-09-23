<?php
namespace App\Docs\Schemas;

//**Schema UserController */
/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="Usuario",
 *     required={"id", "name", "email", "rol"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Luis"),
 *     @OA\Property(property="email", type="string", example="luis@crypto.com"),
 *     @OA\Property(property="rol", type="string", enum={"pro","normal"}, example="normal"),
 * )
 */
class UserSchema { }

/**
 * @OA\Schema(
 *     schema="UserInput",
 *     type="object",
 *     required={"name","email","password","rol"},
 *     @OA\Property(property="name", type="string", example="Luis"),
 *     @OA\Property(property="email", type="string", example="luis@crypto.com"),
 *     @OA\Property(property="password", type="integer", example=1234),
 *     @OA\Property(property="rol", type="string", enum={"pro","normal"}, example="pro"),
 * )
 */
class UserInputSchema { }

/**
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     title="Validation Error",
 *     required={"errors"},
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         additionalProperties=@OA\Schema(
 *             type="array",
 *             @OA\Items(type="string")
 *         ),
 *         example={
 *             "email": {"The email field is required."},
 *             "password": {"The password must be at least 8 characters."}
 *         }
 *     )
 * )
 */
class ValidationErrorSchema {}

/**
 * @OA\Schema(
 *     schema="NotFound",
 *     type="object",
 *     title="Not Found",
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         example="Resource not found"
 *     )
 * )
 */
class NotFoundSchema {}

/**
 * @OA\Schema(
 *     schema="Success",
 *     type="object",
 *     title="Success",
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         example="Operación realizada con éxito"
 *     )
 * )
 */
class SuccessSchema {}

//**Schema AuthController */
/**
 * @OA\Schema(
 *     schema="AuthResponse",
 *     type="object",
 *     title="Respuesta de Autenticación",
 *     required={"user","token"},
 *     @OA\Property(property="user", ref="#/components/schemas/User"),
 *     @OA\Property(
 *         property="token",
 *         type="string",
 *         description="JWT token de acceso",
 *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *     )
 * )
 */
class AuthResponseSchema {}

/**
 * @OA\Schema(
 *     schema="AuthError",
 *     type="object",
 *     title="Error de autenticación",
 *     @OA\Property(
 *         property="error",
 *         type="string",
 *         example="Credenciales inválidas"
 *     )
 * )
 */
class AuthErrorSchema {}

/**
 * @OA\Schema(
 *     schema="Unauthorized",
 *     type="object",
 *     title="No autorizado",
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         example="No autorizado"
 *     )
 * )
 */
class UnauthorizedSchema {}

//**Schema CryptoController */
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



