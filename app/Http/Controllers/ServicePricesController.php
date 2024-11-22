<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServicePrice;

class ServicePricesController extends Controller
{
    public function getPricesByServiceType($serviceTypeId) {
        $servicePrices = ServicePrice::with('serviceType')
            ->where('service_types_id', $serviceTypeId)
            ->get();

        return response()->json($servicePrices);
    }
}
