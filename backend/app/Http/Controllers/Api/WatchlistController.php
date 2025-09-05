<?php

namespace App\Http\Controllers\Api;
use App\Models\Watchlist;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class WatchlistController extends Controller
{

    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    public function index()
    {
        $coins = Auth::user()->watchlist;

        $watchlist = $coins->map(function ($coin) {
            $response = Http::withHeaders([
                'x-access-token' => env('COINRANKING_API_KEY')
            ])->get("https://api.coinranking.com/v2/coin/{$coin->coin_uuid}");

            $data = $response->json();

            return [
                'id' => $coin->id,
                'name' => $coin->name,
                'symbol' => $coin->symbol,
                'icon_url' => $coin->icon_url,
                'price' => floatval($data['data']['coin']['price'] ?? 0),
                'change' => floatval($data['data']['coin']['change'] ?? 0),
                'market_cap' => floatval($data['data']['coin']['marketCap'] ?? 0),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $watchlist
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'uuid' => 'required|string',
            'name' => 'required|string',
            'symbol' => 'required|string',
            'iconUrl' => 'nullable|string',
            'price' => 'required|numeric',
            'change' => 'nullable|numeric',
            'marketCap' => 'nullable|numeric',
        ]);

        if ($user->watchlist()->where('coin_uuid', $request->uuid)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Esta criptomoneda ya está en tu lista de seguimiento.'
            ], 409);
        }

        // Validar el límite de 5 criptomonedas para usuarios no premium
        $count = $user->watchlist()->count();
        if ($count >= 5 && !$user->isPro() && !$user->onTrial()) {
            return response()->json([
                'success' => false,
                'message' => 'Has alcanzado el límite de 5 criptomonedas en tu lista de seguimiento. Actualiza tu cuenta a profesional para aumentar tu límite.'
            ], 403);
        }

        $watchlist = $user->watchlist()->create([
            'coin_uuid' => $request->uuid,
            'name' => $request->name,
            'symbol' => $request->symbol,
            'icon_url' => $request->iconUrl,
            'price' => $request->price,
            'change' => $request->change,
            'market_cap' => $request->marketCap,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Criptomoneda añadida a tu lista de seguimiento.',
            'data' => $watchlist
        ], 201);
    }


    public function destroy(Watchlist $watchlist)
    {
        $this->authorize('delete', $watchlist);
        $watchlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cripto eliminada de la lista de seguimiento.'
        ]);
    }

}

