<?php

namespace App\Http\Controllers\Api\GrupDampingan;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\AnggotaGrupDampingan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AnggotaGrupController extends Controller
{
    use LogsActivity;
    public function index(Request $request)
    {
        $query = AnggotaGrupDampingan::with(['bidang', 'pekerjaan', 'grupDampingan']);

        // Optional: filter by grup_id
        if ($request->has('grup_id')) {
            $query->where('grup_id', $request->grup_id);
        }

        // Optional: filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $anggota = $query->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data' => $anggota
        ]);
    }

    public function store(Request $request)
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
            'grup_id' => 'required|exists:grup_dampingans,id_grup_dampingan',
            'peran' => 'nullable|in:koordinator,anggota'
        ], [
            'foto.max' => 'Ukuran file foto terlalu besar. Maksimal 2MB.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format foto harus jpeg, png, atau jpg.'
        ]);

        $validated['id_anggota_grup'] = (string) Str::uuid();
        $validated['status'] = 'aktif'; // Langsung aktif otomatis
        $validated['created_at'] = now();

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('profil/anggota_grup', 'public');
        }

        $anggota = AnggotaGrupDampingan::create($validated);

        // Generate QR code (status automatically aktif here)
        app(\App\Services\QrCodeService::class)->generateForAnggota($anggota);

        // Catat log CREATE
        $this->logCreate($request, 'AnggotaGrup', $anggota->id_anggota_grup, $anggota->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Anggota grup berhasil ditambahkan',
            'data' => $anggota
        ], 201);
    }

    public function show($id)
    {
        $anggota = AnggotaGrupDampingan::with(['bidang', 'pekerjaan', 'grupDampingan'])->find($id);

        if (!$anggota) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anggota grup tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $anggota
        ]);
    }

    public function update(Request $request, $id)
    {
        $anggota = AnggotaGrupDampingan::find($id);

        if (!$anggota) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anggota grup tidak ditemukan',
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
            'status' => 'nullable|in:aktif,non-aktif,pending,ditolak',
            'peran' => 'nullable|in:koordinator,anggota'
        ], [
            'foto.max' => 'Ukuran file foto terlalu besar. Maksimal 2MB.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format foto harus jpeg, png, atau jpg.'
        ]);

        if ($request->hasFile('foto')) {
            if ($anggota->foto && Storage::disk('public')->exists($anggota->foto)) {
                Storage::disk('public')->delete($anggota->foto);
            }
            $validated['foto'] = $request->file('foto')->store('profil/anggota_grup', 'public');
        }

        $dataLama = $anggota->toArray();
        $anggota->update($validated);

        if ($anggota->status === 'aktif') {
            app(\App\Services\QrCodeService::class)->generateForAnggota($anggota);
        }

        // Catat log UPDATE
        $this->logUpdate($request, 'AnggotaGrup', $anggota->id_anggota_grup, $dataLama, $anggota->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Data anggota grup berhasil diperbarui',
            'data' => $anggota
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $anggota = AnggotaGrupDampingan::find($id);

        if (!$anggota) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anggota grup tidak ditemukan',
            ], 404);
        }

        if ($anggota->foto && Storage::disk('public')->exists($anggota->foto)) {
            Storage::disk('public')->delete($anggota->foto);
        }

        if ($anggota->qr_code && Storage::disk('public')->exists($anggota->qr_code)) {
            Storage::disk('public')->delete($anggota->qr_code);
        }

        $dataLama = $anggota->toArray();
        $anggota->delete();

        // Catat log DELETE
        $this->logDelete($request, 'AnggotaGrup', $id, $dataLama);

        return response()->json([
            'status' => 'success',
            'message' => 'Anggota grup berhasil dihapus',
        ]);
    }
}
