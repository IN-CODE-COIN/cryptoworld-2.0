<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

use OpenApi\Annotations as OA;

class UserController extends Controller
{
    /**
     * Listar todos los usuarios
     *
     * @OA\Get(
     *     path="/api/users",
     *     tags={"Usuarios"},
     *     summary="Listar usuarios",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Crear un nuevo usuario
     *
     * @OA\Post(
     *     path="/api/users",
     *     tags={"Usuarios"},
     *     summary="Crear usuario",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UserInput")
     *     ),
     *     @OA\Response(response=201, description="Usuario creado", @OA\JsonContent(@OA\Property(property="id", type="integer"), example=1)),
     *     @OA\Response(response=422, description="Error validación", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|digits:4',
            'rol'      => 'required|in:pro,normal',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json(['id' => $user->id], 201);
    }

    /**
     * Mostrar un usuario
     * 
     * @OA\Get(
     *     path="/api/users/{id}",
     *     tags={"Usuarios"},
     *     summary="Obtener usuario por ID",
     *     @OA\Parameter(
     *         name="id", in="path", required=true, @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Datos del usuario", @OA\JsonContent(ref="#/components/schemas/User")),
     *     @OA\Response(response=404, description="No encontrado", @OA\JsonContent(ref="#/components/schemas/NotFound")),
     * )
     */
    public function show($id)
    {
        $user = User::find($id);
        return $user
            ? response()->json($user)
            : response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    /**
     * Actualizar usuario
     *
     * @OA\Put(
     *     path="/api/users/{id}",
     *     tags={"Usuarios"},
     *     summary="Actualizar usuario",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/UserInput")),
     *     @OA\Response(response=200, description="Usuario actualizado", @OA\JsonContent(ref="#/components/schemas/User")),
     *     @OA\Response(response=404, description="No encontrado", @OA\JsonContent(ref="#/components/schemas/NotFound")),
     *     @OA\Response(response=422, description="Error validación", @OA\JsonContent(ref="#/components/schemas/ValidationError"))
     * )
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|digits:4',
            'rol'      => 'sometimes|in:pro,normal',
        ]);
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }
        $user->update($validated);
        return response()->json(['message' => 'Usuario actualizado'], 200);
    }

    /**
     * Eliminar usuario
     * 
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     tags={"Usuarios"},
     *     summary="Eliminar usuario",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Usuario eliminado", @OA\JsonContent(ref="#/components/schemas/Success")),
     *     @OA\Response(response=404, description="No encontrado", @OA\JsonContent(ref="#/components/schemas/NotFound")),
     * )
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}
