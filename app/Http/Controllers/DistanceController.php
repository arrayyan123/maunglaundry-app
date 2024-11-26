<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class DistanceController extends Controller
{
    public function calculateDistance(Request $request)
    {
        $customerAddress = $request->input('address');
        
        // Lokasi tetap Maung Laundry
        $start = [
            'latitude' => -6.2022524,
            'longitude' => 106.6954483
        ];

        if (!$customerAddress) {
            return response()->json(['error' => 'Customer address is required'], 400);
        }

        // Mendapatkan koordinat dari alamat customer
        $end = $this->getCoordinatesFromAddress($customerAddress);

        if (!$end) {
            return response()->json(['error' => 'Failed to fetch coordinates for the address'], 400);
        }

        $distance = $this->haversine(
            $start['latitude'], $start['longitude'],
            $end['latitude'], $end['longitude']
        );

        return response()->json(['distance' => $distance]);
    }

    private function getCoordinatesFromAddress($address)
    {
        $url = "https://nominatim.openstreetmap.org/search.php?q=" . urlencode($address) . "&format=jsonv2&limit=1";
    
        // Permintaan HTTP dengan User-Agent
        $response = Http::withHeaders([
            'User-Agent' => 'My Laravel App (your-email@example.com)'
        ])->get($url);
    
        // Jika gagal, kembalikan null
        if ($response->failed() || empty($response->json())) {
            Log::error("Failed to fetch coordinates from Nominatim", ['response' => $response->body()]);
            return null;
        }
    
        $result = $response->json();
    
        // Jika tidak ada hasil
        if (empty($result[0])) {
            Log::warning("No results found for address", ['address' => $address]);
            return null;
        }
    
        // Ambil latitude dan longitude dari respons
        return [
            'latitude' => $result[0]['lat'],
            'longitude' => $result[0]['lon'],
        ];
    }
    

    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Radius bumi dalam kilometer

        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);

        $latDelta = $lat2 - $lat1;
        $lonDelta = $lon2 - $lon1;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($lat1) * cos($lat2) *
            sin($lonDelta / 2) * sin($lonDelta / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
