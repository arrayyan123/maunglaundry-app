<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     *
     * @var bool
     */
    protected $addHttpCookie = true;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        //
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Pastikan permintaan memiliki token CSRF yang valid
        if ($this->isReading($request) || $this->inExceptArray($request) || $this->tokensMatch($request)) {
            return $next($request);
        }

        // Jika token tidak valid, kembalikan error
        abort(419, 'CSRF token mismatch.');
    }

    /**
     * Determine if the session and input CSRF tokens match.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function tokensMatch($request)
    {
        $token = $request->session()->token();
        $header = $request->header('X-CSRF-TOKEN') ?: $request->input('_token');

        return is_string($token) && is_string($header) && hash_equals($token, $header);
    }
}
