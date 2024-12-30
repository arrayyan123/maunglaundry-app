<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CustomerUser;
use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = CustomerUser::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }
        $token = Str::random(60);
        PasswordReset::updateOrCreate(
            ['email' => $request->email],
            ['token' => Hash::make($token), 'created_at' => Carbon::now()]
        );

        Mail::send('emails.forgot-password', ['token' => $token], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Reset Password');
        });

        return response()->json(['message' => 'Reset link has been sent to your email']);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);
    
        $resetRecord = DB::table('password_resets')->where('email', $request->email)->first();
    
        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json(['message' => 'Invalid token'], 400);
        }
    
        $user = CustomerUser::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();
    
        // Hapus token
        DB::table('password_resets')->where('email', $request->email)->delete();
    
        return response()->json(['message' => 'Password berhasil di riset, kembali ke login...']);
    }
}