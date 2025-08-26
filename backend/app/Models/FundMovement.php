<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FundMovement extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $fillable = ['user_id', 'type', 'amount', 'description', 'method', 'date'];

    protected $casts = [
        'date' => 'datetime',
    ];

}
