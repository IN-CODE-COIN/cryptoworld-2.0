<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('crypto_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('crypto_id');
            $table->string('crypto_name');
            $table->decimal('amount', 18, 8)->default(0);
            $table->decimal('average_price', 18, 2)->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'crypto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_positions');
    }
};
