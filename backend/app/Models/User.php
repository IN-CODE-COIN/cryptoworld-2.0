<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Watchlist;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @mixin IdeHelperUser
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string $balance
 * @property string $rol
 * @property string|null $frequency
 * @property \Illuminate\Support\Carbon|null $trial_ends_at
 * @property bool $has_used_trial
 * @property \Illuminate\Support\Carbon|null $pro_started_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CryptoPosition> $cryptoPositions
 * @property-read int|null $crypto_positions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CryptoTransaction> $cryptoTransactions
 * @property-read int|null $crypto_transactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FundMovement> $fundMovements
 * @property-read int|null $fund_movements_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Watchlist> $watchlist
 * @property-read int|null $watchlist_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereHasUsedTrial($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRol($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTrialEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @mixin \Eloquent
 */
/**
 * @property-read \Illuminate\Database\Eloquent\Collection|Watchlist[] $watchlist
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
