<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laundry_request_id')->constrained('laundry_requests');
            $table->string('transaction_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])
                  ->default('unpaid');
            $table->enum('payment_method', ['cash', 'transfer', 'e-wallet'])
                  ->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
