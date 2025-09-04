<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\CryptoPosition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class CryptoTransactionControllerTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function create_returns_cryptos_in_wallet()
    {
        $user = User::factory()->create();
        CryptoPosition::factory()->create([
            'user_id' => $user->id,
            'crypto_id' => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'amount' => 1,
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/cartera/transaction/create');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'cryptos' => [
                         ['crypto_id' => 'bitcoin', 'crypto_name' => 'Bitcoin']
                     ]
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function store_creates_buy_transaction_and_updates_balance()
    {
        $user = User::factory()->create(['balance' => 1000]);
        $token = auth('api')->login($user);

        $payload = [
            'crypto_id'   => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'type'        => 'buy',
            'date'        => Carbon::now()->toDateTimeString(),
            'amount_usd'  => 500,
            'price_usd'   => 500,
            'quantity'    => 1,
            'fees'        => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/cartera/transaction', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'status'  => 'success',
                     'balance' => 1000 - (500 + 10), // totalCost
                 ]);

        $this->assertDatabaseHas('crypto_positions', [
            'user_id' => $user->id,
            'crypto_id' => 'bitcoin',
            'amount' => 1,
        ]);

        $this->assertDatabaseHas('fund_movements', [
            'user_id' => $user->id,
            'type'    => 'retirada',
            'amount'  => -500,
        ]);

        $this->assertDatabaseHas('fund_movements', [
            'user_id' => $user->id,
            'type'    => 'retirada',
            'amount'  => -10,
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function store_creates_sell_transaction_and_updates_balance()
    {
        $user = User::factory()->create(['balance' => 0]);
        CryptoPosition::factory()->create([
            'user_id' => $user->id,
            'crypto_id' => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'amount' => 2,
            'average_price' => 400,
            'invested_usd' => 800,
        ]);

        $token = auth('api')->login($user);

        $payload = [
            'crypto_id'   => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'type'        => 'sell',
            'date'        => Carbon::now()->toDateTimeString(),
            'amount_usd'  => 500,
            'price_usd'   => 500,
            'quantity'    => 1,
            'fees'        => 10,
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/cartera/transaction', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'status' => 'success',
                     'balance' => 500 - 10, // netTotal
                 ]);

        $this->assertDatabaseHas('crypto_positions', [
            'user_id' => $user->id,
            'crypto_id' => 'bitcoin',
            'amount' => 1,
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function store_buy_fails_with_insufficient_balance()
    {
        $user = User::factory()->create(['balance' => 100]);
        $token = auth('api')->login($user);

        $payload = [
            'crypto_id'   => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'type'        => 'buy',
            'date'        => Carbon::now()->toDateTimeString(),
            'amount_usd'  => 200,
            'price_usd'   => 200,
            'quantity'    => 1,
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/cartera/transaction', $payload);

        $response->assertStatus(422)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'No tienes saldo suficiente para esta compra.',
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function store_sell_fails_with_insufficient_crypto()
    {
        $user = User::factory()->create(['balance' => 0]);
        CryptoPosition::factory()->create([
            'user_id' => $user->id,
            'crypto_id' => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'amount' => 0.5,
        ]);

        $token = auth('api')->login($user);

        $payload = [
            'crypto_id'   => 'bitcoin',
            'crypto_name' => 'Bitcoin',
            'type'        => 'sell',
            'date'        => Carbon::now()->toDateTimeString(),
            'amount_usd'  => 500,
            'price_usd'   => 500,
            'quantity'    => 1,
        ];

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/cartera/transaction', $payload);

        $response->assertStatus(422)
                 ->assertJson([
                     'status' => 'error',
                     'message' => 'No tienes suficientes criptomonedas para esta venta.',
                 ]);
    }
}
