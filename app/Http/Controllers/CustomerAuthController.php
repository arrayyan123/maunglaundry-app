<?php

namespace App\Http\Controllers;

use App\Models\CustomerUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class CustomerAuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|unique:customer_users,email',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string',
                'address' => 'nullable|string'
            ]);

            $customer = CustomerUser::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Registration successful',
                'customer' => $customer
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $customer = CustomerUser::where('email', $request->email)->first();
        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }
        $token = $customer->createToken('customer-token')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'token' => $token,
            'customer' => $customer
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }
        Auth::guard('customer')->logout();
        
        return redirect()->route('customer.login');
    }
    // public function login(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'email' => 'required|email',
    //             'password' => 'required'
    //         ]);

    //         $customer = CustomerUser::where('email', $validated['email'])->first();

    //         if (!$customer || !Hash::check($validated['password'], $customer->password)) {
    //             throw ValidationException::withMessages([
    //                 'email' => ['The provided credentials are incorrect.'],
    //             ]);
    //         }

    //         $token = $customer->createToken('customer-token')->plainTextToken;

    //         return response()->json([
    //             'status' => 'success',
    //             'token' => $token,
    //             'customer' => $customer
    //         ]);

    //     } catch (ValidationException $e) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Login failed',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function logout(Request $request)
    // {
    //     $request->user()->tokens()->delete();
    //     return response()->json(['message' => 'Logged out successfully']);
    // }
}
