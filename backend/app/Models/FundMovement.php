<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperFundMovement
 */
class FundMovement extends Model
{
    use HasFactory;
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $fillable = ['user_id', 'type', 'amount', 'description', 'method', 'date'];

    protected $casts = [
        'date' => 'datetime',
    ];

}
