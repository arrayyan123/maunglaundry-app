<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Biscolab\ReCaptcha\Facades\ReCaptcha;
use Illuminate\Support\Facades\Log;

class VerifyRecaptcha
{
    public function handle(Request $request, Closure $next)
    {
        $recaptchaResponse = $request->input('g_recaptcha_response');

        Log::info('g_recaptcha_response', ['token' => $recaptchaResponse]);

        if (!$recaptchaResponse) {
            return response()->json([
                'message' => 'reCAPTCHA response is missing.',
            ], 422);
        }

        $response = ReCaptcha::validate($recaptchaResponse);

        if ($response !== true) {
            return response()->json([
                'message' => 'reCAPTCHA validation failed.',
            ], 422);
        }

        return $next($request);
    }
}