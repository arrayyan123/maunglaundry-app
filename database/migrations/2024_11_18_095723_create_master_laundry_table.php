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
        Schema::create('service_types', function (Blueprint $table) {
            $table->id();
            $table->string('jenis_pelayanan', 30);
            $table->tinyInteger('durasi_hari');
            $table->integer('harga_service')->default(0);
            $table->timestamps();
        });

        Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_types_id')->constrained()->onDelete('cascade'); // Tambahkan ini
            $table->string('nama_produk');
            $table->string('laundry_types')->nullable();
            $table->decimal('harga', 10, 2);
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('phone_number');
            $table->datetime('start_date');
            $table->datetime('end_date');
            $table->string('status')->default('pending');
            $table->string('job')->default('pending');
            $table->enum('payment_method', ['cash', 'transfer', 'e-wallet']);
            $table->string('payment_status')->default('unpaid');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('detail_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained();
            $table->foreignId('service_prices_id')->constrained();
            $table->foreignId('service_types_id')->constrained();
            $table->decimal('quantity', 8, 2);
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transactions');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('service_prices');
        Schema::dropIfExists('service_types');
    }
};
