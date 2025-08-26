<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PricingController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            'rol' => $user->rol,
            'onTrial' => $user->trial_ends_at && $user->trial_ends_at->isFuture(),
            'trialEndsAt' => $user->trial_ends_at,
        ]);
    }

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
