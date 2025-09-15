<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\PricingController;
use Carbon\Carbon;

class PricingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function start_trial_sets_trial_correctly()
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => null,
            'has_used_trial' => false,
        ]);

        $this->actingAs($user, 'api');

        $controller = new PricingController();
        $response = $controller->startTrial();
        $data = $response->getData(true);

        $this->assertEquals('Tu prueba gratuita ha comenzado y durará 7 días.', $data['message']);
        $this->assertNotNull($user->fresh()->trial_ends_at);
        $this->assertTrue($user->fresh()->has_used_trial);
    }

    /** @test */
    public function start_trial_fails_if_already_pro_or_used()
    {
        $user = User::factory()->create([
            'rol' => 'pro',
            'trial_ends_at' => null,
            'has_used_trial' => true,
        ]);

        $this->actingAs($user, 'api');

        $controller = new PricingController();
        $response = $controller->startTrial();
        $data = $response->getData(true);

        $this->assertEquals('Ya estás en Pro o ya usaste tu prueba.', $data['message']);
        $this->assertEquals(400, $response->getStatusCode());
    }

    /** @test */
    public function change_plan_can_upgrade_to_pro()
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => Carbon::now()->addDays(5),
            'pro_started_at' => null,
        ]);

        $this->actingAs($user, 'api');

        $controller = new PricingController();
        $request = new Request([
            'rol' => 'pro',
            'frequency' => 'mensual',
        ]);

        $response = $controller->changePlan($request);
        $data = $response->getData(true);

        $user = $user->fresh();

        $this->assertEquals('pro', $user->rol);
        $this->assertNull($user->trial_ends_at);
        $this->assertNotNull($user->pro_started_at);
        $this->assertEquals('mensual', $user->frequency);
        $this->assertEquals('Tu plan ha sido cambiado a pro.', $data['message']);
    }

    /** @test */
    public function change_plan_can_downgrade_to_normal()
    {
        $user = User::factory()->create([
            'rol' => 'pro',
            'frequency' => 'anual',
        ]);

        $this->actingAs($user, 'api');

        $controller = new PricingController();
        $request = new Request([
            'rol' => 'normal',
        ]);

        $response = $controller->changePlan($request);
        $data = $response->getData(true);

        $user = $user->fresh();

        $this->assertEquals('normal', $user->rol);
        $this->assertNull($user->frequency);
        $this->assertEquals('Tu plan ha sido cambiado a normal.', $data['message']);
    }

    /** @test */
    public function show_returns_correct_trial_status()
    {
        $user = User::factory()->create([
            'rol' => 'normal',
            'trial_ends_at' => Carbon::now()->addDays(3),
        ]);

        $this->actingAs($user, 'api');

        $controller = new PricingController();
        $response = $controller->show();
        $data = $response->getData(true);

        $this->assertEquals('normal', $data['rol']);
        $this->assertTrue($data['onTrial']);
        $this->assertNotNull($data['trialEndsAt']);
    }
}
