<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\WatchlistController;

class WatchlistTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function cannot_add_duplicate_coin()
    {
        $user = User::factory()->create();
        $user->watchlist()->create([
            'coin_uuid' => 'bitcoin-uuid',
            'name' => 'Bitcoin',
            'symbol' => 'BTC',
            'price' => 50000,
        ]);

        $controller = new WatchlistController();
        $request = new Request([
            'uuid' => 'bitcoin-uuid',
            'name' => 'Bitcoin',
            'symbol' => 'BTC',
            'price' => 50000,
        ]);

        $this->actingAs($user, 'api');
        $response = $controller->store($request);
        $data = $response->getData(true);

        $this->assertEquals(409, $response->getStatusCode());
        $this->assertFalse($data['success']);
        $this->assertEquals('Esta criptomoneda ya está en tu lista de seguimiento.', $data['message']);
    }

    /** @test */
    public function normal_user_cannot_exceed_5_coins()
    {
        $user = User::factory()->create(['rol' => 'normal']);
        $user->watchlist()->createMany(
            collect(range(1,5))->map(fn($i) => [
                'coin_uuid' => "uuid-$i",
                'name' => "Coin $i",
                'symbol' => "C$i",
                'price' => 100,
            ])->toArray()
        );

        $controller = new WatchlistController();
        $request = new Request([
            'uuid' => 'uuid-6',
            'name' => 'Coin 6',
            'symbol' => 'C6',
            'price' => 100,
        ]);

        $this->actingAs($user, 'api');
        $response = $controller->store($request);
        $data = $response->getData(true);

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertFalse($data['success']);
    }

    /** @test */
    public function pro_user_can_add_more_than_5_coins()
    {
        $user = User::factory()->create(['rol' => 'pro']);
        $user->watchlist()->createMany(
            collect(range(1,5))->map(fn($i) => [
                'coin_uuid' => "uuid-$i",
                'name' => "Coin $i",
                'symbol' => "C$i",
                'price' => 100,
            ])->toArray()
        );

        $controller = new WatchlistController();

        // Mock de Http::get para no depender de la API externa
        Http::fake([
            '*' => Http::response(['data' => ['coin' => ['price' => 123]]], 200)
        ]);

        $request = new Request([
            'uuid' => 'uuid-6',
            'name' => 'Coin 6',
            'symbol' => 'C6',
            'price' => 100,
        ]);

        $this->actingAs($user, 'api');
        $response = $controller->store($request);
        $data = $response->getData(true);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertTrue($data['success']);
        $this->assertEquals('Criptomoneda añadida a tu lista de seguimiento.', $data['message']);
    }

    /** @test */
    public function index_returns_coins_with_mocked_prices()
    {
        $user = User::factory()->create();
        $coin = Watchlist::factory()->create([
            'user_id' => $user->id,
            'coin_uuid' => 'bitcoin-uuid',
            'name' => 'Bitcoin',
            'symbol' => 'BTC',
            'price' => 50000,
        ]);

        Http::fake([
            '*' => Http::response([
                'data' => [
                    'coin' => ['price' => 60000, 'change' => 5, 'marketCap' => 1000000]
                ]
            ], 200)
        ]);

        $controller = new WatchlistController();
        $this->actingAs($user, 'api');

        $response = $controller->index();
        $data = $response->getData(true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['data']);
        $this->assertEquals(60000, $data['data'][0]['price']);
        $this->assertEquals(5, $data['data'][0]['change']);
        $this->assertEquals(1000000, $data['data'][0]['market_cap']);
    }
}
