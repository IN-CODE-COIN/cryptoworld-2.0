<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CryptoPosition;

class CryptoPositionFactory extends Factory
{
    protected $model = CryptoPosition::class;

    public function definition()
    {
        return [
            'user_id' => null, // lo definirás en el test
            'crypto_id' => $this->faker->uuid,
            'crypto_name' => $this->faker->word,
            'amount' => $this->faker->randomFloat(8, 0, 10),
            'average_price' => $this->faker->randomFloat(2, 1, 50000),
            'invested_usd' => $this->faker->randomFloat(2, 1, 100000),
        ];
    }
}
