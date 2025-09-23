<?php

namespace Tests\Unit;

use Tests\TestCase;

class InvestmentCalculationTest extends TestCase
{
    /**
     * @dataProvider investmentCases
     */
    public function test_calculate_profit_and_change($units, $buyPrice, $currentPrice, $expected)
    {
        $initialInvestment = round($units * $buyPrice, 2);
        $currentValue      = round($units * $currentPrice, 2);
        $profit            = round($currentValue - $initialInvestment, 2);
        $change            = round(($profit / $initialInvestment) * 100, 2);

        $this->assertEqualsWithDelta($expected['initialInvestment'], $initialInvestment, 0.01);
        $this->assertEqualsWithDelta($expected['currentValue'],      $currentValue, 0.01);
        $this->assertEqualsWithDelta($expected['profit'],            $profit, 0.01);
        $this->assertEqualsWithDelta($expected['profitPercentage'],  $change, 0.01);
    }

    public static function investmentCases()
    {
        return [
           'caso SOL' => [
                10.388983, 118, 219.93,
                [
                    'initialInvestment' => 1225.90,
                    'currentValue'      => 2284.85,
                    'profit'            => 1058.95,
                    'profitPercentage'  => 86.37
                ]
            ],
            'caso BTC' => [
                2, 20000, 25000,
                [
                    'initialInvestment' => 40000,
                    'currentValue'      => 50000,
                    'profit'            => 10000,
                    'profitPercentage'  => 25
                ]
            ],
            'caso sin ganancia' => [
                3, 100, 100,
                [
                    'initialInvestment' => 300,
                    'currentValue'      => 300,
                    'profit'            => 0,
                    'profitPercentage'  => 0
                ]
            ]
        ];
    }
}
