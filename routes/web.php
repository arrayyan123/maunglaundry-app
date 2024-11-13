<?php

use App\Http\Controllers\PagesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerAuthController;
use Inertia\Inertia;
use App\Mail\MyTestMail;
use Illuminate\Support\Facades\Mail;

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

Route::prefix('api')->group(function () {
    Route::post('/customer/register', [CustomerAuthController::class, 'register']);
    Route::post('/customer/login', [CustomerAuthController::class, 'login']);
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])->middleware('auth:sanctum');
    
    Route::get('/admin/customers', [PagesController::class, 'adminCustomerList'])->middleware('auth:sanctum');
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

// Route::middleware(['auth:customer'])->group(function () {
//     Route::post('/request-laundry', [LaundryController::class, 'request']);
//     Route::post('/make-payment', [PaymentController::class, 'pay']);
// });

Route::get('/', [PagesController::class, 'home'])->name('home-page');
Route::get('/customer/register', [PagesController::class, 'customerRegister'])->name('customer-register-page');
Route::get('/customer/login', [PagesController::class, 'customerLogin'])->name('customer-login-page');
Route::get('/', [PagesController::class, 'home'])->name('home-page');

// Route::get('/email-test', function(){
//     $name = "Arrayyan";
//     $from = "Testing Email";

//     Mail::to("arrayyan.aprilyanto@gmail.com")->send(new MyTestMail(compact("name", "from")));
//     dd("Email send successfully");
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
