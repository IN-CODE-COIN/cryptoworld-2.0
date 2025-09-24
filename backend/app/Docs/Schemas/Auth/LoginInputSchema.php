<?php
namespace App\Docs\Schemas\Auth;

/**
 * @OA\Schema(
 *     schema="LoginInput",
 *     type="object",
 *     required={"email","password"},
 *     @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
 *     @OA\Property(property="password", type="string", format="password", example="secret123")
 * )
 */
class LoginInputSchema {}
