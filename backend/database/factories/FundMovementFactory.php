<?php

namespace Database\Factories;

use App\Models\FundMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FundMovementFactory extends Factory
{
    protected $model = FundMovement::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['deposito', 'retirada']),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'description' => $this->faker->sentence(),
            'method' => $this->faker->randomElement(['transfer', 'card', 'paypal']),
            'date' => now(),
        ];
    }
}
