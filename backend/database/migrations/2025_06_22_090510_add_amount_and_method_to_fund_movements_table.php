<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('fund_movements', function (Blueprint $table) {
            // Solo si el campo no existe o necesitas corregirlo
            if (!Schema::hasColumn('fund_movements', 'amount')) {
                $table->decimal('amount', 18, 2)->after('type');
            }

            if (!Schema::hasColumn('fund_movements', 'method')) {
                $table->string('method')->after('amount');
            }
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fund_movements', function (Blueprint $table) {
            $table->dropColumn(['amount', 'method']);
        });
    }
};
