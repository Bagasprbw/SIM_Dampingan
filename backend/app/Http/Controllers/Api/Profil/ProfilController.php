<?php

namespace App\Http\Controllers\Api\Profil;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load(['role', 'provinsi', 'kabupaten', 'kecamatan']);

        return response()->json([
            'message' => 'Data profil berhasil diambil',
            'data' => $user
        ]);
    }

    public function updateNoTelp(Request $request)
    {
        $request->validate([
            'no_telp' => 'required|string|max:20'
        ]);

        $user = $request->user();
        $user->no_telp = $request->no_telp;
        $user->save();

        return response()->json([
            'message' => 'Nomor telepon berhasil diperbarui',
            'data' => $user
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password lama tidak sesuai'
            ], 422);
        }

        $user->password = $request->new_password;
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diperbarui'
        ]);
    }
}