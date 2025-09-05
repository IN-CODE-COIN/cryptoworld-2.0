<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperCryptoTransaction
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
