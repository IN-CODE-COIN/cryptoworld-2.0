<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
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
	#[\AllowDynamicProperties]
	class IdeHelperCryptoPosition {}
}

namespace App\Models{
/**
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
	#[\AllowDynamicProperties]
	class IdeHelperCryptoTransaction {}
}

namespace App\Models{
/**
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
	#[\AllowDynamicProperties]
	class IdeHelperFundMovement {}
}

namespace App\Models{
/**
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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Watchlist> $watchlist
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
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

namespace App\Models{
/**
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
	#[\AllowDynamicProperties]
	class IdeHelperWatchlist {}
}

