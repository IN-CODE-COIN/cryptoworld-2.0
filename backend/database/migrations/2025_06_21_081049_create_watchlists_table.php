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
        Schema::create('watchlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('coin_uuid');
            $table->string('name');
            $table->string('symbol');
            $table->string('icon_url')->nullable();
            $table->decimal('price', 20, 10)->nullable();
            $table->decimal('change', 10, 2)->nullable();
            $table->bigInteger('market_cap')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watchlists');
    }
};
