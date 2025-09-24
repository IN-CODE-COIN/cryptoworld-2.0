<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Pricing",
 *     description="Gestión de planes, pruebas gratuitas y suscripciones"
 * )
 */
class PricingController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/pricing",
     *     summary="Obtener el estado actual del plan del usuario",
     *     tags={"Pricing"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Información del plan del usuario",
     *         @OA\JsonContent(ref="#/components/schemas/PricingStatusSchema")
     *     ),
     *     @OA\Response(response=401, description="No autorizado")
     * )
     */
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            'rol' => $user->rol,
            'onTrial' => $user->trial_ends_at && $user->trial_ends_at->isFuture(),
            'trialEndsAt' => $user->trial_ends_at,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/pricing/trial",
     *     summary="Iniciar periodo de prueba gratuita",
     *     tags={"Pricing"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Prueba iniciada",
     *         @OA\JsonContent(ref="#/components/schemas/TrialResponseSchema")
     *     ),
     *     @OA\Response(response=400, description="Ya se usó la prueba gratuita o ya es usuario Pro")
     * )
     */
    public function startTrial()
    {
        $user = Auth::user();

        if ($user->trial_ends_at || $user->rol === 'pro') {
            return response()->json([
                'message' => 'Ya estás en Pro o ya usaste tu prueba.',
            ], 400);
        }

        $user->trial_ends_at = Carbon::now()->addDays(7);
        $user->has_used_trial = true;
        $user->save();

        return response()->json([
            'message' => 'Tu prueba gratuita ha comenzado y durará 7 días.',
            'trialEndsAt' => $user->trial_ends_at,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/pricing/change-plan",
     *     summary="Cambiar plan de suscripción",
     *     tags={"Pricing"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/ChangePlanInputSchema")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Plan cambiado con éxito",
     *         @OA\JsonContent(ref="#/components/schemas/ChangePlanResponseSchema")
     *     ),
     *     @OA\Response(response=400, description="Error en los parámetros de entrada")
     * )
     */
    public function changePlan(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'rol' => 'required|in:normal,pro',
            'frequency' => 'nullable|in:mensual,anual',
        ]);

        $user->rol = $request->rol;

        if ($request->rol === 'pro') {
            $user->trial_ends_at = null;
            $user->pro_started_at = now();
            if ($request->has('frequency')) {
                $user->frequency = $request->frequency;
            }
        } else {
            $user->frequency = null;
        }

        $user->save();

        return response()->json([
            'message' => "Tu plan ha sido cambiado a {$user->rol}.",
            'user' => $user,
        ]);
    }
}
