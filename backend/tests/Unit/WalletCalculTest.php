<?php

namespace Tests\Unit;

use Tests\TestCase;

class WalletCalculTest extends TestCase
{
    /** @test */
    public function calcula_profit_y_total_change_correctamente()
    {
        $investedUsd = 100;
        $amount = 2;
        $currentPrice = 75;

        $currentValue = $currentPrice * $amount;
        $profit = $currentValue - $investedUsd;
        $change = ($profit / $investedUsd) * 100;

        $this->assertEquals(150, $currentValue);
        $this->assertEquals(50, $profit);
        $this->assertEquals(50, $change);
    }

    /** @test */
    public function evita_division_por_cero_en_total_change()
    {
        $investedUsd = 0;
        $profit = 100;

        $change = $investedUsd > 0 ? ($profit / $investedUsd) * 100 : 0;

        $this->assertEquals(0, $change);
    }
}
