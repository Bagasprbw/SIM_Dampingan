<?php

namespace App\Http\Controllers\Api\GrupDampingan;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\GrupDampingan;
use App\Models\GrupFasilitator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrupDampinganController extends Controller
{
    use LogsActivity;
    /**
     * ====================================
     * HELPER METHODS (PRIVATE)
     * ====================================
     */

    /**
     * Cek apakah current user bisa mengakses grup dampingan berdasarkan cascade downward wilayah
     * Superadmin bisa akses semua
     * Admin prov hanya bisa akses grup di provinsinya
     * Admin kab hanya bisa akses grup di kabupatennya
     * Admin kec hanya bisa akses grup di kecamatannya
     */
    private function canAccessGrup(User $currentUser, GrupDampingan $grupDampingan): bool
    {
        // Superadmin bisa akses semua
        if ($currentUser->role->name === 'superadmin') {
            return true;
        }

        // Admin provinsi hanya akses grup di provinsinya
        if ($currentUser->role->name === 'admin_provinsi') {
            return $grupDampingan->kode_prov === $currentUser->kode_prov;
        }

        // Admin kabupaten hanya akses grup di kabupatennya
        if ($currentUser->role->name === 'admin_kabupaten') {
            return $grupDampingan->kode_kab === $currentUser->kode_kab;
        }

        // Admin kecamatan hanya akses grup di kecamatannya
        if ($currentUser->role->name === 'admin_kecamatan') {
            return $grupDampingan->kode_kec === $currentUser->kode_kec;
        }

        // PJ Grup bisa akses grup yang dia kelola (pengurus)
        if ($currentUser->role->name === 'pj_grup') {
            return $grupDampingan->pengurus_id === $currentUser->id_user;
        }

        // Fasilitator bisa akses grup yang mereka dampingi
        if ($currentUser->role->name === 'fasilitator') {
            return $grupDampingan->grupFasilitators()
                ->where('fasilitator_id', $currentUser->id_user)
                ->exists();
        }

        return false;
    }

    /**
     * Validasi bahwa wilayah grup yang akan dibuat sesuai dengan kewenangan current user
     */
    private function validateWilayah(User $currentUser, Request $request): bool
    {
        // Superadmin tidak ada batasan wilayah
        if ($currentUser->role->name === 'superadmin') {
            return true;
        }

        // Admin Provinsi: hanya bisa membuat grup di provinsinya
        if ($currentUser->role->name === 'admin_provinsi') {
            if ($request->filled('kode_prov') && $request->kode_prov !== $currentUser->kode_prov) {
                return false;
            }
            return $request->filled('kode_prov') && $request->kode_prov === $currentUser->kode_prov;
        }

        // Admin Kabupaten: hanya bisa membuat grup di kabupatennya
        if ($currentUser->role->name === 'admin_kabupaten') {
            if ($request->filled('kode_kab') && $request->kode_kab !== $currentUser->kode_kab) {
                return false;
            }
            return $request->filled('kode_kab') && $request->kode_kab === $currentUser->kode_kab;
        }

        // Admin Kecamatan: hanya bisa membuat grup di kecamatannya
        if ($currentUser->role->name === 'admin_kecamatan') {
            if ($request->filled('kode_kec') && $request->kode_kec !== $currentUser->kode_kec) {
                return false;
            }
            return $request->filled('kode_kec') && $request->kode_kec === $currentUser->kode_kec;
        }

        return false;
    }

    /**
     * Tambahkan filter cascade downward ke query builder berdasarkan current user
     */
    private function applyCascadeFilter($query, User $currentUser)
    {
        if ($currentUser->role->name === 'superadmin') {
            // Superadmin bisa lihat semua
            return $query;
        }

        if ($currentUser->role->name === 'admin_provinsi') {
            return $query->where('kode_prov', $currentUser->kode_prov);
        }

        if ($currentUser->role->name === 'admin_kabupaten') {
            return $query->where('kode_kab', $currentUser->kode_kab);
        }

        if ($currentUser->role->name === 'admin_kecamatan') {
            return $query->where('kode_kec', $currentUser->kode_kec);
        }

        if ($currentUser->role->name === 'pj_grup') {
            // PJ Grup hanya lihat grup yang mereka kelola
            return $query->where('pengurus_id', $currentUser->id_user);
        }

        if ($currentUser->role->name === 'fasilitator') {
            // Fasilitator hanya lihat grup yang mereka dampingi
            return $query->whereHas('grupFasilitators', function ($q) use ($currentUser) {
                $q->where('fasilitator_id', $currentUser->id_user);
            });
        }

        return $query;
    }

    /**
     * ====================================
     * INDEX METHOD
     * ====================================
     */

    /**
     * GET /api/grup-dampingan
     * List grup dampingan dengan filter cascade downward berdasarkan wilayah/role
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        $query = GrupDampingan::with([
            'bidang',
            'pengurus',
            'provinsi',
            'kabupaten',
            'kecamatan',
            'grupFasilitators.fasilitator'
        ]);

        // Apply cascade downward filter
        $query = $this->applyCascadeFilter($query, $currentUser);

        // Optional filter berdasarkan bidang
        if ($request->filled('bidang_id')) {
            $query->where('bidang_id', $request->bidang_id);
        }

        // Optional filter berdasarkan level dampingan
        if ($request->filled('level_dampingan')) {
            $query->where('level_dampingan', $request->level_dampingan);
        }

        $grupos = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Data grup dampingan berhasil diambil',
            'data' => $grupos
        ]);
    }

    /**
     * ====================================
     * STORE METHOD
     * ====================================
     */

    /**
     * POST /api/grup-dampingan
     * Create grup dampingan dengan validasi role, wilayah, dan fasilitator
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        // Validasi: apakah user ini boleh membuat grup dampingan
        $allowedRoles = ['superadmin', 'admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'];
        if (!in_array($currentUser->role->name, $allowedRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk membuat grup dampingan'
            ], 403);
        }

        // Validasi request
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'bidang_id' => 'required|string|exists:bidangs,id_bidang',
            'pengurus_id' => 'required|string|exists:users,id_user',
            'level_dampingan' => 'required|in:pusat,provinsi,kabupaten,kecamatan',
            'kode_prov' => 'nullable|string|exists:provinsis,kode',
            'kode_kab' => 'nullable|string|exists:kabupatens,kode',
            'kode_kec' => 'nullable|string|exists:kecamatans,kode',
            'fasilitator_ids' => 'nullable|array', // Multiple fasilitator
            'fasilitator_ids.*' => 'string|exists:users,id_user',
        ]);

        // Validasi Wilayah
        if (!$this->validateWilayah($currentUser, $request)) {
            return response()->json([
                'message' => 'Anda tidak memiliki kewenangan untuk membuat grup di wilayah tersebut'
            ], 403);
        }

        // Validasi bahwa pengurus adalah PJ Grup
        $pengurus = User::find($validated['pengurus_id']);
        if (!$pengurus || $pengurus->role->name !== 'pj_grup') {
            return response()->json([
                'message' => 'Pengurus harus memiliki role PJ Grup'
            ], 422);
        }

        // Validasi bahwa pengurus ada di wilayah yang sama
        if (!$this->canAccessUser($currentUser, $pengurus)) {
            return response()->json([
                'message' => 'Pengurus tidak ada di wilayah yang Anda kelola'
            ], 422);
        }

        // Create grup dampingan
        $grupDampingan = GrupDampingan::create([
            'id_grup_dampingan' => (string) Str::uuid(),
            'name' => $validated['name'],
            'bidang_id' => $validated['bidang_id'],
            'pengurus_id' => $validated['pengurus_id'],
            'level_dampingan' => $validated['level_dampingan'],
            'kode_prov' => $validated['kode_prov'] ?? null,
            'kode_kab' => $validated['kode_kab'] ?? null,
            'kode_kec' => $validated['kode_kec'] ?? null,
            'created_at' => now(),
        ]);

        // Tambahkan fasilitator jika ada
        if ($request->filled('fasilitator_ids') && is_array($validated['fasilitator_ids'])) {
            $fasilitatorIds = array_unique($validated['fasilitator_ids']); // Remove duplicates

            foreach ($fasilitatorIds as $fasilitatorId) {
                // Validasi bahwa fasilitator adalah user dengan role fasilitator
                $fasilitator = User::find($fasilitatorId);
                if (!$fasilitator || $fasilitator->role->name !== 'fasilitator') {
                    continue; // Skip jika bukan fasilitator
                }

                // Validasi bahwa fasilitator ada di wilayah yang sama
                if (!$this->canAccessUser($currentUser, $fasilitator)) {
                    continue; // Skip jika tidak di wilayah yang sama
                }

                // Create GrupFasilitator
                GrupFasilitator::create([
                    'id_grup_fasilitator' => (string) Str::uuid(),
                    'grup_dampingan_id' => $grupDampingan->id_grup_dampingan,
                    'fasilitator_id' => $fasilitatorId,
                    'created_at' => now(),
                ]);
            }
        }

        $grupDampingan->load(['bidang', 'pengurus', 'provinsi', 'kabupaten', 'kecamatan', 'grupFasilitators.fasilitator']);

        // Catat log CREATE
        $this->logCreate($request, 'GrupDampingan', $grupDampingan->id_grup_dampingan, $grupDampingan->toArray());

        return response()->json([
            'message' => 'Grup dampingan berhasil ditambahkan',
            'data' => $grupDampingan
        ], 201);
    }

    /**
     * ====================================
     * SHOW METHOD
     * ====================================
     */

    /**
     * GET /api/grup-dampingan/{id}
     * Get detail grup dampingan
     */
    public function show(Request $request, $id)
    {
        $grupDampingan = GrupDampingan::with([
            'bidang',
            'pengurus',
            'provinsi',
            'kabupaten',
            'kecamatan',
            'grupFasilitators.fasilitator',
            'anggotaGrupDampingans',
            'kegiatanGrups'
        ])->find($id);

        if (!$grupDampingan) {
            return response()->json([
                'message' => 'Grup dampingan tidak ditemukan'
            ], 404);
        }

        $currentUser = $request->user();
        if (!$this->canAccessGrup($currentUser, $grupDampingan)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke grup dampingan ini'
            ], 403);
        }

        return response()->json([
            'message' => 'Detail grup dampingan berhasil diambil',
            'data' => $grupDampingan
        ]);
    }

    /**
     * ====================================
     * UPDATE METHOD
     * ====================================
     */

    /**
     * PUT /api/grup-dampingan/{id}
     * Update grup dampingan
     */
    public function update(Request $request, $id)
    {
        $grupDampingan = GrupDampingan::find($id);

        if (!$grupDampingan) {
            return response()->json([
                'message' => 'Grup dampingan tidak ditemukan'
            ], 404);
        }

        $currentUser = $request->user();
        if (!$this->canAccessGrup($currentUser, $grupDampingan)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses untuk mengubah grup dampingan ini'
            ], 403);
        }

        // Validasi request
        $validated = $request->validate([
            'name' => 'sometimes|string|max:200',
            'bidang_id' => 'sometimes|string|exists:bidangs,id_bidang',
            'pengurus_id' => 'sometimes|string|exists:users,id_user',
            'level_dampingan' => 'sometimes|in:pusat,provinsi,kabupaten,kecamatan',
            'kode_prov' => 'nullable|string|exists:provinsis,kode',
            'kode_kab' => 'nullable|string|exists:kabupatens,kode',
            'kode_kec' => 'nullable|string|exists:kecamatans,kode',
        ]);

        // Jika mengubah pengurus, validasi bahwa baru pengurus adalah PJ Grup
        if ($request->filled('pengurus_id')) {
            $pengurus = User::find($validated['pengurus_id']);
            if (!$pengurus || $pengurus->role->name !== 'pj_grup') {
                return response()->json([
                    'message' => 'Pengurus harus memiliki role PJ Grup'
                ], 422);
            }
        }

        // Update grup dampingan
        $dataLama = $grupDampingan->toArray();
        $grupDampingan->update($validated);
        $grupDampingan->load(['bidang', 'pengurus', 'provinsi', 'kabupaten', 'kecamatan', 'grupFasilitators.fasilitator']);

        // Catat log UPDATE
        $this->logUpdate($request, 'GrupDampingan', $grupDampingan->id_grup_dampingan, $dataLama, $grupDampingan->toArray());

        return response()->json([
            'message' => 'Grup dampingan berhasil diubah',
            'data' => $grupDampingan
        ]);
    }

    /**
     * ====================================
     * DESTROY METHOD
     * ====================================
     */

    /**
     * DELETE /api/grup-dampingan/{id}
     * Delete grup dampingan
     */
    public function destroy(Request $request, $id)
    {
        $grupDampingan = GrupDampingan::find($id);

        if (!$grupDampingan) {
            return response()->json([
                'message' => 'Grup dampingan tidak ditemukan'
            ], 404);
        }

        $currentUser = $request->user();
        if (!$this->canAccessGrup($currentUser, $grupDampingan)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses untuk menghapus grup dampingan ini'
            ], 403);
        }

        $dataLama = $grupDampingan->toArray();
        $grupDampingan->delete();

        // Catat log DELETE
        $this->logDelete($request, 'GrupDampingan', $id, $dataLama);

        return response()->json([
            'message' => 'Grup dampingan berhasil dihapus'
        ]);
    }

    /**
     * ====================================
     * HELPER METHOD FOR CANACCESS
     * ====================================
     */

    /**
     * Helper: canAccessUser - shared with private helper
     */
    private function canAccessUser(User $currentUser, User $targetUser): bool
    {
        if ($currentUser->role->name === 'superadmin') {
            return true;
        }

        if ($currentUser->role->name === 'admin_provinsi') {
            return $targetUser->kode_prov === $currentUser->kode_prov;
        }

        if ($currentUser->role->name === 'admin_kabupaten') {
            return $targetUser->kode_kab === $currentUser->kode_kab;
        }

        if ($currentUser->role->name === 'admin_kecamatan') {
            return $targetUser->kode_kec === $currentUser->kode_kec;
        }

        return false;
    }
}
