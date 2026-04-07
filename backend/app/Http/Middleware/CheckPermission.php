<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = $request->user();

        // Cek apakah user sudah login
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Cek apakah user memiliki minimal salah satu dari permissions yang diberikan
        $hasPermission = false;
        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission)) {
                $hasPermission = true;
                break;
            }
        }

        // Return 403 jika user tidak memiliki permission yang diperlukan
        if (!$hasPermission) {
            return response()->json([
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk mengakses sumber daya ini.'
            ], 403);
        }

        return $next($request);
    }
}
