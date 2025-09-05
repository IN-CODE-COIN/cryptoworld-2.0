<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function index_returns_top_cryptos_without_auth(): void
    {
        // Simulamos la respuesta de la API
        Http::fake([
            'https://api.coinranking.com/v2/coins*' => Http::response([
                'data' => [
                    'coins' => [
                        [
                            'uuid' => '1',
                            'name' => 'Bitcoin',
                            'symbol' => 'BTC',
                            'iconUrl' => 'https://bitcoin.org/img.png',
                            'price' => '50000',
                            'change' => '2.5',
                            'marketCap' => '1000000000',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/home');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'topCryptos' => [
                         [
                             'uuid',
                             'name',
                             'symbol',
                             'iconUrl',
                             'price',
                             'change',
                             'marketCap',
                         ],
                     ],
                     'watchlistUuids',
                 ])
                 ->assertJson([
                     'topCryptos' => [
                         [
                             'uuid' => '1',
                             'name' => 'Bitcoin',
                             'symbol' => 'BTC',
                             'iconUrl' => 'https://bitcoin.org/img.png',
                             'price' => '50000',
                             'change' => '2.5',
                             'marketCap' => '1000000000',
                         ],
                     ],
                     'watchlistUuids' => [],
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function index_returns_top_cryptos_with_authenticated_user_watchlist(): void
    {
        $user = User::factory()->create();
        $watchlistItem = Watchlist::factory()->create([
            'user_id' => $user->id,
            'coin_uuid' => '1',
        ]);

        Http::fake([
            'https://api.coinranking.com/v2/coins*' => Http::response([
                'data' => [
                    'coins' => [
                        [
                            'uuid' => '1',
                            'name' => 'Bitcoin',
                            'symbol' => 'BTC',
                            'iconUrl' => 'https://bitcoin.org/img.png',
                            'price' => '50000',
                            'change' => '2.5',
                            'marketCap' => '1000000000',
                        ],
                        [
                            'uuid' => '2',
                            'name' => 'Ethereum',
                            'symbol' => 'ETH',
                            'iconUrl' => 'https://ethereum.org/img.png',
                            'price' => '3000',
                            'change' => '1.2',
                            'marketCap' => '500000000',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/home');

        $response->assertStatus(200)
                 ->assertJson([
                     'watchlistUuids' => ['1'],
                 ])
                 ->assertJsonCount(2, 'topCryptos');
    }
}
