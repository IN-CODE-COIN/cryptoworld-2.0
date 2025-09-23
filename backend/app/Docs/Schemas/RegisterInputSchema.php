<?php
namespace App\Docs\Schemas;

/**
 * @OA\Schema(
 *     schema="RegisterInput",
 *     type="object",
 *     required={"name","email","password"},
 *     @OA\Property(property="name", type="string", example="Juan Perez"),
 *     @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
 *     @OA\Property(property="password", type="string", format="password", example="secret123"),
 *     @OA\Property(property="rol", type="string", example="normal"),
 *     @OA\Property(property="balance", type="number", example=0)
 * )
 */
class RegisterInputSchema {}
