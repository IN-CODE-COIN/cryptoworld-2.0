<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_registers_a_user_successfully()
    {
        // Fakeamos el JWTAuth para no generar un token real
        JWTAuth::shouldReceive('fromUser')->once()->andReturn('fake-jwt-token');

        $request = new Request([
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'password' => 'secret123',
        ]);

        $controller = new AuthController();

        $response = $controller->register($request);
        $data = $response->getData(true);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('token', $data);
        $this->assertEquals('fake-jwt-token', $data['token']);
        $this->assertDatabaseHas('users', ['email' => 'juan@example.com']);
    }

    /** @test */
    public function it_fails_validation_if_email_is_invalid()
    {
        $request = new Request([
            'name' => 'Juan',
            'email' => 'not-an-email',
            'password' => 'secret123',
        ]);

        $controller = new AuthController();

        $response = $controller->register($request);
        $data = $response->getData(true);

        $this->assertEquals(422, $response->getStatusCode());
        $this->assertArrayHasKey('email', $data);
    }

    /** @test */
    public function it_logs_in_user_with_valid_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret123'),
        ]);

        JWTAuth::shouldReceive('attempt')
            ->once()
            ->with(['email' => $user->email, 'password' => 'secret123'])
            ->andReturn('fake-jwt-token');

        JWTAuth::shouldReceive('user')->andReturn($user);

        $request = new Request([
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $controller = new AuthController();
        $response = $controller->login($request);
        $data = $response->getData(true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('fake-jwt-token', $data['token']);
    }
}
