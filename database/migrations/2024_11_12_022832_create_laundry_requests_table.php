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
        Schema::create('laundry_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_user_id')->constrained('customer_users');
            $table->string('request_number')->unique();
            $table->text('description');
            $table->enum('service_type', ['regular', 'express', 'super_express']);
            $table->float('weight')->nullable();
            $table->enum('status', ['pending', 'approved', 'processing', 'completed', 'cancelled'])
                  ->default('pending');
            $table->text('pickup_address');
            $table->dateTime('pickup_time');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laundry_requests');
    }
};
