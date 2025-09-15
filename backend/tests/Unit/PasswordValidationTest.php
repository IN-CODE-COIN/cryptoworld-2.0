<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Facades\Validator;

class PasswordValidationTest extends TestCase
{
    /** @test */
    public function rechaza_password_corta()
    {
        $validator = Validator::make(
            ['password' => '123'],
            ['password' => 'required|min:6']
        );

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }

    /** @test */
    public function acepta_password_valida()
    {
        $validator = Validator::make(
            ['password' => 'secret123'],
            ['password' => 'required|min:6']
        );

        $this->assertFalse($validator->fails());
    }
}
