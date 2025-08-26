<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
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
