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
        $query = DB::table('report_transactions')
            ->join('customer_users', 'report_transactions.customer_id', '=', 'customer_users.id')
            ->select(
                'report_transactions.transaction_id',
                'report_transactions.customer_id',
                'customer_users.name as customer_name',
                'report_transactions.nama_produk',
                'report_transactions.laundry_type',
                'report_transactions.status_job',
                'report_transactions.start_date',
                'report_transactions.end_date',
                'report_transactions.total_price'
            );
        if ($month) {
            $query->where('report_transactions.month', $month);
        }
        if ($year) {
            $query->where('report_transactions.year', $year);
        }

        if ($startDate) {
            $query->whereDate('report_transactions.start_date', '>=', $startDate);
        }
    
        if ($endDate) {
            $query->whereDate('report_transactions.end_date', '<=', $endDate);
        }
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

        // Query total_price dengan filter bulan dan tahun
        $query = DB::table('transactions')
            ->join('detail_transactions', 'transactions.id', '=', 'detail_transactions.transaction_id')
            ->select(DB::raw('SUM(detail_transactions.price) as total_price'));

        // Tambahkan filter bulan jika ada
        if ($month) {
            $query->whereMonth('transactions.start_date', $month);
        }

        // Tambahkan filter tahun jika ada
        if ($year) {
            $query->whereYear('transactions.start_date', $year);
        }

        if ($startDate) {
            $query->whereDate('transactions.start_date', '>=', $startDate);
        }
    
        if ($endDate) {
            $query->whereDate('transactions.end_date', '<=', $endDate);
        }

        // Ambil total_price dari query
        $totalPrice = $query->value('total_price') ?? 0;

        return response()->json([
            'total_price' => $totalPrice,
        ]);
    }
}
