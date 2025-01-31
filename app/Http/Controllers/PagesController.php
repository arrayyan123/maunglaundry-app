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
    public function report(Request $request)
    {
        $status_job = $request->input('status_job', '');
        $year = $request->input('year', '');

        $customers = CustomerUser::all();
        return Inertia::render('ReportPage', [
            'customers' => $customers,
            'query' => [
                'status_job' => $status_job,
                'year' => $year,
            ]
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
    public function editProfile()
    {
        return Inertia::render('Posts/EditCustomer');
    }
    public function reportCustomer(Request $request)
    {
        $status_job = $request->input('status_job', '');
        $year = $request->input('year', '');
        $status_payment = $request->input('status_payment');
        return Inertia::render('Posts/CustomerReport', [
            'query' => [
                'status_job' => $status_job,
                'year' => $year,
                'status_payment' => $status_payment,
            ]
        ]);
    }
    public function CustomerInbox()
    {
        return Inertia::render('Posts/CustomerInbox');
    }
    public function customerGraph()
    {
        return Inertia::render('Posts/CustomerGraph');
    }
    public function customerTransationPage()
    {
        return Inertia::render('Posts/CustomerTransactionPage');
    }
    public function customerTransaction(Request $request)
    {
        $customers = CustomerUser::orderBy('created_at', 'desc')->get();
        $openListCustomer = $request->input('openListCustomer', false);
        return Inertia::render('CustomerTransactionPage', [
            'customers' => $customers,
            'openListCustomer' => $openListCustomer,
        ]);
    }
    public function ForgotPassPage()
    {
        return Inertia::render('Posts/ForgotPassword');
    }
    public function ResetPassword($token)
    {
        return Inertia::render('Posts/ResetPassword', [
            'token' => $token,
        ]);
    }
}
