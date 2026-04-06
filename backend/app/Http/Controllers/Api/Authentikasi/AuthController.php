<?php

namespace App\Http\Controllers\Api\Authentikasi;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah.',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Akun tidak aktif.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load('role');

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id_user' => $user->id_user,
                'name' => $user->name,
                'username' => $user->username,
                'role_id' => $user->role_id,
                'created_by' => $user->created_by,
                'no_telp' => $user->no_telp,
                'foto' => $user->foto,
                'kode_prov' => $user->kode_prov,
                'kode_kab' => $user->kode_kab,
                'kode_kec' => $user->kode_kec,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'role' => $user->role ? $user->role->name : null,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    public function me(Request $request)
    {
        $user = clone $request->user();
        $user->load('role.permissions');

        return response()->json([
            'user' => $user,
        ]);
    }
}
