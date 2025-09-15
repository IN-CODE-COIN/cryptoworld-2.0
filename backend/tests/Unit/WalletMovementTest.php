<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\WalletController;

class WalletMovementTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function registra_un_deposito_correctamente()
    {
        $user = User::factory()->create(['balance' => 0]);

        $controller = new WalletController();

        $request = new Request([
            'type' => 'deposito',
            'amount' => 100,
            'description' => 'Primer depósito',
            'method' => 'transfer',
        ]);

        // Simulamos que el usuario está autenticado
        $this->actingAs($user, 'api');

        $response = $controller->store($request);
        $data = $response->getData(true);

        // Verificaciones
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals('success', $data['status']);
        $this->assertEquals(100, $data['balance']);
        $this->assertEquals('Primer depósito', $data['movement']['description']);
    }

    /** @test */
    public function actualiza_la_descripcion_de_un_movimiento()
    {
        $user = User::factory()->create(['balance' => 100]);

        $movement = $user->fundMovements()->create([
            'user_id' => $user->id,
            'type' => 'deposito',
            'amount' => 100,
            'description' => 'Depósito inicial',
            'method' => 'transfer',
            'date' => now(),
        ]);

        $controller = new WalletController();

        $request = new Request([
            'description' => 'Depósito actualizado',
        ]);

        $this->actingAs($user, 'api');

        $response = $controller->update($request, $movement->id);
        $data = $response->getData(true);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals('success', $data['status']);
        $this->assertEquals('Depósito actualizado', $data['movement']['description']);
    }
}
