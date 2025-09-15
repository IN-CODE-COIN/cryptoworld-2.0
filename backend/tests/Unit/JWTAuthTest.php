<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JWTAuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function genera_token_para_usuario_valido()
    {
        $user = User::factory()->create();

        $token = JWTAuth::fromUser($user);

        $this->assertNotEmpty($token);
        $this->assertIsString($token);
    }

    /** @test */
    public function token_invalido_es_rechazado()
    {
        $invalidToken = 'fake.invalid.token';

        $this->withHeaders([
                'Authorization' => "Bearer {$invalidToken}",
            ])
            ->getJson('/api/cartera')
            ->assertStatus(401);
    }
}
