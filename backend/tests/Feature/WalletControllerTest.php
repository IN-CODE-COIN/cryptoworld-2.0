<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\FundMovement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WalletControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function index_returns_balance_movements_and_positions()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        // Creamos algunos movimientos
        FundMovement::factory()->count(3)->create([
            'user_id' => $user->id,
            'amount' => 100,
        ]);

        // Simulamos posiciones de criptos
        $user->cryptoPositions()->create([
            'crypto_id' => 'coin-1',
            'crypto_name' => 'BTC',
            'amount' => 2,
            'invested_usd' => 40000,
            'average_price' => 20000,
        ]);

        Http::fake([
            'https://api.coinranking.com/v2/coin/coin-1' => Http::response([
                'data' => [
                    'coin' => ['price' => '25000']
                ]
            ], 200),
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/cartera');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'balance',
                     'movements',
                     'positions',
                     'totalValue',
                     'totalProfit',
                     'totalChange',
                 ]);
    }

    /** @test */
    public function create_returns_user_balance()
    {
        $user = User::factory()->create(['balance' => 500]);
        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/cartera/create');

        $response->assertStatus(200)
                 ->assertJson(['balance' => 500]);
    }

    /** @test */
    public function store_creates_a_deposit()
    {
        $user = User::factory()->create(['balance' => 0]);
        $token = auth('api')->login($user);

        $payload = [
            'type' => 'deposito',
            'amount' => 100,
            'description' => 'Primer depósito',
            'method' => 'card',
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/cartera', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'Movimiento registrado correctamente.',
                 ]);

        $this->assertDatabaseHas('fund_movements', [
            'user_id' => $user->id,
            'amount' => 100,
            'type' => 'deposito',
        ]);
    }

    /** @test */
    public function store_returns_error_if_withdrawal_exceeds_balance()
    {
        $user = User::factory()->create(['balance' => 50]);
        $token = auth('api')->login($user);

        $payload = [
            'type' => 'retirada',
            'amount' => 100,
            'description' => 'Retirada sin fondos',
            'method' => 'paypal',
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/cartera', $payload);

        $response->assertStatus(400)
                 ->assertJson([
                     'status' => 'error',
                 ]);
    }

    /** @test */
    public function show_returns_all_movements()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        FundMovement::factory()->create([
            'user_id' => $user->id,
            'amount' => 200,
            'type' => 'deposito',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/cartera/moves');

        $response->assertStatus(200)
                 ->assertJsonFragment(['amount' => 200]);
    }

    /** @test */
    public function update_changes_description_of_a_movement()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $movement = FundMovement::factory()->create([
            'user_id' => $user->id,
            'amount' => 100,
            'type' => 'deposito',
            'description' => 'Vieja descripción',
        ]);

        $payload = ['description' => 'Nueva descripción'];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->putJson("/api/cartera/{$movement->id}", $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'Descripción actualizada correctamente.',
                 ]);

        $this->assertDatabaseHas('fund_movements', [
            'id' => $movement->id,
            'description' => 'Nueva descripción',
        ]);
    }
}
