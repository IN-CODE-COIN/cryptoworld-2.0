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
        Schema::create('crypto_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('crypto_position_id')->constrained('crypto_positions')->onDelete('cascade');
            $table->enum('type', ['buy', 'sell']);
            $table->decimal('quantity', 18, 8);
            $table->decimal('amount_usd', 18, 2);
            $table->decimal('price_usd', 18, 2);
            $table->decimal('fees', 18, 2)->default(0);
            $table->decimal('total_cost', 18, 2);
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_transactions');
    }
};
