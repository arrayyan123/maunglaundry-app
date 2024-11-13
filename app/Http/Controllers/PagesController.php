<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CustomerUser;

class PagesController extends Controller
{
    public function home(){
        return Inertia::render('Posts/Home');
    }
    public function customerRegister(){
        return Inertia::render('Posts/CustomerRegister');
    }
    public function customerLogin(){
        return Inertia::render('Posts/CustomerLogin');
    }
    public function dashboard()
    {
        $customers = CustomerUser::all();
        
        return Inertia::render('Dashboard', [
            'customers' => $customers
        ]);
    }
    public function customerDashboard()
    {
        return Inertia::render('Posts/CustomerDashboard');
    }
}
