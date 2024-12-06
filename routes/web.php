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
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\ContentController;



Route::post('/send-whatsapp', [WhatsAppController::class, 'sendMessage']);
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
Route::get('/diagramcalc', [PagesController::class, 'diagramCalc'])
    ->middleware(['auth', 'verified'])
    ->name('diagram.page');
Route::get('/inbox', [PagesController::class, 'inboxdashboard'])
    ->middleware(['auth', 'verified'])
    ->name('inbox.admin');
Route::get('/contentmanage', [PagesController::class, 'contentManage'])
    ->middleware(['auth', 'verified'])
    ->name('content.manage');

Route::prefix('api')->group(function () {
    Route::post('/customer/register', [CustomerAuthController::class, 'register_customer']);
    Route::post('/customer/login', [CustomerAuthController::class, 'login']);
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/customer/{id}', [CustomerAuthController::class, 'show']);

    Route::delete('/admin/customer/{id}', [CustomerAuthController::class, 'destroy'])->middleware('auth:sanctum');
    Route::post('/admin/register_customer', [CustomerAuthController::class, 'register_customer_admin']);
    Route::get('/admin/customers', [PagesController::class, 'adminCustomerList'])->middleware('auth:sanctum');
    Route::get('/admin/transaction-details/{transactionId}', [TransactionsController::class, 'getTransactionByUuid']);

    Route::post('/admin/transactions', [TransactionsController::class, 'store']);
    Route::get('/admin/transactions/{customerId}', [TransactionsController::class, 'show'])->name('transactions.show');
    Route::put('/admin/transactions/{id}/update', [TransactionsController::class, 'updatePaymentStatus']);
    Route::get('/admin/service-types', [ServiceTypesController::class, 'index']);
    Route::get('/admin/service-prices/{serviceTypeId}', [ServicePricesController::class, 'getPricesByServiceType']);
    Route::put('/admin/transactions/{transactionId}/payment', [TransactionsController::class, 'updatePayment']);

    Route::get('/contents', [ContentController::class, 'index']);
    Route::post('/contents', [ContentController::class, 'store']);
    Route::get('/contents/{id}', [ContentController::class, 'show']); // Menampilkan konten spesifik
    Route::put('/contents/{id}', [ContentController::class, 'update']); // Update konten    Route::delete('/contents/{content}', [ContentController::class, 'destroy']);
    Route::get('/contents/{id}/edit', [ContentController::class, 'edit']);
    Route::delete('/contents/{id}', [ContentController::class, 'destroy']);

    Route::delete('/admin/notes/{id}', [TransactionsController::class, 'destroyNote']);
    Route::get('/admin/inbox-notes', [TransactionsController::class, 'getNotesWithCustomerInfo']);
    Route::post('/admin/transactions/{transactionId}/notes', [TransactionsController::class, 'addNote']);
    Route::get('/admin/transactions/{transactionId}/notes', [TransactionsController::class, 'getNotes']);
    Route::put('/admin/transactions/{id}/update-payment', [TransactionsController::class, 'updatePaymentStatus']);
    Route::put('/admin/transactions/{id}/update-job-status', [TransactionsController::class, 'updateJobStatus']);
    Route::delete('/admin/transactions/{id}', [TransactionsController::class, 'destroy']);

    // Route::get('/admin/transactions/{transactionId}/notes', [TransactionsController::class, 'getNotesByTransactionId']);
    Route::get('/admin/total-price/customer/{customerId}', [ReportController::class, 'getTotalPriceByCustomerId']);
    Route::get('/admin/reports/customer/{customerId}', [ReportController::class, 'getReportByCustomerId']);
    Route::get('/admin/transactions/{id}', [TransactionsController::class, 'show'])->name('transactions.show');
    Route::get('/admin/transactions/{id}/receipt', [TransactionsController::class, 'printReceipt']);
    Route::get('/admin/new-transactions', [ReportController::class, 'getNewTransactions']);
    Route::get('/admin/total-price', [ReportController::class, 'getTotalPrice']);
    Route::get('/admin/reports', [ReportController::class, 'getReport']);
    Route::get('/admin/payment-methods', function () {
        return \App\Models\PaymentMethod::all();
    });
    Route::put('/customer/{id}', [CustomerAuthController::class, 'update'])->middleware('guest:customer');
});

// Route::prefix('contents')->group(function () {
//     Route::get('/', [ContentController::class, 'index']);
//     Route::post('/', [ContentController::class, 'store']);
//     Route::put('/{content}', [ContentController::class, 'update']);
//     Route::delete('/{content}', [ContentController::class, 'destroy']);
//     Route::get('/{id}/edit', [ContentController::class, 'edit']);
// });

Route::get('/customer/login', [PagesController::class, 'customerLogin'])
    ->name('customer.login')
    ->middleware('guest:customer');

Route::middleware(['guest:customer'])->group(function () {
    Route::get('/customer/dashboard', [PagesController::class, 'customerDashboard'])
        ->name('customer.dashboard');
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])
        ->name('customer.logout');
    Route::get('/customer/edit-profile/{id}', [PagesController::class, 'editProfile'])
        ->name('customer.edit-profile');
    Route::get('/customer/report/{id}', [PagesController::class, 'reportCustomer'])
        ->name('customer.report');
    Route::get('/customer/inbox/{id}', [PagesController::class, 'CustomerInbox'])
        ->name('customer.inbox');
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

require __DIR__ . '/auth.php';

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