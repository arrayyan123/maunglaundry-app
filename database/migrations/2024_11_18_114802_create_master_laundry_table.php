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
            $table->tinyInteger('durasi_hari')->comment('Lama durasi layanan dalam hari');
            $table->integer('harga_servis')->comment('Tambahan biaya berdasarkan layanan');
            $table->timestamps();
        });
        Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('service_types_id')
                ->constrained('service_types')
                ->onDelete('cascade');
            $table->string('nama_produk', 255);
            $table->string('laundry_types', 255)->nullable()->comment('Wet Laundry atau Dry Cleaning');
            $table->integer('harga');
            $table->timestamps();
        });        
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customer_users')->onDelete('cascade');
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable()->comment('Tanggal estimasi selesai');
            $table->string('status', 30)->default('ongoing');
            $table->string('job', 30);
            $table->string('description', 255)->nullable();
            $table->timestamps();
        });        
        Schema::create('detail_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
            $table->foreignId('service_prices_id')->constrained('service_prices')->onDelete('cascade');
            $table->foreignId('service_types_id')->constrained('service_types')->onDelete('cascade');
            $table->integer('quantity');
            $table->integer('price');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_types');
        Schema::dropIfExists('service_prices');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('detail_transactions');
    }
};