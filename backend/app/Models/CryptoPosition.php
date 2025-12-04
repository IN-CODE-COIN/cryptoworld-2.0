<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperCryptoPosition
 * @property int $id
 * @property int $user_id
 * @property string $crypto_id
 * @property string $crypto_name
 * @property string $amount
 * @property string $average_price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $invested_usd
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CryptoTransaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CryptoPositionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereAveragePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereCryptoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereCryptoName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereInvestedUsd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoPosition whereUserId($value)
 * @mixin \Eloquent
 */
class CryptoPosition extends Model
{
    protected $table = 'crypto_positions';
    
    protected $fillable = ['user_id', 'crypto_id', 'crypto_name', 'amount', 'average_price', 'invested_usd'];

    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(CryptoTransaction::class);
    }
}
