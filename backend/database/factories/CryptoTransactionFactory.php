<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CryptoTransaction;

class CryptoTransactionFactory extends Factory
{
    protected $model = CryptoTransaction::class;

    public function definition()
    {
        return [
            'user_id' => null,
            'crypto_position_id' => null,
            'type' => $this->faker->randomElement(['buy','sell']),
            'quantity' => $this->faker->randomFloat(8, 0.01, 10),
            'amount_usd' => $this->faker->randomFloat(2, 1, 10000),
            'price_usd' => $this->faker->randomFloat(2, 1, 5000),
            'fees' => $this->faker->randomFloat(2, 0, 100),
            'total_cost' => $this->faker->randomFloat(2, 1, 10000),
            'date' => now(),
        ];
    }
}
