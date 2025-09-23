<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class AuthController extends Controller
{
    /**
     * Registrar un nuevo usuario
     *
     * @OA\Post(
     *     path="/api/register",
     *     tags={"Autenticación"},
     *     summary="Registrar usuario",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/RegisterInput")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuario creado con éxito",
     *         @OA\JsonContent(ref="#/components/schemas/AuthResponse")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación",
     *         @OA\JsonContent(ref="#/components/schemas/ValidationError")
     *     )
     * )
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'rol' => $request->rol ?? 'normal',
            'balance' => $request->balance ?? 0,
            'trial_ends_at' => null,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login de usuario
     *
     * @OA\Post(
     *     path="/api/login",
     *     tags={"Autenticación"},
     *     summary="Login de usuario",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/LoginInput")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login exitoso",
     *         @OA\JsonContent(ref="#/components/schemas/AuthResponse")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Credenciales inválidas",
     *         @OA\JsonContent(ref="#/components/schemas/AuthError")
     *     )
     * )
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => JWTAuth::user(),
        ]);
    }

    /**
     * Obtener datos del usuario autenticado
     *
     * @OA\Get(
     *     path="/api/me",
     *     tags={"Autenticación"},
     *     summary="Información del usuario autenticado",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Información del usuario",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No autorizado",
     *         @OA\JsonContent(ref="#/components/schemas/Unauthorized")
     *     )
     * )
     */
    public function me()
    {
        return response()->json(JWTAuth::user(), 200);
    }
}
