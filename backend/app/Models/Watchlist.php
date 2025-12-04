<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperWatchlist
 * @property int $id
 * @property int $user_id
 * @property string $coin_uuid
 * @property string $name
 * @property string $symbol
 * @property string|null $icon_url
 * @property string|null $price
 * @property string|null $change
 * @property int|null $market_cap
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\WatchlistFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereChange($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereCoinUuid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereIconUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereMarketCap($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereSymbol($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Watchlist whereUserId($value)
 * @mixin \Eloquent
 */
class Watchlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'coin_uuid',
        'name',
        'symbol',
        'icon_url',
        'price',
        'change',
        'market_cap',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
