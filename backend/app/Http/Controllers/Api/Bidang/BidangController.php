<?php

namespace App\Http\Controllers\Api\Bidang;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BidangController extends Controller
{
    use LogsActivity;
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

        // Catat log CREATE
        $this->logCreate($request, 'Bidang', $bidang->id_bidang, $bidang->toArray());

        return response()->json([
            'message' => 'Bidang berhasil dibuat',
            'data' => $bidang
        ], 201);
    }

    // DELETE BIDANG
    public function destroy(Request $request, $id)
    {
        $bidang = Bidang::find($id);

        if (!$bidang) {
            return response()->json([
                'message' => 'Bidang tidak ditemukan'
            ], 404);
        }

        $dataLama = $bidang->toArray();
        $bidang->delete();

        // Catat log DELETE
        $this->logDelete($request, 'Bidang', $id, $dataLama);

        return response()->json([
            'message' => 'Bidang berhasil dihapus'
        ]);
    }
}
