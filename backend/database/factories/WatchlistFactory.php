<?php

namespace Database\Factories;

use App\Models\Watchlist;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class WatchlistFactory extends Factory
{
    protected $model = Watchlist::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'coin_uuid' => $this->faker->uuid(),
            'name' => $this->faker->word(),
            'symbol' => strtoupper($this->faker->lexify('???')),
            'icon_url' => $this->faker->imageUrl(64, 64),
            'price' => $this->faker->randomFloat(2, 1, 50000),
            'change' => $this->faker->randomFloat(2, -10, 10),
            'market_cap' => $this->faker->randomNumber(9),
        ];
    }
}
