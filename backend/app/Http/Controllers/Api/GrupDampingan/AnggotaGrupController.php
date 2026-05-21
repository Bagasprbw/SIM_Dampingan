<?php

namespace App\Http\Controllers\Api\GrupDampingan;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AnggotaGrupController extends Controller
{
    use LogsActivity;

    /**
     * Cek apakah current user memiliki hak akses ke data anggota berdasarkan wilayah grup
     */
    private function canAccessAnggota(User $currentUser, AnggotaGrupDampingan $anggota): bool
    {
        if ($currentUser->role->name === 'superadmin') {
            return true;
        }

        $grup = $anggota->grupDampingan;
        if (!$grup) {
            return false;
        }

        if ($currentUser->role->name === 'admin_provinsi') {
            return $grup->kode_prov === $currentUser->kode_prov;
        }

        if ($currentUser->role->name === 'admin_kabupaten') {
            return $grup->kode_kab === $currentUser->kode_kab;
        }

        if ($currentUser->role->name === 'admin_kecamatan') {
            return $grup->kode_kec === $currentUser->kode_kec;
        }

        return false;
    }

    public function index(Request $request)
    {
        $currentUser = $request->user()->load('role');
        $query = AnggotaGrupDampingan::with([
            'bidang', 
            'pekerjaan', 
            'grupDampingan.provinsi', 
            'grupDampingan.kabupaten', 
            'grupDampingan.kecamatan'
        ]);

        // Default: filter by status 'aktif' unless specified otherwise
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'aktif');
        }

        // Search filter: nama, no_anggota, alamat
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('no_anggota', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        // Filter Jenis Kelamin
        if ($request->filled('jenis_kelamin')) {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }

        // Filter Bidang Dampingan
        if ($request->filled('bidang_id')) {
            $query->where('bidang_id', $request->bidang_id);
        }

        // Filter Grup Dampingan
        if ($request->filled('grup_id')) {
            $query->where('grup_id', $request->grup_id);
        }

        // Regional Request Filters (Filter dropdown wilayah)
        if ($request->filled('kode_prov')) {
            $query->whereHas('grupDampingan', function($q) use ($request) {
                $q->where('kode_prov', $request->kode_prov);
            });
        }
        if ($request->filled('kode_kab')) {
            $query->whereHas('grupDampingan', function($q) use ($request) {
                $q->where('kode_kab', $request->kode_kab);
            });
        }
        if ($request->filled('kode_kec')) {
            $query->whereHas('grupDampingan', function($q) use ($request) {
                $q->where('kode_kec', $request->kode_kec);
            });
        }

        // Enforce Regional Scoping (Cascade Downward)
        if ($currentUser->role->name === 'admin_provinsi') {
            $query->whereHas('grupDampingan', function($q) use ($currentUser) {
                $q->where('kode_prov', $currentUser->kode_prov);
            });
        } elseif ($currentUser->role->name === 'admin_kabupaten') {
            $query->whereHas('grupDampingan', function($q) use ($currentUser) {
                $q->where('kode_kab', $currentUser->kode_kab);
            });
        } elseif ($currentUser->role->name === 'admin_kecamatan') {
            $query->whereHas('grupDampingan', function($q) use ($currentUser) {
                $q->where('kode_kec', $currentUser->kode_kec);
            });
        }

        $anggota = $query->orderBy('name', 'asc')->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data' => $anggota->items(),
            'meta' => [
                'current_page' => $anggota->currentPage(),
                'last_page' => $anggota->lastPage(),
                'per_page' => $anggota->perPage(),
                'total' => $anggota->total(),
                'from' => $anggota->firstItem(),
                'to' => $anggota->lastItem()
            ]
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
        ], [
            'foto.max' => 'Ukuran file foto terlalu besar. Maksimal 2MB.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format foto harus jpeg, png, atau jpg.'
        ]);

        $grup = GrupDampingan::find($request->grup_id);
        if (!$grup) {
            return response()->json([
                'status' => 'error',
                'message' => 'Grup dampingan tidak ditemukan',
            ], 404);
        }

        // Validate Regional Authority
        $currentUser = $request->user()->load('role');
        if ($currentUser->role->name === 'admin_provinsi' && $grup->kode_prov !== $currentUser->kode_prov) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda hanya boleh menambahkan anggota ke grup di provinsi Anda'
            ], 403);
        }
        if ($currentUser->role->name === 'admin_kabupaten' && $grup->kode_kab !== $currentUser->kode_kab) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda hanya boleh menambahkan anggota ke grup di kabupaten Anda'
            ], 403);
        }
        if ($currentUser->role->name === 'admin_kecamatan' && $grup->kode_kec !== $currentUser->kode_kec) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda hanya boleh menambahkan anggota ke grup di kecamatan Anda'
            ], 403);
        }

        $validated['id_anggota_grup'] = (string) Str::uuid();
        $validated['status'] = 'aktif'; // Langsung aktif otomatis
        $validated['created_at'] = now();

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('profil/anggota_grup', 'public');
        }

        $anggota = AnggotaGrupDampingan::create($validated);

        // Generate QR code
        app(\App\Services\QrCodeService::class)->generateForAnggota($anggota);

        // Catat log CREATE
        $this->logCreate($request, 'AnggotaGrup', $anggota->id_anggota_grup, $anggota->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Anggota grup berhasil ditambahkan',
            'data' => $anggota
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $anggota = AnggotaGrupDampingan::with(['bidang', 'pekerjaan', 'grupDampingan'])->find($id);

        if (!$anggota) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anggota grup tidak ditemukan',
            ], 404);
        }

        // Validate access authority
        $currentUser = $request->user()->load('role');
        if (!$this->canAccessAnggota($currentUser, $anggota)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki hak akses untuk data anggota ini'
            ], 403);
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

        // Validate access authority
        $currentUser = $request->user()->load('role');
        if (!$this->canAccessAnggota($currentUser, $anggota)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki hak akses untuk mengupdate data anggota ini'
            ], 403);
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
        ], [
            'foto.max' => 'Ukuran file foto terlalu besar. Maksimal 2MB.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format foto harus jpeg, png, atau jpg.'
        ]);

        // If target group is changed, validate the new group's region scope
        if ($request->filled('grup_id')) {
            $grup = GrupDampingan::find($request->grup_id);
            if (!$grup) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Grup dampingan baru tidak ditemukan',
                ], 404);
            }

            if ($currentUser->role->name === 'admin_provinsi' && $grup->kode_prov !== $currentUser->kode_prov) {
                return response()->json(['status' => 'error', 'message' => 'Anda hanya boleh memindahkan anggota ke grup di provinsi Anda'], 403);
            }
            if ($currentUser->role->name === 'admin_kabupaten' && $grup->kode_kab !== $currentUser->kode_kab) {
                return response()->json(['status' => 'error', 'message' => 'Anda hanya boleh memindahkan anggota ke grup di kabupaten Anda'], 403);
            }
            if ($currentUser->role->name === 'admin_kecamatan' && $grup->kode_kec !== $currentUser->kode_kec) {
                return response()->json(['status' => 'error', 'message' => 'Anda hanya boleh memindahkan anggota ke grup di kecamatan Anda'], 403);
            }
        }

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

        // Validate access authority
        $currentUser = $request->user()->load('role');
        if (!$this->canAccessAnggota($currentUser, $anggota)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki hak akses untuk menghapus data anggota ini'
            ], 403);
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
