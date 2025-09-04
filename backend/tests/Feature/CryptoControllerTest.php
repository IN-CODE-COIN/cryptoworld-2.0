<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CryptoControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function search_can_be_called_without_auth()
    {
        Http::fake([
            'https://api.coinranking.com/v2/coins*' => Http::response([
                'data' => [
                    'coins' => [
                        [
                            'uuid' => 'coin-1',
                            'name' => 'Bitcoin',
                            'symbol' => 'BTC',
                            'iconUrl' => 'https://icon.com/btc.png',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/search-crypto?query=bitcoin');

        $response->assertStatus(200)
                 ->assertJson([
                     'uuid' => 'coin-1',
                     'name' => 'Bitcoin',
                     'symbol' => 'BTC',
                 ]);
    }

    /** @test */
    public function show_requires_auth_and_returns_coin_with_watchlist()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        Watchlist::factory()->create([
            'user_id' => $user->id,
            'coin_uuid' => 'coin-1',
            'name' => 'Bitcoin',
            'symbol' => 'BTC',
        ]);

        Http::fake([
            'https://api.coinranking.com/v2/coin/coin-1' => Http::response([
                'data' => [
                    'coin' => [
                        'uuid' => 'coin-1',
                        'name' => 'Bitcoin',
                        'symbol' => 'BTC',
                        'price' => '50000',
                    ],
                ],
            ], 200),
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/crypto/coin-1');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'uuid' => 'coin-1',
                     'name' => 'Bitcoin',
                 ])
                 ->assertJsonFragment([
                     'watchlistUuids' => ['coin-1'],
                 ]);
    }

    /** @test */
    public function show_returns_error_if_coin_not_found()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        Http::fake([
            'https://api.coinranking.com/v2/coin/*' => Http::response('Error', 404),
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/crypto/invalid-uuid');

        $response->assertStatus(404)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'Error al obtener la criptomoneda',
                 ]);
    }

    /** @test */
    public function autocomplete_can_be_called_without_auth()
    {
        Http::fake([
            'https://api.coinranking.com/v2/coins*' => Http::response([
                'data' => [
                    'coins' => [
                        ['uuid' => 'coin-1', 'name' => 'Bitcoin', 'symbol' => 'BTC', 'iconUrl' => 'btc.png'],
                        ['uuid' => 'coin-2', 'name' => 'Ethereum', 'symbol' => 'ETH', 'iconUrl' => 'eth.png'],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/crypto/autocomplete?query=bit');

        $response->assertStatus(200)
                 ->assertJsonFragment(['uuid' => 'coin-1', 'name' => 'Bitcoin'])
                 ->assertJsonFragment(['uuid' => 'coin-2', 'name' => 'Ethereum']);
    }

    /** @test */
    public function autocomplete_returns_empty_array_if_no_query()
    {
        $response = $this->getJson('/api/crypto/autocomplete');

        $response->assertStatus(200)
                 ->assertExactJson([]);
    }

    /** @test */
    public function get_price_can_be_called_without_auth()
    {
        Http::fake([
            'https://api.coinranking.com/v2/coin/coin-1/price*' => Http::response([
                'status' => 'success',
                'data' => ['price' => '50000'],
            ], 200),
        ]);

        $response = $this->getJson('/api/coin/price?uuid=coin-1&timestamp=1690000000');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => ['price' => '50000'],
                 ]);
    }

    /** @test */
    public function get_price_returns_error_if_missing_parameters()
    {
        $response = $this->getJson('/api/coin/price');

        $response->assertStatus(400)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'Faltan parámetros uuid o timestamp',
                 ]);
    }
}
