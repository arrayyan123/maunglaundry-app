<?php

namespace App\Events;

use App\Models\Transaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TransactionStored implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $transaction;

    /**
     * Create a new event instance.
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
        Log::info('Broadcasting TransactionStored event', ['transaction' => $transaction]);

    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('transactions');
    }

    /**
     * Data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'customer_id' => $this->transaction->customer_id,
            'nama_produk' => $this->transaction->nama_produk,
            'laundry_type' => $this->transaction->laundry_type,
            'status_payment' => $this->transaction->status_payment,
            'status_job' => $this->transaction->status_job,
            'start_date' => $this->transaction->start_date,
            'end_date' => $this->transaction->end_date,
        ];
    }    
}