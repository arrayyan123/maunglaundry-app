<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('service_types')->insert([
            ['jenis_pelayanan' => 'reguler', 'durasi_hari' => 4, 'harga_servis' => 0],
            ['jenis_pelayanan' => 'oneday', 'durasi_hari' => 1, 'harga_servis' => 4000],
            ['jenis_pelayanan' => 'express', 'durasi_hari' => 0.125, 'harga_servis' => 10000],
        ]);
    }
}
