<?php

namespace App\Http\Controllers;

use App\Models\CustomerUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;


class CustomerAuthController extends Controller
{
    public function register_customer(Request $request)
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
    //sisi admin
    public function register_customer_admin(Request $request)
    {
        Log::debug('Request data:', $request->all());
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string',
                'email' => 'nullable|string',
                'address' => 'required|string',
                'password' => 'required|string|min:6',
            ]);
            Log::debug('Validated data:', $validated);

            $customer = CustomerUser::create([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['phone']),
                'address' => $validated['address'],
            ]);
            Log::debug('Customer created successfully:', $customer->toArray());
            return response()->json([
                'status' => 'success',
                'message' => 'Registration successful',
                'customer' => $customer
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error during registration: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $customer = CustomerUser::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:customer_users,email,' . $customer->id,
                'phone' => 'sometimes|string',
                'address' => 'sometimes|string',
            ]);

            $customer->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'customer' => $customer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|regex:/^\d+$/',
            'password' => 'required',
        ]);
        $customer = CustomerUser::where('phone', $request->phone)->first();
        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Info yang anda masukkan tidak tepat. Coba kembali.'
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
        return redirect()->route('customer-login-page');
    }

    public function show($id)
    {
        $customer = CustomerUser::find($id);
        return response()->json($customer);
    }

    public function destroy($id)
    {
        try {
            $customer = CustomerUser::findOrFail($id);
            $customer->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Customer deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete customer',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
