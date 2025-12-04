<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperFundMovement
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property string $amount
 * @property string $method
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\FundMovementFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FundMovement whereUserId($value)
 * @mixin \Eloquent
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
