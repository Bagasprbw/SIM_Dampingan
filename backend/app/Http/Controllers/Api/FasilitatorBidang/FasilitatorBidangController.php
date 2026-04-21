<?php

namespace App\Http\Controllers\Api\FasilitatorBidang;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\FasilitatorBidang;
use App\Models\User;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FasilitatorBidangController extends Controller
{
    use LogsActivity;
    // GET ALL FASILITATOR BIDANG
    public function index(Request $request)
    {
        $fasilitatorId = $request->query('fasilitator_id');
        $bidangId = $request->query('bidang_id');

        $query = FasilitatorBidang::with(['fasilitator', 'bidang']);

        if ($fasilitatorId) {
            $query->where('user_id', $fasilitatorId);
        }

        if ($bidangId) {
            $query->where('bidang_id', $bidangId);
        }

        $data = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Data fasilitator bidang berhasil diambil',
            'data' => $data
        ]);
    }

    // CREATE FASILITATOR BIDANG
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string|exists:users,id_user',
            'bidang_id' => 'required|string|exists:bidangs,id_bidang',
        ]);

        // Check apakah sudah ada kombinasi user_id dan bidang_id yang sama
        $exists = FasilitatorBidang::where('user_id', $request->user_id)
            ->where('bidang_id', $request->bidang_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Fasilitator sudah memiliki bidang ini'
            ], 409);
        }

        // Verify user is fasilitator
        $user = User::find($request->user_id);
        if (!$user || $user->role->name !== 'fasilitator') {
            return response()->json([
                'message' => 'User harus memiliki role fasilitator'
            ], 422);
        }

        $fasilitatorBidang = FasilitatorBidang::create([
            'id_fasilitator_bidang' => (string) Str::uuid(),
            'user_id' => $request->user_id,
            'bidang_id' => $request->bidang_id,
            'created_at' => now(),
        ]);

        $fasilitatorBidang->load(['fasilitator', 'bidang']);

        // Catat log CREATE
        $this->logCreate(
            $request,
            'FasilitatorBidang',
            $fasilitatorBidang->id_fasilitator_bidang,
            $fasilitatorBidang->toArray(),
            "Bidang '{$fasilitatorBidang->bidang->name}' ditambahkan untuk fasilitator '{$user->name}'."
        );

        return response()->json([
            'message' => 'Fasilitator bidang berhasil ditambahkan',
            'data' => $fasilitatorBidang
        ], 201);
    }

    // DELETE FASILITATOR BIDANG
    public function destroy(Request $request, $id)
    {
        $fasilitatorBidang = FasilitatorBidang::with(['fasilitator', 'bidang'])->find($id);

        if (!$fasilitatorBidang) {
            return response()->json([
                'message' => 'Data fasilitator bidang tidak ditemukan'
            ], 404);
        }

        $dataLama = $fasilitatorBidang->toArray();
        $fasilitatorBidang->delete();

        // Catat log DELETE
        $this->logDelete($request, 'FasilitatorBidang', $id, $dataLama);

        return response()->json([
            'message' => 'Fasilitator bidang berhasil dihapus'
        ]);
    }

    // GET BIDANG DARI SATU FASILITATOR
    public function getBidangByFasilitator($fasilitatorId)
    {
        // Cek apakah fasilitator ada
        $user = User::find($fasilitatorId);

        if (!$user) {
            return response()->json([
                'message' => 'Fasilitator tidak ditemukan'
            ], 404);
        }

        // Ambil semua bidang dari fasilitator
        $bidangs = $user->fasilitatorBidangs()
            ->with('bidang')
            ->orderBy('created_at', 'desc')
            ->get()
            ->pluck('bidang');

        return response()->json([
            'message' => 'Bidang fasilitator berhasil diambil',
            'data' => $bidangs
        ]);
    }

    // GET BIDANG MILIK USER SENDIRI (untuk fasilitator melihat bidang mereka)
    public function getMyBidang(Request $request)
    {
        // Ambil user yang sedang login
        $user = $request->user();

        // Ambil semua bidang dari user yang login
        $bidangs = $user->fasilitatorBidangs()
            ->with('bidang')
            ->orderBy('created_at', 'desc')
            ->get()
            ->pluck('bidang');

        return response()->json([
            'message' => 'Bidang Anda berhasil diambil',
            'data' => $bidangs
        ]);
    }
}
