<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder
{
    public function run()
    {
        $paymentMethods = [
            ['name' => 'Cash', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Transfer', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'E-Wallet', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('payment_methods')->insert($paymentMethods);
    }
}
