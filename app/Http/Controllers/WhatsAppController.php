<?php

namespace App\Http\Controllers;

use App\Services\TwilioService;
use Illuminate\Http\Request;

class WhatsAppController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    public function sendMessage(Request $request)
    {
        $phone = $request->input('phone');
        if (preg_match('/^0/', $phone)) {
            $phone = preg_replace('/^0/', '+62', $phone);
        }
        $request->merge(['phone' => $phone]);
        $request->validate([
            'phone' => 'required|string|regex:/^\+\d{1,15}$/',
            'message' => 'required|string',
        ]);

        try {
            $this->twilioService->sendMessage($request->phone, $request->message);
            return response()->json(['status' => 'Message sent successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
