<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicePricesSeeder extends Seeder
{
    public function run(): void
    {
        $serviceTypes = DB::table('service_types')->get();

        $produk = [
            ['nama_produk' => 'Rok & Blouse', 'wet_laundry' => 15000, 'dry_cleaning' => 22000],
            ['nama_produk' => 'Long Dress', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Blazer', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Blouse', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Kebaya Pendek', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Kebaya Panjang', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Jubah/Gamis', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Jas Stelan', 'wet_laundry' => 30000, 'dry_cleaning' => 35000],
            ['nama_produk' => 'Safari Stelan', 'wet_laundry' => 25000, 'dry_cleaning' => 30000],
            ['nama_produk' => 'Celana Pendek', 'wet_laundry' => 8000, 'dry_cleaning' => 10000],
            ['nama_produk' => 'Celana Panjang', 'wet_laundry' => 15000, 'dry_cleaning' => 17000],
            ['nama_produk' => 'Jeans', 'wet_laundry' => 16000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Kemeja Pendek', 'wet_laundry' => 17000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Kemeja Panjang', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Kemeja Batik Pendek', 'wet_laundry' => 17000, 'dry_cleaning' => 22000],
            ['nama_produk' => 'Kemeja Batik Panjang', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Jaket Biasa', 'wet_laundry' => 15000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Sweater', 'wet_laundry' => 15000, 'dry_cleaning' => 22000],
            ['nama_produk' => 'Baju Anak-Anak', 'wet_laundry' => 10000, 'dry_cleaning' => 12000],
            ['nama_produk' => 'Busana Muslim', 'wet_laundry' => 25000, 'dry_cleaning' => 30000],
            ['nama_produk' => 'Mukena Stelan', 'wet_laundry' => 18000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Kaos Pendek', 'wet_laundry' => 10000, 'dry_cleaning' => 15000],
            ['nama_produk' => 'Kaos Panjang', 'wet_laundry' => 12000, 'dry_cleaning' => 15000],
            ['nama_produk' => 'Sarung Biasa', 'wet_laundry' => 12000, 'dry_cleaning' => 15000],
            ['nama_produk' => 'Sarung Songket', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Taplak Meja Besar', 'wet_laundry' => 10000, 'dry_cleaning' => 12000],
            ['nama_produk' => 'Taplak Meja Kecil', 'wet_laundry' => 8000, 'dry_cleaning' => 10000],
            ['nama_produk' => 'Sprei Set', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Gorden Tebal Per meter', 'wet_laundry' => 5000, 'dry_cleaning' => 6000],
            ['nama_produk' => 'Gorden Tipis Per Meter', 'wet_laundry' => 4000, 'dry_cleaning' => 5000],
            ['nama_produk' => 'Karpet Tebal per Meter', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Karpet Tipis Per Meter', 'wet_laundry' => 10000, 'dry_cleaning' => 15000],
            ['nama_produk' => 'Boneka Kecil', 'wet_laundry' => 10000, 'dry_cleaning' => 15000],
            ['nama_produk' => 'Boneka Sedang', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Boneka Besar', 'wet_laundry' => 30000, 'dry_cleaning' => 35000],
            ['nama_produk' => 'Boneka Jumbo', 'wet_laundry' => 40000, 'dry_cleaning' => 45000],
            ['nama_produk' => 'Bed Cover Jumbo XL', 'wet_laundry' => 50000, 'dry_cleaning' => 55000],
            ['nama_produk' => 'Bed Cover Besar L', 'wet_laundry' => 40000, 'dry_cleaning' => 45000],
            ['nama_produk' => 'Bed Cover Sedang M', 'wet_laundry' => 30000, 'dry_cleaning' => 35000],
            ['nama_produk' => 'Bed Cover Kecil S', 'wet_laundry' => 20000, 'dry_cleaning' => 25000],
            ['nama_produk' => 'Handuk', 'wet_laundry' => 10000, 'dry_cleaning' => 15000],
            ['nama_produk' => 'Sajadah', 'wet_laundry' => 15000, 'dry_cleaning' => 20000],
            ['nama_produk' => 'Sepatu', 'wet_laundry' => 30000, 'dry_cleaning' => 0],
            ['nama_produk' => 'TAS', 'wet_laundry' => 25000, 'dry_cleaning' => 25000],

            ['nama_produk' => 'Kiloan', 'harga' => 5000],
            ['nama_produk' => 'Cuci Kiloan', 'harga' => 4000],
            ['nama_produk' => 'Gosok Kiloan', 'harga' => 3500],
        ];

        $data = [];
        foreach ($produk as $item) {
            if (isset($item['wet_laundry']) && isset($item['dry_cleaning'])) {
                // Produk dengan wet dan dry cleaning
                $data[] = [
                    'service_types_id' => 1, // Reguler
                    'nama_produk' => $item['nama_produk'],
                    'laundry_types' => 'Wet Laundry',
                    'harga' => $item['wet_laundry'],
                ];
                $data[] = [
                    'service_types_id' => 1, // Reguler
                    'nama_produk' => $item['nama_produk'],
                    'laundry_types' => 'Dry Cleaning',
                    'harga' => $item['dry_cleaning'],
                ];
                // Tambahan harga untuk Oneday dan Express
                $data[] = [
                    'service_types_id' => 2, // Oneday
                    'nama_produk' => $item['nama_produk'],
                    'laundry_types' => 'Wet Laundry',
                    'harga' => $item['wet_laundry'] + 4000,
                ];
                $data[] = [
                    'service_types_id' => 2, // Oneday
                    'nama_produk' => $item['nama_produk'],
                    'laundry_types' => 'Dry Cleaning',
                    'harga' => $item['dry_cleaning'] + 4000,
                ];
                $data[] = [
                    'service_types_id' => 3, // Express
                    'nama_produk' => $item['nama_produk'],
                    'laundry_types' => 'Wet Laundry',
                    'harga' => $item['wet_laundry'] + 10000,
                ];
                $data[] = [
                    'service_types_id' => 3, // Express
                    'nama_produk' => $item['nama_produk'],
                    'laundry_types' => 'Dry Cleaning',
                    'harga' => $item['dry_cleaning'] + 10000,
                ];
            } 
            if (isset($item['harga'])) {
                foreach ($serviceTypes as $type) {
                    echo "Service Type: {$type->jenis_pelayanan}\n";
                    $extraCost = 0;
                    if (strtolower($type->jenis_pelayanan) === 'oneday') $extraCost = 4000;
                    if (strtolower($type->jenis_pelayanan) === 'express') $extraCost = 10000;
                
                    $finalPrice = $item['harga'] + $extraCost;
                    echo "Produk: {$item['nama_produk']}, Service Type: {$type->jenis_pelayanan}, Harga Akhir: $finalPrice\n";
                
                    $data[] = [
                        'service_types_id' => $type->id,
                        'nama_produk' => $item['nama_produk'],
                        'laundry_types' => null,
                        'harga' => $finalPrice,
                    ];
                }
                
            }                      
        }
        DB::table('service_prices')->insert($data);
    }
}
