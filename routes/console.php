<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Http\Middleware\VerifyRecaptcha;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', VerifyRecaptcha::class])->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
});

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();
