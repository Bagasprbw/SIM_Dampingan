<?php

namespace App\Http\Controllers\Api\GrupDampingan;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PengajuanAnggotaController extends Controller
{
    /**
     * [AJUKAN ANGGOTA]
     * PJ Grup melihat daftar pengajuan (anggota yang dia ajukan)
     */
    public function indexAjukanSaya(Request $request)
    {
        // asumsikan saat ini yang login adalah pj_grup
        $user = auth()->user();

        // ambil grup di mana user adalah pj_grup (pengurus_id)
        $grupIds = \App\Models\GrupDampingan::where('pengurus_id', $user->id_user)->pluck('id_grup_dampingan');

        $pengajuan = AnggotaGrupDampingan::with(['bidang', 'pekerjaan', 'grupDampingan'])
            ->whereIn('grup_id', $grupIds) // Hanya di grup yang dia pegang
            ->whereIn('status', ['pending', 'ditolak']) // Atau tampilkan semua status, tergantung kebutuhan, jika semua hapus ini
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data' => $pengajuan
        ]);
    }

    /**
     * [AJUKAN ANGGOTA]
     * PJ Grup membuat pengajuan anggota baru
     */
    public function storeAjukan(Request $request)
    {
        $validated = $request->validate([
            'bidang_id' => 'required|exists:bidangs,id_bidang',
            'no_anggota' => 'required|unique:anggota_grup_dampingans,no_anggota',
            'name' => 'required|string|max:150',
            'tempat_lahir' => 'nullable|string|max:100',
            'tgl_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'agama' => 'nullable|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:20',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'pekerjaan_id' => 'nullable|exists:pekerjaans,id_pekerjaan',
            'grup_id' => 'required|exists:grup_dampingans,id_grup_dampingan', // Idealnya check apakah grup ini milik PJ Grup ybs.
            'peran' => 'nullable|in:koordinator,anggota'
        ]);

        $validated['id_anggota_grup'] = (string) Str::uuid();
        $validated['status'] = 'pending'; // PENGAJUAN otomatis PENDING
        $validated['created_at'] = now();

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('profil/anggota_grup', 'public');
        }

        $anggota = AnggotaGrupDampingan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan anggota berhasil, menunggu verifikasi',
            'data' => $anggota
        ], 201);
    }

    /**
     * [AJUKAN ANGGOTA]
     * PJ Grup mengedit pengajuan yang masih pending
     */
    public function updateAjukan(Request $request, $id)
    {
        $anggota = AnggotaGrupDampingan::find($id);

        if (!$anggota || $anggota->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengajuan tidak ditemukan atau tidak bisa diedit (status bukan pending)',
            ], 404);
        }

        $validated = $request->validate([
            'bidang_id' => 'nullable|exists:bidangs,id_bidang',
            'no_anggota' => 'nullable|unique:anggota_grup_dampingans,no_anggota,' . $id . ',id_anggota_grup',
            'name' => 'nullable|string|max:150',
            'tempat_lahir' => 'nullable|string|max:100',
            'tgl_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'agama' => 'nullable|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:20',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'pekerjaan_id' => 'nullable|exists:pekerjaans,id_pekerjaan',
            'grup_id' => 'nullable|exists:grup_dampingans,id_grup_dampingan',
            'peran' => 'nullable|in:koordinator,anggota'
        ]);

        if ($request->hasFile('foto')) {
            if ($anggota->foto && Storage::disk('public')->exists($anggota->foto)) {
                Storage::disk('public')->delete($anggota->foto);
            }
            $validated['foto'] = $request->file('foto')->store('profil/anggota_grup', 'public');
        }

        $anggota->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan anggota berhasil diperbarui',
            'data' => $anggota
        ]);
    }

    /**
     * [AJUKAN ANGGOTA]
     * PJ Grup menghapus pengajuan yang masih pending
     */
    public function destroyAjukan($id)
    {
        $anggota = AnggotaGrupDampingan::find($id);

        if (!$anggota || $anggota->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengajuan tidak ditemukan atau tidak bisa dihapus (status bukan pending)',
            ], 404);
        }

        if ($anggota->foto && Storage::disk('public')->exists($anggota->foto)) {
            Storage::disk('public')->delete($anggota->foto);
        }

        $anggota->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan anggota berhasil dihapus',
        ]);
    }

    /**
     * [VERIFIKASI ANGGOTA]
     * Fasilitator/Admin melihat daftar pengajuan berstatus PENDING
     */
    public function indexPending(Request $request)
    {
        // Jika yang login adalah fasilitator, sebaiknya filter grup dampingan
        // yang difasilitasi oleh fasilitator tersebut.
        $user = auth()->user();
        
        $query = AnggotaGrupDampingan::with(['bidang', 'pekerjaan', 'grupDampingan'])
            ->where('status', 'pending');
        
        // Misal hanya perlihatkan dari grup fasilitator:
        if ($user->role->name === 'fasilitator') {
            $grupFasilitatorIds = \App\Models\GrupFasilitator::where('fasilitator_id', $user->id_user)
                ->pluck('grup_dampingan_id');
            $query->whereIn('grup_id', $grupFasilitatorIds);
        }

        $pengajuan = $query->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data' => $pengajuan
        ]);
    }

    /**
     * [VERIFIKASI ANGGOTA]
     * Fasilitator/Admin menyetujui (aktif) atau menolak (ditolak) pengajuan
     */
    public function verifikasi(Request $request, $id)
    {
        $anggota = AnggotaGrupDampingan::find($id);

        if (!$anggota || $anggota->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pengajuan tidak ditemukan atau tidak berstatus pending',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:aktif,ditolak'
        ]);

        $anggota->status = $validated['status'];
        $anggota->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan anggota berhasil diverifikasi menjadi: ' . $anggota->status,
            'data' => $anggota
        ]);
    }
}
