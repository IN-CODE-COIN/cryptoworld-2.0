<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class HttpHelper
{
    public static function coinrankingRequest()
    {
        $http = Http::withHeaders([
            'x-access-token' => env('COINRANKING_API_KEY'),
        ]);

        // Solo en desarrollo local, deshabilitar verificación SSL
        if (app()->environment('local')) {
            $http = $http->withOptions([
                'verify' => false,
            ]);
        }

        return $http;
    }
}
