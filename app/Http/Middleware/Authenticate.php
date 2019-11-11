<?php

namespace App\Http\Middleware;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Session;

class Authenticate extends Middleware {

    /**
     * @param \Illuminate\Http\Request $request
     * @param array $guards
     * @throws AuthenticationException
     */
    protected function authenticate($request, array $guards)
    {
        if (empty($guards))
        {
            $guards = [null];
        }

        foreach ($guards as $guard)
        {
            if ($this->auth->guard($guard)->check())
            {
                return $this->auth->shouldUse($guard);
            }
        }

        Session::put('fallback', url($request->getRequestUri()));
        throw new AuthenticationException(
            'Unauthenticated.', $guards, route($guard . '.login')
        );
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request $request
     * @return string
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson())
        {
            return route('login');
        }
    }
}
