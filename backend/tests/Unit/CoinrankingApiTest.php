<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;

class CoinrankingApiTest extends TestCase
{
    /** @test */
    public function procesa_respuesta_de_api_externa_correctamente()
    {
        Http::fake([
            'coinranking.com/*' => Http::response([
                'data' => [
                    'coin' => [
                        'price' => '99.99'
                    ]
                ]
            ], 200),
        ]);

        $response = Http::withHeaders([
            'x-access-token' => 'fake_key'
        ])->get('https://api.coinranking.com/v2/coin/bitcoin');

        $data = $response->json();

        $this->assertEquals('99.99', $data['data']['coin']['price']);
    }
}
