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
    public function index()
    {
        $customers = CustomerUser::orderBy('created_at', 'desc')->get();
        return response()->json($customers);
    }
    public function register_customer(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|unique:customer_users,email',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|unique:customer_users,phone',
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
            $errors = $e->errors();
            $customErrors = [];
    
            if (isset($errors['email'])) {
                $customErrors['email'] = 'Email sudah terdaftar';
            }
            if (isset($errors['phone'])) {
                $customErrors['phone'] = 'Nomor telepon sudah terdaftar';
            }
            
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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|unique:customer_users,phone',
                'address' => 'required|string',
                'password' => 'required|string|min:6',
            ]);
            $customer = CustomerUser::create([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['phone']),
                'address' => $validated['address'],
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Registration successful',
                'customer' => $customer
            ], 201);
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $customErrors = [];

            if (isset($errors['phone'])) {
                $customErrors['phone'] = 'Nomor telepon sudah terdaftar';
            }
    
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $customErrors
            ], 422);

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
                'old_password' => 'required_with:new_password|string',
                'new_password' => 'nullable|string|min:8|confirmed',
            ]);
    
            if (!empty($validated['old_password']) && !empty($validated['new_password'])) {
                if (!Hash::check($validated['old_password'], $customer->password)) {
                    Log::debug('Password lama tidak cocok.');
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Password lama salah.',
                    ], 400);
                }    
                $customer->password = Hash::make($validated['new_password']);
            }    
            $customer->update(array_filter($validated, function ($key) {
                return !in_array($key, ['old_password', 'new_password', 'new_password_confirmation']);
            }, ARRAY_FILTER_USE_KEY));    
            $customer->save();
            if (!$customer->save()) {
                Log::error('Gagal menyimpan perubahan password.');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal menyimpan perubahan password.',
                ], 500);
            }            
            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'customer' => $customer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Isi password jika anda melakukan perubahan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|regex:/^\+?\d+$/',
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
