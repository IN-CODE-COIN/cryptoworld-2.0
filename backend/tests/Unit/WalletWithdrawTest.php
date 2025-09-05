<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tymon\JWTAuth\Facades\JWTAuth;

class WalletWithdrawTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function no_permite_retirar_si_el_saldo_es_insuficiente()
    {
        $user = User::factory()->create(['balance' => 50]);

        $token = JWTAuth::fromUser($user);

        $this->withHeaders([
                'Authorization' => "Bearer {$token}",
            ])
            ->postJson('/api/cartera', [
                'type' => 'retirada',
                'amount' => 100,
                'method' => 'transfer',
            ])
            ->assertStatus(400)
            ->assertJson([
                'status' => 'error',
            ]);
    }
}
