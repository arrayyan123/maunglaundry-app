<?php

namespace Database\Seeders;

use App\Models\CustomerUser;
use Google\Service\CloudControlsPartnerService\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class CustomerUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            ['name' => 'RIAN', 'phone' => '+6287774535460', 'address' => null],
            ['name' => 'RENATA', 'phone' => '+6285280574153', 'address' => null],
            ['name' => 'MANIA-H26', 'phone' => '+628829431831', 'address' => 'TAMAN MUTIARA H26'],
            ['name' => 'EVA TM E-16', 'phone' => '+628129675201', 'address' => 'TAMAN MUTIARA E16'],
            ['name' => 'JAROT - AYAM', 'phone' => '+6283162812179', 'address' => 'TOKO SEBELAH'],
            ['name' => 'ANAS - DIGITAL PRINTING', 'phone' => '+6281382379237', 'address' => 'PURNAMA DIGITAL PRINTING'],
            ['name' => 'AMRI - DIGITAL PRINTING', 'phone' => '+6289900000001', 'address' => 'PURNAMA DIGITAL PRINTING'], // Dummy Number
            ['name' => 'DENI - DIGITAL PRINTING', 'phone' => '+6289900000002', 'address' => 'PURNAMA DIGITAL PRINTING'], // Dummy Number
            ['name' => 'DEDE SUJADI TM-F9', 'phone' => '+6281210371259', 'address' => 'TAMAN MUTIARA F9'],
            ['name' => 'OGIE / SITI TM - G26', 'phone' => '+6282180900239', 'address' => 'TAMAN MUTIARA G-26'],
            ['name' => 'BUDI', 'phone' => '+6285702454274', 'address' => 'SYIFA JAYA BENGKEL'],
            ['name' => 'KOBEK', 'phone' => '+6285817853357', 'address' => 'GANG DEPAN SEBRANG LAUNDRY'],
        ];

        foreach ($customers as $customer) {
            CustomerUser::create([
                'name' => $customer['name'],
                'email' => null,
                'password' => isset($customer['phone']) ? Hash::make($customer['phone']) : null,
                'phone' => $customer['phone'],
                'address' => $customer['address'],
            ]);
        }
    }
}
