<?php
namespace App\Docs\Schemas\Auth;

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
