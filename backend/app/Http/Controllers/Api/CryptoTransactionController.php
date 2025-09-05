<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CryptoPosition;
use App\Models\CryptoTransaction;
use App\Models\FundMovement;

class CryptoTransactionController extends Controller
{
    public function create()
    {
        $user = Auth::user();

        $cryptosInWallet = $user
            ->cryptoPositions()
            ->select('crypto_id', 'crypto_name')
            ->get();

        return response()->json([
            'status' => 'success',
            'cryptos' => $cryptosInWallet,
        ]);
    }


   public function store(Request $request)
    {
        $data = $request->validate([
            'crypto_id'   => 'required|string',
            'crypto_name' => 'required|string',
            'type'        => 'required|in:buy,sell',
            'date'        => 'required|date',
            'amount_usd'  => 'required|numeric|min:0.01',
            'price_usd'   => 'required|numeric|min:0.01',
            'quantity'    => 'required|numeric|min:0.00000001',
            'fees'        => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();
        $fees = $data['fees'] ?? 0;
        $grossTotal = $data['quantity'] * $data['price_usd'];
        $netTotal   = $grossTotal - $fees;
        $totalCost  = $grossTotal + $fees;

        $position = CryptoPosition::firstOrNew([
            'user_id'  => $user->id,
            'crypto_id'=> $data['crypto_id'],
        ]);
        $position->crypto_name = $data['crypto_name'];

        if ($data['type'] === 'buy') {
            if ($user->balance < $totalCost) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'No tienes saldo suficiente para esta compra.',
                ], 422);
            }

            $user->balance -= $totalCost;
            $user->save();

            $newAmount = $position->amount + $data['quantity'];
            $newAveragePrice = $position->amount == 0
                ? $data['price_usd']
                : (($position->average_price * $position->amount) + ($data['price_usd'] * $data['quantity'])) / $newAmount;

            $position->amount         = $newAmount;
            $position->average_price  = $newAveragePrice;
            $position->invested_usd  += $grossTotal;

            FundMovement::create([
                'user_id'    => $user->id,
                'type'       => 'retirada',
                'amount'     => -$grossTotal,
                'method'     => 'transfer',
                'description'=> "Compra de {$data['quantity']} {$data['crypto_name']} a \${$data['price_usd']} USD",
                'date'       => $data['date'],
            ]);
        } else {
            $position = $user->cryptoPositions()->where('crypto_id', $data['crypto_id'])->first();

            if (!$position) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'No tienes esta criptomoneda en tu cartera.',
                ], 422);
            }

            if ($position->amount < $data['quantity']) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'No tienes suficientes criptomonedas para esta venta.',
                ], 422);
            }

            $position->amount       -= $data['quantity'];
            $position->invested_usd -= $grossTotal;

            if ($position->amount <= 0) {
                $position->invested_usd = 0;
                $position->average_price = 0;
            }

            $user->balance += $netTotal;
            $user->save();

            FundMovement::create([
                'user_id'    => $user->id,
                'type'       => 'deposito',
                'amount'     => $grossTotal,
                'method'     => 'transfer',
                'description'=> "Venta de {$data['quantity']} {$data['crypto_name']} a \${$data['price_usd']} USD",
                'date'       => $data['date'],
            ]);
        }

        $position->invested_usd = max($position->invested_usd, 0);
        $position->save();

        if ($fees > 0) {
            FundMovement::create([
                'user_id'    => $user->id,
                'type'       => 'retirada',
                'amount'     => -$fees,
                'method'     => 'transfer',
                'description'=> "Comisión por {$data['type']} de {$data['crypto_name']}",
                'date'       => $data['date'],
            ]);
        }

        $transaction = CryptoTransaction::create([
            'user_id'            => $user->id,
            'crypto_position_id' => $position->id,
            'type'               => $data['type'],
            'quantity'           => $data['quantity'],
            'amount_usd'         => $data['amount_usd'],
            'price_usd'          => $data['price_usd'],
            'fees'               => $fees,
            'total_cost'         => $data['type'] === 'buy' ? $totalCost : $grossTotal,
            'date'               => $data['date'],
        ]);

        return response()->json([
            'status'      => 'success',
            'message'     => 'Transacción registrada correctamente.',
            'transaction' => $transaction,
            'position'    => $position,
            'balance'     => $user->balance,
        ], 201);
    }


}
