<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\Api\Auth\AuthController;

class MailTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_fails_if_email_is_already_taken()
    {
        User::factory()->create([
            'email' => 'juan@example.com',
        ]);

        $request = new Request([
            'name' => 'Juan 2',
            'email' => 'juan@example.com',
            'password' => 'secret123',
        ]);

        $controller = new AuthController();

        $response = $controller->register($request);
        $data = $response->getData(true);

        $this->assertEquals(422, $response->getStatusCode());
        $this->assertArrayHasKey('email', $data);
    }
}
