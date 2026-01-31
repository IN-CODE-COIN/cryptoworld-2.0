<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\CoinLoreService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CoinLoreService::class, function () {
            return new CoinLoreService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
