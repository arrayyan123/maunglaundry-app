<?php

use App\Http\Controllers\PagesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\TransactionsController;
use Inertia\Inertia;
use App\Mail\MyTestMail;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\ServiceTypesController;
use App\Http\Controllers\ServicePricesController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [PagesController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
Route::get('/reportdata', [PagesController::class, 'report'])
    ->middleware(['auth', 'verified'])
    ->name('admin.report');

Route::prefix('api')->group(function () {
    Route::post('/customer/register', [CustomerAuthController::class, 'register_customer']);
    Route::post('/customer/login', [CustomerAuthController::class, 'login']);
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/customer/{id}', [CustomerAuthController::class, 'show']);

    Route::post('/admin/register_customer', [CustomerAuthController::class, 'register_customer_admin']);
    Route::get('/admin/customers', [PagesController::class, 'adminCustomerList'])->middleware('auth:sanctum');
    Route::get('/admin/transaction-details/{transactionId}', [TransactionsController::class, 'getTransactionByUuid']);

    Route::post('/admin/transactions', [TransactionsController::class, 'store']);
    Route::get('/admin/transactions/{customerId}', [TransactionsController::class, 'show']) ->name('transactions.show');
    Route::put('/admin/transactions/{id}/update', [TransactionsController::class, 'updatePaymentStatus']); 
    Route::get('/admin/service-types', [ServiceTypesController::class, 'index']); 
    Route::get('/admin/service-prices/{serviceTypeId}', [ServicePricesController::class, 'getPricesByServiceType']);
    Route::put('/admin/transactions/{transactionId}/payment', [TransactionsController::class, 'updatePayment']);

    Route::put('/admin/transactions/{id}/update-payment', [TransactionsController::class, 'updatePaymentStatus']);
    Route::put('/admin/transactions/{id}/update-job-status', [TransactionsController::class, 'updateJobStatus']);
    Route::delete('/admin/transactions/{id}', [TransactionsController::class, 'destroy']);

    Route::get('/admin/transactions/{id}', [TransactionsController::class, 'show'])->name('transactions.show');

    Route::get('/admin/payment-methods', function () {
        return \App\Models\PaymentMethod::all();
    });
});

Route::get('/customer/login', [PagesController::class, 'customerLogin'])
    ->name('customer.login')
    ->middleware('guest:customer');

Route::middleware(['guest:customer'])->group(function () {
    Route::get('/customer/dashboard', [PagesController::class, 'customerDashboard'])
        ->name('customer.dashboard');
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])
        ->name('customer.logout');
});

Route::get('/', [PagesController::class, 'home'])->name('home-page');
Route::get('/customer/register', [PagesController::class, 'customerRegister'])->name('customer-register-page');
Route::get('/customer/login', [PagesController::class, 'customerLogin'])->name('customer-login-page');
Route::get('/', [PagesController::class, 'home'])->name('home-page');
Route::get('/laundry', [PagesController::class, 'laundryform'])->name('customer.form');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Route::middleware(['auth:customer'])->group(function () {
//     Route::post('/request-laundry', [LaundryController::class, 'request']);
//     Route::post('/make-payment', [PaymentController::class, 'pay']);
// });

// Route::get('/email-test', function(){
//     $name = "Arrayyan";
//     $from = "Testing Email";

//     Mail::to("arrayyan.aprilyanto@gmail.com")->send(new MyTestMail(compact("name", "from")));
//     dd("Email send successfully");
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');