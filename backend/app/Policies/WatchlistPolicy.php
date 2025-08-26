<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class WatchlistPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can delete the watchlist entry.
     */
    public function delete(User $user, Watchlist $watchlist)
    {
        // Solo puede eliminar la fila si pertenece al usuario
        return $user->id === $watchlist->user_id;
    }
}
