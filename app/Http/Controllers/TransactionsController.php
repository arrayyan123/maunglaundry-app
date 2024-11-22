<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaction;
use Illuminate\Http\Request;
use App\Models\ServiceType;
use App\Models\ServicePrice;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\Log;

class TransactionsController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Request data:', $request->all());
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customer_users,id',
                'laundry_type' => 'required|string',
                'payment_method_id' => 'required|exists:payment_methods,id',
                'status_payment' => 'required|string',
                'status_job' => 'required|string',
                'services' => 'required|array',
                'services.*.service_type_id' => 'required|exists:service_types,id',
                'services.*.service_price_id' => 'required|exists:service_prices,id',
                'services.*.quantity' => 'required|integer|min:1',
                'services.*.price' => 'required|numeric',
                'services.*.nama_produk' => 'required|string',
            ]);
            $namaProduk = $validated['services'][0]['nama_produk'];
            // Buat transaksi
            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'],
                'nama_produk' => $namaProduk,
                'laundry_type' => $validated['laundry_type'],
                'payment_method_id' => $validated['payment_method_id'],
                'status_payment' => $validated['status_payment'],
                'status_job' => $validated['status_job'],
            ]);

            // Tambahkan detail transaksi
            foreach ($validated['services'] as $service) {
                $transaction->details()->create([
                    'service_types_id' => $service['service_type_id'],
                    'service_prices_id' => $service['service_price_id'],
                    'quantity' => $service['quantity'],
                    'price' => $service['price'],
                ]);
            }

            return response()->json([
                'message' => 'Transaction saved successfully',
                'transaction' => $transaction,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save transaction',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $transaction = Transaction::with('details.serviceType', 'details.servicePrice')
                ->where('customer_id', $id) // Filter berdasarkan customer_id
                ->get();
    
            return response()->json([
                'transaction' => $transaction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve transaction details',
                'error' => $e->getMessage(),
            ], 500);
        }
    }    

    public function updateJobStatus(Request $request, $transactionId)
    {
        $request->validate([
            'status_job' => 'required|string',
        ]);
    
        $transaction = Transaction::findOrFail($transactionId);
        $transaction->status_job = $request->status_job;
        $transaction->save();
    
        return response()->json(['message' => 'Job status updated successfully']);
    }
    
    

    public function updatePayment($transactionId, Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|exists:payment_methods,id',
            'status_payment' => 'required|string',
        ]);

        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'payment_method_id' => $request->payment_method_id,
            'status_payment' => $request->status_payment,
        ]);

        return response()->json($transaction);
    }

    public function destroy($id)
    {
        $transaction = Transaction::find($id);
        if ($transaction) {
            $transaction->details()->delete();  
            $transaction->delete(); 
            return response()->json(['message' => 'Transaction deleted successfully']);
        }

        return response()->json(['message' => 'Transaction not found'], 404);
    }

    public function markAsDone($transactionId)
    {
        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'status_job' => 'done',
            'end_date' => now(),
        ]);

        return response()->json(['message' => 'Transaction marked as done.']);
    }
}
