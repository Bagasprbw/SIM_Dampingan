<?php

namespace App\Http\Controllers\Api\Panduan;

use App\Http\Controllers\Controller;
use App\Models\Paduan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PanduanController extends Controller
{
    public function indexKelola()
    {
        $panduans = Paduan::with('roleTarget')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Data panduan berhasil diambil',
            'data' => $panduans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:200',
            'link_file' => 'required|string|max:255',
            'link_video' => 'required|string|max:255',
            'role_target' => 'required|exists:roles,id_role',
        ]);

        $panduan = Paduan::create([
            'id_paduan' => (string) Str::uuid(),
            'judul' => $request->judul,
            'link_file' => $request->link_file,
            'link_video' => $request->link_video,
            'role_target' => $request->role_target,
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Panduan berhasil dibuat',
            'data' => $panduan->load('roleTarget'),
        ], 201);
    }

    public function showKelola($id)
    {
        $panduan = Paduan::with('roleTarget')->find($id);
        if (! $panduan) {
            return response()->json(['message' => 'Panduan tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail panduan berhasil diambil',
            'data' => $panduan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $panduan = Paduan::find($id);
        if (! $panduan) {
            return response()->json(['message' => 'Panduan tidak ditemukan'], 404);
        }

        $request->validate([
            'judul' => 'sometimes|required|string|max:200',
            'link_file' => 'sometimes|required|string|max:255',
            'link_video' => 'sometimes|required|string|max:255',
            'role_target' => 'sometimes|required|exists:roles,id_role',
        ]);

        $data = $request->only(['judul', 'link_file', 'link_video', 'role_target']);
        
        $panduan->update($data);

        return response()->json([
            'message' => 'Panduan berhasil diupdate',
            'data' => $panduan->load('roleTarget'),
        ]);
    }

    public function destroy($id)
    {
        $panduan = Paduan::find($id);
        if (! $panduan) {
            return response()->json(['message' => 'Panduan tidak ditemukan'], 404);
        }

        $panduan->delete();

        return response()->json([
            'message' => 'Panduan berhasil dihapus',
        ]);
    }

    public function indexView()
    {
        $roleId = auth()->user()->role_id;

        $panduans = Paduan::with('roleTarget')
            ->where('role_target', $roleId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Data panduan untuk role Anda berhasil diambil',
            'data' => $panduans,
        ]);
    }

    public function showView($id)
    {
        $roleId = auth()->user()->role_id;

        $panduan = Paduan::with('roleTarget')
            ->where('id_paduan', $id)
            ->where('role_target', $roleId)
            ->first();

        if (! $panduan) {
            return response()->json(['message' => 'Panduan tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail panduan berhasil diambil',
            'data' => $panduan,
        ]);
    }
}
