<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\WatchlistController;
use App\Http\Controllers\Api\CryptoController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\CryptoTransactionController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\UserController;

/*Rutas protegidas*/
Route::middleware('auth.jwt')->group(function () {
    //** Rutas del user *//
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/me', [AuthController::class, 'me']);
    //* Rutas de watchlist *//
    Route::get('/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::delete('/watchlist/{watchlist}', [WatchlistController::class, 'destroy']);
    //* Rutas de cartera *//
    Route::get('/cartera', [WalletController::class, 'index']);
    Route::get('/cartera/create', [WalletController::class, 'create']);
    Route::post('/cartera', [WalletController::class, 'store']);
    Route::get('/cartera/moves', [WalletController::class, 'show']);
    //* Rutas para editar movimientos *//
    Route::put('/cartera/moves/{id}', [WalletController::class, 'update']);
    //* Rutas de operaciones *//
    Route::get('/cartera/transaction/create', [CryptoTransactionController::class, 'create']);
    Route::post('/cartera/transaction', [CryptoTransactionController::class, 'store']);
    //* Rutas del Pricing *//
    Route::get('/pricing', [PricingController::class, 'show']);
    Route::post('/start-trial', [PricingController::class, 'startTrial']);
    Route::post('/change-plan', [PricingController::class, 'changePlan']);
});

//*Ruta de prueba*//
Route::get('/ping', fn() => response()->json(['pong' => true]));

//* Login - Register *//
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
//* Home *//
Route::get('/home', [HomeController::class, 'index']);
//* Ruta de autocompletado *//
Route::get('/crypto/autocomplete', [CryptoController::class, 'autocomplete']);
//* Ruta precio/fecha *//
Route::get('/coin/price', [CryptoController::class, 'getPrice']);
//* Ruta de busqueda de criptomonedas *//
Route::get('/search-crypto', [CryptoController::class, 'search']);
//* Ruta de detalles cryptomonedas *//
Route::get('/crypto/{uuid}', [CryptoController::class, 'show']);




