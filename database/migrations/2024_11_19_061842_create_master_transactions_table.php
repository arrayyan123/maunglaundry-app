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
            $table->unsignedBigInteger('customer_id');
            $table->string('laundry_type');
            $table->string('payment_method');
            $table->string('status_payment');
            $table->string('status_job');
            $table->timestamps();
            $table->foreign('customer_id')->references('id')->on('customer_users')->onDelete('cascade');
        });
        
        
        Schema::create('detail_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id');
            $table->unsignedBigInteger('service_types_id');
            $table->unsignedBigInteger('service_prices_id');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        
            // Menambahkan foreign key
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');
            $table->foreign('service_types_id')->references('id')->on('service_types');
            $table->foreign('service_prices_id')->references('id')->on('service_prices');
        });
               
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transactions');
        Schema::dropIfExists('transactions');
    }
};
