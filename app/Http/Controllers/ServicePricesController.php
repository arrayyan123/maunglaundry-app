<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServicePrice;
use App\Models\ServiceType;

class ServicePricesController extends Controller
{
    public function getPricesByServiceType($serviceTypeId) {
        $servicePrices = ServicePrice::with('serviceType')
            ->where('service_types_id', $serviceTypeId)
            ->get();

        return response()->json($servicePrices);
    }
    public function index()
    {
        $serviceTypes = ServiceType::all();
        return inertia('ServicePrices', [
            'serviceTypes' => $serviceTypes,
        ]);
    }

    public function getPrices(Request $request)
    {
        $serviceTypeId = $request->service_type_id;
        $laundryType = $request->laundry_type;

        $servicePrices = ServicePrice::where('service_types_id', $serviceTypeId)
            ->when($laundryType, function ($query, $laundryType) {
                return $query->where('laundry_types', $laundryType);
            })
            ->get();

        return response()->json($servicePrices);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_types_id' => 'required|exists:service_types,id',
            'nama_produk' => 'required|string|max:255',
            'laundry_types' => 'nullable|string|in:Wet Laundry,Dry Cleaning,Tanpa Kategori',
            'harga' => 'required|numeric|min:0',
        ]);

        $servicePrice = ServicePrice::create($request->all());

        return response()->json(['message' => 'Service price added successfully', 'data' => $servicePrice], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'service_types_id' => 'required|exists:service_types,id',
            'nama_produk' => 'required|string|max:255',
            'laundry_types' => 'nullable|string|in:Wet Laundry,Dry Cleaning,Tanpa Kategori',
            'harga' => 'required|numeric|min:0',
        ]);
        $servicePrice = ServicePrice::findOrFail($id);
        $servicePrice->update($request->all());

        return response()->json(['message' => 'Service price updated successfully', 'data' => $servicePrice]);
    }

    public function destroy($id)
    {
        $servicePrice = ServicePrice::findOrFail($id);
        $servicePrice->delete();

        return response()->json(['message' => 'Service price deleted successfully']);
    }
}
