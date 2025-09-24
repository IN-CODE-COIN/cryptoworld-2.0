<?php
namespace App\Docs\Schemas\Auth;

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
