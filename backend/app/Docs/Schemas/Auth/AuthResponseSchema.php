<?php
namespace App\Docs\Schemas\Auth;

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
