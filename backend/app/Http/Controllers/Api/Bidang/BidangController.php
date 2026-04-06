<?php

namespace App\Http\Controllers\Api\Bidang;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BidangController extends Controller
{
    // GET ALL BIDANG
    public function index()
    {
        $bidangs = Bidang::orderBy('name', 'asc')->get();

        return response()->json([
            'message' => 'Data bidang berhasil diambil',
            'data' => $bidangs
        ]);
    }
    // CREATE BIDANG
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150|unique:bidangs,name',
        ]);

        $bidang = Bidang::create([
            'id_bidang' => (string) Str::uuid(),
            'name' => $request->name,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Bidang berhasil dibuat',
            'data' => $bidang
        ], 201);
    }

    // DELETE BIDANG
    public function destroy($id)
    {
        $bidang = Bidang::find($id);

        if (!$bidang) {
            return response()->json([
                'message' => 'Bidang tidak ditemukan'
            ], 404);
        }

        $bidang->delete();

        return response()->json([
            'message' => 'Bidang berhasil dihapus'
        ]);
    }
}
