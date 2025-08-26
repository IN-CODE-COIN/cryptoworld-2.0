<?php
namespace App\Docs\Schemas;

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


