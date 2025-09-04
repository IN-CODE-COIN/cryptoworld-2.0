<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class PricingControllerTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function show_returns_user_role_and_trial_status(): void
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => Carbon::now()->addDays(3),
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/pricing');

        $response->assertStatus(200)
                 ->assertJson([
                     'rol' => 'normal',
                     'onTrial' => true,
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function start_trial_sets_trial_for_user(): void
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => null,
            'has_used_trial' => false,
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/start-trial');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Tu prueba gratuita ha comenzado y durará 7 días.',
                 ]);

        $this->assertNotNull($user->fresh()->trial_ends_at);
        $this->assertTrue($user->fresh()->has_used_trial);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function start_trial_fails_if_already_pro_or_used(): void
    {
        $user = User::factory()->create([
            'rol' => 'pro',
            'trial_ends_at' => null,
            'has_used_trial' => true,
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/start-trial');

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'Ya estás en Pro o ya usaste tu prueba.',
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function change_plan_can_upgrade_to_pro(): void
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => Carbon::now()->addDays(5),
            'pro_started_at' => null,
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/change-plan', [
            'rol' => 'pro',
            'frequency' => 'mensual',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Tu plan ha sido cambiado a pro.',
                 ]);

        $user = $user->fresh();
        $this->assertEquals('pro', $user->rol);
        $this->assertNull($user->trial_ends_at);
        $this->assertNotNull($user->pro_started_at);
        $this->assertEquals('mensual', $user->frequency);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function change_plan_can_downgrade_to_normal(): void
    {
        $user = User::factory()->create([
            'rol' => 'pro',
            'frequency' => 'anual',
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/change-plan', [
            'rol' => 'normal',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Tu plan ha sido cambiado a normal.',
                 ]);

        $user = $user->fresh();
        $this->assertEquals('normal', $user->rol);
        $this->assertNull($user->frequency);
    }
}
