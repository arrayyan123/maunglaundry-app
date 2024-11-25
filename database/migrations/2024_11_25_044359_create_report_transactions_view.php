<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateReportTransactionsView extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW report_transactions AS
            SELECT
                t.id AS transaction_id,
                t.customer_id,
                t.nama_produk,
                t.laundry_type,
                t.payment_method_id,
                t.status_payment,
                t.status_job,
                t.start_date,
                t.end_date,
                dt.service_types_id,
                dt.service_prices_id,
                dt.quantity,
                dt.price,
                MONTH(t.start_date) AS month,
                YEAR(t.start_date) AS year,
                dt.price AS total_price
            FROM
                transactions t
            JOIN
                detail_transactions dt
            ON
                t.id = dt.transaction_id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Query untuk menghapus view
        DB::statement("DROP VIEW IF EXISTS report_transactions");
    }
}