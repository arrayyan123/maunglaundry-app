<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CustomerUser;

class PagesController extends Controller
{
    public function home()
    {
        return Inertia::render('Posts/Home');
    }
    public function customerRegister()
    {
        return Inertia::render('Posts/CustomerRegister');
    }
    public function customerLogin()
    {
        return Inertia::render('Posts/CustomerLogin');
    }
    public function dashboard()
    {
        $customers = CustomerUser::orderBy('created_at', 'desc')->get();
        return Inertia::render('Dashboard', [
            'customers' => $customers
        ]);
    }
    public function report()
    {
        $customers = CustomerUser::all();
        return Inertia::render('ReportPage', [
            'customers' => $customers
        ]);
    }
    public function customerDashboard()
    {
        return Inertia::render('Posts/CustomerDashboard');
    }
    public function laundryform()
    {
        return Inertia::render('Posts/LaundryForm');
    }
    public function entryTransaction($customerId)
    {
        $customer = CustomerUser::findOrFail($customerId);
        return view('admin.entry_transaction', compact('customer'));
    }
    public function contentManage(){
        return Inertia::render('ContentManage');
    }
    public function diagramCalc()
    {
        $customers = CustomerUser::all();
        return Inertia::render('DiagramCalc', [
            'customers' => $customers
        ]);
    }
    public function inboxdashboard(){
        $customers = CustomerUser::all();
        return Inertia::render('InboxDashboard', [
            'customers' => $customers
        ]);
    }
    public function editProfile($customerId)
    {
        $customer = CustomerUser::findOrFail($customerId);
        return Inertia::render('Posts/EditCustomer', [
            'customer' => $customer
        ]);
    }
    public function reportCustomer($customerId)
    {
        $customer = CustomerUser::findOrFail($customerId);
        return Inertia::render('Posts/CustomerReport', [
            'customer' => $customer
        ]);
    }
    public function CustomerInbox($customerId)
    {
        $customer = CustomerUser::findOrFail($customerId);
        return Inertia::render('Posts/CustomerInbox',[
            'customer' => $customer
        ]);
    }
}
