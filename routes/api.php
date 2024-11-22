<?php

use App\Http\Controllers\TransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\ServicePricesController;
use App\Http\Controllers\ServiceTypesController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/customer/login', [CustomerAuthController::class, 'login']);
Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])
    ->middleware('guest:customer');
Route::post('admin/register_customer', [CustomerAuthController::class, 'register_customer_admin']);
Route::post('/admin/transactions', [TransactionsController::class, 'store']); // Store transaction
Route::put('/admin/transactions/{id}/update', [TransactionsController::class, 'updatePaymentStatus']); // Update payment status
Route::get('/admin/service-types', [ServiceTypesController::class, 'index']); // Fetch service types
Route::get('/admin/service-prices/{serviceTypeId}', [ServicePricesController::class, 'getPricesByServiceType']);
Route::put('/admin/transactions/{transactionId}/payment', [TransactionsController::class, 'updatePayment']);
