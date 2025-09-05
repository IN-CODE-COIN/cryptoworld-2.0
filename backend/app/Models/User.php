<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @mixin IdeHelperUser
 */
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rol',
        'balance',
        'trial_ends_at',
        'has_used_trial',
        'pro_started_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'trial_ends_at' => 'datetime',
            'has_used_trial' => 'boolean',
            'pro_started_at' => 'date',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public function isPro()
    {
        return $this->rol === 'pro';
    }

    public function onTrial() {
        return $this->trial_ends_at && now()->lt($this->trial_ends_at);
    }

    public function watchlist()
    {
        return $this->hasMany(Watchlist::class);
    }

    public function fundMovements()
    {
        return $this->hasMany(FundMovement::class);
    }

    public function cryptoTransactions()
    {
        return $this->hasMany(CryptoTransaction::class);
    }

    public function cryptoPositions()
    {
        return $this->hasMany(CryptoPosition::class);
    }
}
