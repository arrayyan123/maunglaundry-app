<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getReport(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $sortBy = $request->input('sort_by', 'start_date');
        $sortOrder = $request->input('sort_order', 'desc');
        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }
        $query = DB::table('report_transactions')
            ->join('customer_users', 'report_transactions.customer_id', '=', 'customer_users.id')
            ->select(
                'report_transactions.transaction_id',
                'report_transactions.customer_id',
                'customer_users.name as customer_name',
                'report_transactions.nama_produk',
                'report_transactions.laundry_type',
                'report_transactions.status_payment',
                'report_transactions.status_job',
                'report_transactions.start_date',
                'report_transactions.end_date',
                'report_transactions.total_price',
            );
        if ($month) {
            $query->where('report_transactions.month', $month);
        }
        if ($year) {
            $query->where('report_transactions.year', $year);
        }
        if (!empty($request->input('status_job'))) {
            $query->where('status_job', $request->input('status_job'));
        }
        if (!empty($request->input('status_payment'))) {
            $query->where('status_payment', $request->input('status_payment'));
        };
        if ($startDate) {
            $query->whereDate('report_transactions.start_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('report_transactions.end_date', '<=', $endDate);
        }

        $customerName = $request->input('customer_name');
        if (!empty($customerName)) {
            $query->where('customer_users.name', 'like', '%' . $customerName . '%');
        }
        
        $query->orderBy($sortBy, $sortOrder);
        $reports = $query->get();

        return response()->json([
            'message' => 'Report fetched successfully',
            'data' => $reports,
        ]);
    }
    public function getTotalPrice(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = DB::table('transactions')
            ->join('detail_transactions', 'transactions.id', '=', 'detail_transactions.transaction_id')
            ->select(DB::raw('SUM(detail_transactions.price) as total_price'));

        if ($month) {
            $query->whereMonth('transactions.start_date', $month);
        }

        if ($year) {
            $query->whereYear('transactions.start_date', $year);
        }

        if ($startDate) {
            $query->whereDate('transactions.start_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transactions.end_date', '<=', $endDate);
        }

        $totalPrice = $query->value('total_price') ?? 0;

        return response()->json([
            'total_price' => $totalPrice,
        ]);
    }

    public function getNewTransactions(Request $request)
    {
        $lastChecked = $request->input('lastChecked');
        $removedIds = $request->input('removedIds', []);

        $query = DB::table('report_transactions')
            ->join('customer_users', 'report_transactions.customer_id', '=', 'customer_users.id')
            ->select(
                'report_transactions.transaction_id',
                'customer_users.name as customer_name',
                'report_transactions.nama_produk',
                'report_transactions.laundry_type',
                'report_transactions.status_payment',
                'report_transactions.status_job',
                'report_transactions.status_payment',
                'report_transactions.start_date',
                'report_transactions.total_price'
            )
            ->orderBy('report_transactions.start_date', 'desc');

        if ($lastChecked) {
            $query->where('report_transactions.start_date', '>', $lastChecked);
        }

        if (!empty($removedIds)) {
            $query->whereNotIn('report_transactions.transaction_id', $removedIds);
        }

        $newTransactions = $query->get();

        return response()->json([
            'newTransactions' => $newTransactions,
        ]);
    }
    
    public function getReportByCustomerId(Request $request, $customerId)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $sortBy = $request->input('sort_by', 'start_date');
        $sortOrder = $request->input('sort_order', 'desc');

        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $query = DB::table('report_transactions')
            ->join('customer_users', 'report_transactions.customer_id', '=', 'customer_users.id')
            ->select(
                'report_transactions.transaction_id',
                'report_transactions.customer_id',
                'customer_users.name as customer_name',
                'report_transactions.nama_produk',
                'report_transactions.laundry_type',
                'report_transactions.status_payment',
                'report_transactions.status_job',
                'report_transactions.start_date',
                'report_transactions.end_date',
                'report_transactions.total_price'
            )
            ->where('report_transactions.customer_id', $customerId);

        if ($month) {
            $query->where('report_transactions.month', $month);
        }
        if ($year) {
            $query->where('report_transactions.year', $year);
        }
        if (!empty($request->input('status_job'))) {
            $query->where('status_job', $request->input('status_job'));
        }
        if (!empty($request->input('status_payment'))) {
            $query->where('status_payment', $request->input('status_payment'));
        }
        if ($startDate) {
            $query->whereDate('report_transactions.start_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('report_transactions.end_date', '<=', $endDate);
        }

        $query->orderBy($sortBy, $sortOrder);
        $reports = $query->get();

        return response()->json([
            'message' => 'Report fetched successfully for customer ID ' . $customerId,
            'data' => $reports,
        ]);
    }
    
    public function getTotalPriceByCustomerId(Request $request, $customerId)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = DB::table('report_transactions')
            ->select(DB::raw('SUM(total_price) as total_price'))
            ->where('customer_id', $customerId);

        if ($month) {
            $query->where('month', $month);
        }

        if ($year) {
            $query->where('year', $year);
        }

        if ($startDate) {
            $query->whereDate('start_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('end_date', '<=', $endDate);
        }

        $totalPrice = $query->value('total_price') ?? 0;

        return response()->json([
            'message' => 'Total price fetched successfully for customer ID ' . $customerId,
            'total_price' => $totalPrice,
        ]);
    }
}
