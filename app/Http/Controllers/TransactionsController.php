<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaction;
use App\Models\DownPayment;
use Illuminate\Http\Request;
use App\Models\ServiceType;
use App\Models\ServicePrice;
use App\Models\Transaction;
use App\Models\Note;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use App\Events\TransactionStored;


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
                'services.*.quantity' => 'required|numeric|min:1',
                'services.*.price' => 'required|numeric',
                'services.*.nama_produk' => 'required|string',
                'dp' => 'nullable|numeric|min:0',
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

            if ($validated['status_payment'] === 'partial') {
                $totalPrice = $transaction->details()->sum('price');

                $existingDownPayment = DownPayment::where('transaction_id', $transaction->id)->first();
                $existingDp = $existingDownPayment ? $existingDownPayment->dp : 0;

                $dp = $validated['dp'] ?? 0;
                $remaining = $totalPrice - ($existingDp + $dp);

                DownPayment::create([
                    'transaction_id' => $transaction->id,
                    'dp' => $dp,
                    'remaining' => $remaining,
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

    public function showDownPaymentByTransactionId($id)
    {
        try {
            $transaction = Transaction::with('downPayment')
                ->findOrFail($id);

            // Ambil down payment terkait
            $downPayment = $transaction->downPayment;

            // Jika tidak ada down payment, kembalikan respons yang sesuai
            if (!$downPayment) {
                return response()->json([
                    'message' => 'No down payment found for this transaction.',
                    'transaction_id' => $transaction->id,
                ], 404);
            }

            // Kembalikan data down payment
            return response()->json([
                'transaction_id' => $transaction->id,
                'down_payment' => $downPayment,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve down payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'status_payment' => 'required|string|in:paid,unpaid,partial',
            'status_job' => 'required|string|in:ongoing,done,cancel,pending',
            'dp' => 'nullable|numeric|min:0',
            'services' => 'required|array',
            'services.*.service_type_id' => 'required|exists:service_types,id',
            'services.*.service_price_id' => 'required|exists:service_prices,id',
            'services.*.quantity' => 'required|numeric|min:1',
            'services.*.price' => 'required|numeric',
        ]);
    
        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->update([
                'payment_method_id' => $validated['payment_method_id'],
                'status_payment' => $validated['status_payment'],
                'status_job' => $validated['status_job'],
            ]);
    
            $transaction->details()->delete();
            foreach ($validated['services'] as $service) {
                $transaction->details()->create([
                    'service_types_id' => $service['service_type_id'],
                    'service_prices_id' => $service['service_price_id'],
                    'quantity' => $service['quantity'],
                    'price' => $service['price'],
                ]);
            }

            if ($validated['status_payment'] === 'partial') {
                $totalPrice = $transaction->details()->sum('price');
                $dp = $validated['dp'] ?? 0;
                $remaining = $totalPrice - $dp;
    
                $downPayment = DownPayment::updateOrCreate(
                    ['transaction_id' => $transaction->id],
                    ['dp' => $dp, 'remaining' => $remaining]
                );
            }
    
            return response()->json(['message' => 'Transaction updated successfully', 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update transaction', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $sortBy = $request->input('sort_by', 'start_date');
            $sortOrder = $request->input('sort_order', 'desc');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
                $sortOrder = 'desc';
            }
            $query = Transaction::with('paymentMethod', 'details.serviceType', 'details.servicePrice')
                ->where('customer_id', $id);
            if ($startDate) {
                $query->whereDate('start_date', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('end_date', '<=', $endDate);
            }
            $transactions = $query->orderBy($sortBy, $sortOrder)->get();
            return response()->json([
                'transaction' => $transactions,
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
            'status_payment' => 'required|string|in:paid,unpaid,partial',
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
        $transaction = Transaction::findOrFail($id);

        if ($transaction) {
            Log::info("Transaction to be deleted: ", ['transaction_id' => $transaction->id]);
            $transaction->delete();

            if ($transaction->details()->exists()) {
                $transaction->details()->delete();
            }
            if ($transaction->downPayment()->exists()) {
                $transaction->downPayment()->delete();
            }

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
        $transaction = Transaction::with(['customer', 'details.serviceType', 'details.servicePrice', 'note', 'downPayment'])->findOrFail($id);

        $noteContent = $transaction->note ? $transaction->note->content : 'Tidak ada catatan';
        $dp = $transaction->downPayment->dp ?? 0;
        $remaining = $transaction->downPayment->remaining ?? 0;

        return view('pdf.receipt', compact('transaction', 'noteContent', 'dp', 'remaining'));
    }

    public function printMultipleReceipts(Request $request)
    {
        $transactionIds = $request->query('ids', []);

        if (!is_array($transactionIds)) {
            $transactionIds = explode(',', $transactionIds);
        }

        Log::info('Transaction IDs processed:', ['ids' => $transactionIds]);

        if (empty($transactionIds)) {
            return response()->json(['error' => 'No transactions selected'], 400);
        }

        $transactions = Transaction::with(['customer', 'details.serviceType', 'details.servicePrice', 'note'])
            ->whereIn('id', $transactionIds)
            ->get();

        $transactions->each(function ($transaction) {
            $transaction->noteContent = $transaction->note ? $transaction->note->content : 'Tidak ada catatan';
        });
        if ($transactions->isEmpty()) {
            return response()->json(['error' => 'No transactions found'], 404);
        }

        return view('pdf.multiple-receipts', compact('transactions'));
    }

    public function addNote(Request $request, $transactionId)
    {
        $transaction = Transaction::find($transactionId);
        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);
        try {
            $note = Note::create([
                'transaction_id' => $transaction->id,
                'content' => $validated['content'],
                'created_at' => now('Asia/Jakarta'),
                'updated_at' => now('Asia/Jakarta'),
            ]);
            return response()->json(['message' => 'Note added successfully', 'note' => $note], 201);
        } catch (\Exception $e) {
            Log::error('Failed to add note', [
                'transaction_id' => $transactionId,
                'content' => $validated['content'],
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Failed to add note', 'details' => $e->getMessage()], 500);
        }
    }
    public function getNotes(Request $request, $transactionId)
    {
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $notes = Note::with(['transaction.customer'])
            ->where('transaction_id', $transactionId)
            ->orderBy($sortBy, $sortOrder)
            ->get()
            ->map(function ($note) {
                $transaction = $note->transaction;
                $customer = $transaction->customer;

                return [
                    'id' => $note->id,
                    'transaction_id' => $note->transaction_id,
                    'transaction_nama_produk' => $transaction->nama_produk ?? 'unknown',
                    'content' => $note->content,
                    'customer_name' => $customer->name ?? 'Unknown',
                    'customer_email' => $customer->email ?? 'Unknown',
                    'customer_phone' => $customer->phone ?? 'Unknown',
                    'customer_address' => $customer->address ?? 'Unknown',
                    'created_at' => $note->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json($notes, 200);
    }
    public function getNotesWithCustomerInfo(Request $request)
    {
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $notes = Note::with(['transaction.customer'])
            ->orderBy($sortBy, $sortOrder)
            ->get()
            ->map(function ($note) {
                $transaction = $note->transaction;
                $customer = $transaction->customer;

                return [
                    'id' => $note->id,
                    'transaction_id' => $note->transaction_id,
                    'transaction_nama_produk' => $transaction->nama_produk ?? 'unknown',
                    'content' => $note->content,
                    'customer_name' => $customer->name ?? 'Unknown',
                    'customer_email' => $customer->email ?? 'Unknown',
                    'customer_phone' => $customer->phone ?? 'Unknown',
                    'customer_address' => $customer->address ?? 'Unknown',
                    'created_at' => $note->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json($notes);
    }

    public function destroyNote($id)
    {
        $note = Note::find($id);

        if (!$note) {
            return response()->json(['message' => 'Note not found'], 404);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully'], 200);
    }
}
