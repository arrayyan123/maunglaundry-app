<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaction;
use Illuminate\Http\Request;
use App\Models\ServiceType;
use App\Models\ServicePrice;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
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
            $startDate = Carbon::now('Asia/Jakarta');
            $serviceType = ServiceType::findOrFail($validated['services'][0]['service_type_id']);
            $endDate = $startDate->copy()->addDays($serviceType->durasi_hari);
            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'],
                'nama_produk' => $namaProduk,
                'laundry_type' => $validated['laundry_type'],
                'payment_method_id' => $validated['payment_method_id'],
                'status_payment' => $validated['status_payment'],
                'status_job' => $validated['status_job'],
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);

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

    public function show(Request $request, $id)
    {
        try {
            $sortBy = $request->input('sort_by', 'start_date');
            $sortOrder = $request->input('sort_order', 'desc');

            if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
                $sortOrder = 'desc';
            }
            $transaction = Transaction::with('paymentMethod', 'details.serviceType', 'details.servicePrice')
                ->where('customer_id', $id)
                ->orderBy($sortBy, $sortOrder)
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
            'status_job' => 'required|string|in:ongoing,pending,done,cancel',
        ]);

        $transaction = Transaction::findOrFail($transactionId);
        $transaction->status_job = $request->status_job;
        $transaction->save();

        return response()->json(['message' => 'Job status updated successfully', 'transaction' => $transaction]);
    }

    public function updatePayment($transactionId, Request $request)
    {
        $validated = $request->validate([
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'status_payment' => 'required|string|in:paid,unpaid',
        ]);

        $transaction = Transaction::findOrFail($transactionId);
        $transaction->update([
            'payment_method_id' => $validated['payment_method_id'] ?? $transaction->payment_method_id,
            'status_payment' => $validated['status_payment'],
        ]);

        return response()->json(['message' => 'Payment status updated successfully', 'transaction' => $transaction]);
    }

    public function getTransactionByUuid($id)
    {
        $transaction = Transaction::with('paymentMethod', 'details.serviceType', 'details.servicePrice')
            ->where('id', $id)->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }
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

    public function printReceipt($id)
    {
        $transaction = Transaction::with(['customer', 'details.serviceType', 'details.servicePrice'])->findOrFail($id);
        $pdf = Pdf::loadView('pdf.receipt', compact('transaction'));
        return $pdf->stream('transaction_receipt.pdf'); 
    }
}
