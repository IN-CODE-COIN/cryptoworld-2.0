<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperCryptoTransaction
 * @property int $id
 * @property int $user_id
 * @property int $crypto_position_id
 * @property string $type
 * @property string $quantity
 * @property string $amount_usd
 * @property string $price_usd
 * @property string $fees
 * @property string $total_cost
 * @property string $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CryptoPosition $position
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CryptoTransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereAmountUsd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereCryptoPositionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereFees($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction wherePriceUsd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereTotalCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CryptoTransaction whereUserId($value)
 * @mixin \Eloquent
 */
class CryptoTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'crypto_position_id', 'type', 'quantity', 'price_usd', 'fees', 'total_cost', 'date', 'amount_usd'
    ];

    public function position()
    {
        return $this->belongsTo(CryptoPosition::class, 'crypto_position_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
