<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tymon\JWTAuth\Facades\JWTAuth;

class WatchlistControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Creamos un usuario válido
        $this->user = User::factory()->create([
            'rol' => 'pro',
        ]);

        // Generamos el token JWT
        $this->token = JWTAuth::fromUser($this->user);
    }

    /** @test */
    public function it_returns_watchlist_items()
    {
        // Creamos un coin en la watchlist
        Watchlist::factory()->create([
            'user_id' => $this->user->id,
            'coin_uuid' => 'bitcoin-uuid',
            'name' => 'Bitcoin',
            'symbol' => 'BTC',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->getJson('/api/watchlist');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                 ])
                 ->assertJsonStructure([
                     'data' => [
                         [
                             'id',
                             'name',
                             'symbol',
                             'icon_url',
                             'price',
                             'change',
                             'market_cap',
                         ]
                     ]
                 ]);
    }

    /** @test */
    public function it_adds_a_new_coin_to_watchlist()
    {
        $payload = [
            'uuid' => 'ethereum-uuid',
            'name' => 'Ethereum',
            'symbol' => 'ETH',
            'iconUrl' => 'https://cdn.coinranking.com/eth.png',
            'price' => 2500.55,
            'change' => 3.5,
            'marketCap' => 500000000,
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->postJson('/api/watchlist', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Criptomoneda añadida a tu lista de seguimiento.',
                 ]);

        $this->assertDatabaseHas('watchlists', [
            'user_id' => $this->user->id,
            'coin_uuid' => 'ethereum-uuid',
        ]);
    }

    /** @test */
    public function it_deletes_a_coin_from_watchlist()
    {
        $coin = Watchlist::factory()->create([
            'user_id' => $this->user->id,
            'coin_uuid' => 'dogecoin-uuid',
            'name' => 'Dogecoin',
            'symbol' => 'DOGE',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->deleteJson("/api/watchlist/{$coin->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Cripto eliminada de la lista de seguimiento.',
                 ]);

        $this->assertDatabaseMissing('watchlists', [
            'id' => $coin->id,
        ]);
    }

    /** @test */
    public function a_normal_user_cannot_add_more_than_five_coins()
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => now()->subDays(1), // no está en trial
        ]);

        $token = auth('api')->login($user);

        Watchlist::factory()->count(5)->create(['user_id' => $user->id]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/watchlist', [
            'uuid' => 'coin-6',
            'name' => 'Coin Six',
            'symbol' => 'C6',
            'price' => 100,
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'message' => 'Has alcanzado el límite de 5 criptomonedas en tu lista de seguimiento. Actualiza tu cuenta a profesional para aumentar tu límite.',
                ]);
    }

    /** @test */
    public function a_pro_user_can_add_more_than_five_coins()
    {
        $user = User::factory()->create(['rol' => 'pro']);

        $token = auth('api')->login($user);

        Watchlist::factory()->count(5)->create(['user_id' => $user->id]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/watchlist', [
            'uuid' => 'coin-6',
            'name' => 'Coin Six',
            'symbol' => 'C6',
            'price' => 100,
        ]);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Criptomoneda añadida a tu lista de seguimiento.',
                ]);
    }

    /** @test */
    public function a_user_on_trial_can_add_more_than_five_coins()
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => now()->addDays(7),
            'has_used_trial' => false,
        ]);

        $token = auth('api')->login($user);

        Watchlist::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/watchlist', [
            'uuid' => 'coin-6',
            'name' => 'Coin Six',
            'symbol' => 'C6',
            'price' => 100,
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Criptomoneda añadida a tu lista de seguimiento.',
                 ]);
    }
}
