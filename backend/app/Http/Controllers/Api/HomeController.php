<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $response = Http::withHeaders([
            'x-access-token' => env('COINRANKING_API_KEY'),
        ])->get('https://api.coinranking.com/v2/coins', [
            'limit' => 10,
        ]);

        $apiCoins = $response->json()['data']['coins'] ?? [];

        // Mapeamos los datos para asegurar que tenemos todo lo que necesitamos
        $topCryptos = array_map(function ($coin) {
            return [
                'uuid' => $coin['uuid'],
                'name' => $coin['name'],
                'symbol' => $coin['symbol'], // <-- Añadido
                'iconUrl' => $coin['iconUrl'],
                'price' => $coin['price'],
                'change' => $coin['change'],
                'marketCap' => $coin['marketCap'], // <-- Añadido
            ];
        }, $apiCoins);

        $watchlistUuids = Auth::check()
            ? Auth::user()->watchlist()->pluck('coin_uuid')->toArray()
            : [];

        return response()->json([
            'topCryptos' => $topCryptos, // Usamos la variable mapeada
            'watchlistUuids' => $watchlistUuids,
        ]);
    }
}