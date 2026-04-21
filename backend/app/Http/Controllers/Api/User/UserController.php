<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    use LogsActivity;
    /**
     * ====================================
     * HELPER METHODS (PRIVATE)
     * ====================================
     */

    /**
     * Cek apakah current user bisa mengakses target user berdasarkan cascade downward wilayah
     * Superadmin bisa akses semua
     * Admin prov hanya bisa akses user di provinsinya
     * Admin kab hanya bisa akses user di kabupatennya
     * Admin kec hanya bisa akses user di kecamatannya
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

        // Fasilitator dan PJ Grup tidak bisa akses user management
        return false;
    }

    /**
     * Tentukan role mana saja yang boleh dibuat oleh user berdasarkan rolenya
     * Cascade downward: setiap role hanya bisa membuat role yang lebih rendah
     */
    private function getAllowedRolesToCreate(User $user): array
    {
        return match ($user->role->name) {
            'superadmin' => ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan', 'fasilitator', 'pj_grup'],
            'admin_provinsi' => ['admin_kabupaten', 'fasilitator', 'pj_grup'],
            'admin_kabupaten' => ['admin_kecamatan', 'fasilitator', 'pj_grup'],
            'admin_kecamatan' => ['fasilitator', 'pj_grup'],
            default => [],
        };
    }

    /**
     * Validasi bahwa wilayah user yang akan dibuat sesuai dengan kewenangan current user
     */
    private function validateWilayah(User $currentUser, Request $request): bool
    {
        // Superadmin tidak ada batasan wilayah
        if ($currentUser->role->name === 'superadmin') {
            return true;
        }

        // Admin Provinsi: hanya bisa membuat user di provinsinya
        if ($currentUser->role->name === 'admin_provinsi') {
            if ($request->filled('kode_prov') && $request->kode_prov !== $currentUser->kode_prov) {
                return false;
            }
            // User harus di provinsi yang sama
            return $request->filled('kode_prov') && $request->kode_prov === $currentUser->kode_prov;
        }

        // Admin Kabupaten: hanya bisa membuat user di kabupatennya
        if ($currentUser->role->name === 'admin_kabupaten') {
            if ($request->filled('kode_kab') && $request->kode_kab !== $currentUser->kode_kab) {
                return false;
            }
            return $request->filled('kode_kab') && $request->kode_kab === $currentUser->kode_kab;
        }

        // Admin Kecamatan: hanya bisa membuat user di kecamatannya
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

        return $query;
    }

    /**
     * Validasi common untuk store request (nama, username, password, foto, dst)
     */
    private function validateCommonFields(): array
    {
        return [
            'name' => 'required|string|max:150',
            'username' => 'required|string|max:100|unique:users,username',
            'password' => 'required|string|min:6',
            'no_telp' => 'nullable|string|max:20',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'sometimes|enum:active,inactive',
        ];
    }

    /**
     * Simpan foto ke storage dan return path, atau null jika tidak ada
     * Return format: 'profil/user/uuid.ext' (relative path untuk storage/app/public)
     */
    private function saveFoto(Request $request): ?string
    {
        if (!$request->hasFile('foto')) {
            return null;
        }

        $file = $request->file('foto');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('profil/user', $filename, 'public');

        // Pastikan return relative path, bukan absolute atau temp path
        // $path dari storeAs() sudah dalam format relative 'profil/user/uuid.ext'
        return $path ? $path : null;
    }

    /**
     * ====================================
     * INDEX METHODS (PUBLIC - ROLE SPECIFIC)
     * ====================================
     */

    /**
     * GET /api/users/fasilitator
     * List fasilitator dengan filter cascade downward berdasarkan wilayah
     */
    public function indexFasilitator(Request $request)
    {
        $currentUser = $request->user();

        $query = User::with(['role', 'provinsi', 'kabupaten', 'kecamatan'])
            ->whereHas('role', fn($q) => $q->where('name', 'fasilitator'));

        // Apply cascade downward filter
        $query = $this->applyCascadeFilter($query, $currentUser);

        $users = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'message' => 'Data fasilitator berhasil diambil',
            'data' => $users
        ]);
    }



    /**
     * GET /api/users/admin-bawahan
     * List admin bawahan dengan hierarchy berbeda berdasarkan role current user
     * - Superadmin: lihat semua admin (provinsi, kabupaten, kecamatan)
     * - Admin Provinsi: lihat admin kabupaten di provinsinya
     * - Admin Kabupaten: lihat admin kecamatan di kabupatennya
     * - Admin Kecamatan: tidak bisa (403)
     */
    public function indexAdminBawahan(Request $request)
    {
        $currentUser = $request->user()->load('role');

        $query = User::with(['role', 'provinsi', 'kabupaten', 'kecamatan']);

        // Filter berdasarkan role current user dengan multi-level support
        if ($currentUser->role->name === 'superadmin') {
            $query->whereHas('role', fn($q) =>
                $q->whereIn('name', ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'])
            );
        } elseif ($currentUser->role->name === 'admin_provinsi') {
            // Admin Provinsi bisa lihat admin_kabupaten DAN admin_kecamatan di provinsinya
            $query->where('kode_prov', $currentUser->kode_prov)
                  ->whereHas('role', fn($q) =>
                      $q->whereIn('name', ['admin_kabupaten', 'admin_kecamatan'])
                  );
        } elseif ($currentUser->role->name === 'admin_kabupaten') {
            // Admin Kabupaten hanya bisa lihat admin_kecamatan di kabupatennya
            $query->where('kode_kab', $currentUser->kode_kab)
                  ->whereHas('role', fn($q) =>
                      $q->where('name', 'admin_kecamatan')
                  );
        } else {
            // Role lain tidak ada permission
            $query->whereRaw('1 = 0');
        }

        $users = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'message' => 'Data admin bawahan berhasil diambil',
            'data' => $users
        ]);
    }

    /**
     * GET /api/users/pj-grup
     * List PJ Grup dengan filter cascade downward
     */
    public function indexPjGrup(Request $request)
    {
        $currentUser = $request->user();

        $query = User::with(['role', 'provinsi', 'kabupaten', 'kecamatan'])
            ->whereHas('role', fn($q) => $q->where('name', 'pj_grup'));

        // Apply cascade downward filter
        $query = $this->applyCascadeFilter($query, $currentUser);

        $users = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'message' => 'Data PJ Grup berhasil diambil',
            'data' => $users
        ]);
    }

    /**
     * ====================================
     * STORE METHODS (PUBLIC - ROLE SPECIFIC)
     * ====================================
     */

    /**
     * POST /api/users/fasilitator
     * Create fasilitator dengan validasi role dan wilayah
     */
    public function storeFasilitator(Request $request)
    {
        $currentUser = $request->user();
        $role = Role::where('name', 'fasilitator')->first();

        // Validasi: apakah user ini boleh membuat fasilitator
        if (!in_array('fasilitator', $this->getAllowedRolesToCreate($currentUser))) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin membuat fasilitator'
            ], 403);
        }

        // ValidasiRequest
        $validated = $request->validate(array_merge(
            $this->validateCommonFields(),
            ['kode_prov' => 'nullable|string|exists:provinsis,kode',
             'kode_kab' => 'nullable|string|exists:kabupatens,kode',
             'kode_kec' => 'nullable|string|exists:kecamatans,kode']
        ));

        // Validasi Wilayah
        if (!$this->validateWilayah($currentUser, $request)) {
            return response()->json([
                'message' => 'Wilayah fasilitator tidak sesuai dengan kewenangan Anda'
            ], 403);
        }

        // Simpan foto
        $fotoPath = $this->saveFoto($request);

        // Create user
        $user = User::create([
            'id_user' => (string) Str::uuid(),
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id_role,
            'no_telp' => $validated['no_telp'] ?? null,
            'foto' => $fotoPath,
            'kode_prov' => $request->kode_prov ?? null,
            'kode_kab' => $request->kode_kab ?? null,
            'kode_kec' => $request->kode_kec ?? null,
            'created_by' => $currentUser->id_user,
            'status' => 'active',
        ]);

        $user->load(['role', 'provinsi', 'kabupaten', 'kecamatan']);

        // Catat log CREATE fasilitator
        $this->logCreate($request, 'User:Fasilitator', $user->id_user, $user->toArray(), "Fasilitator '{$user->name}' berhasil dibuat.");

        return response()->json([
            'message' => 'Fasilitator berhasil dibuat',
            'data' => $user
        ], 201);
    }



    /**
     * POST /api/users/admin-bawahan
     * Create admin bawahan dengan hierarchy multi-level:
     * - Superadmin: bisa create admin_provinsi, admin_kabupaten, admin_kecamatan (di mana saja)
     * - Admin Provinsi: bisa create admin_kabupaten dan admin_kecamatan (di provinsinya)
     * - Admin Kabupaten: bisa create admin_kecamatan (di kabupatennya)
     * - Admin Kecamatan: tidak bisa create (no permission)
     */
    public function storeAdminBawahan(Request $request)
    {
        $currentUser = $request->user()->load('role');

        // Tentukan role target yang diizinkan untuk user saat ini
        $allowedRoles = match ($currentUser->role->name) {
            'superadmin' => ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'],
            'admin_provinsi' => ['admin_kabupaten', 'admin_kecamatan'],
            'admin_kabupaten' => ['admin_kecamatan'],
            default => []
        };

        if (empty($allowedRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin membuat admin bawahan'
            ], 403);
        }

        // Ambil role_id dari request dan cek apakah valid
        if (!$request->filled('role_id')) {
            return response()->json([
                'message' => 'role_id harus diisi'
            ], 422);
        }

        $role = Role::find($request->role_id);

        if (!$role) {
            return response()->json([
                'message' => 'Role tidak ditemukan'
            ], 404);
        }

        // Validasi: pastikan role target ada di daftar yang diizinkan
        if (!in_array($role->name, $allowedRoles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin membuat admin dengan role ' . $role->name
            ], 403);
        }

        // Tentukan field validasi berdasarkan target role
        $validationRules = array_merge(
            $this->validateCommonFields(),
            ['role_id' => 'required|string|exists:roles,id_role']
        );

        // Setiap role memiliki requirement field wilayah berbeda
        if ($role->name === 'admin_provinsi') {
            $validationRules['kode_prov'] = 'required|string|exists:provinsis,kode';
            $validationRules['kode_kab'] = 'nullable|string';
            $validationRules['kode_kec'] = 'nullable|string';
        } elseif ($role->name === 'admin_kabupaten') {
            $validationRules['kode_prov'] = 'required|string|exists:provinsis,kode';
            $validationRules['kode_kab'] = 'required|string|exists:kabupatens,kode';
            $validationRules['kode_kec'] = 'nullable|string';
        } elseif ($role->name === 'admin_kecamatan') {
            $validationRules['kode_prov'] = 'required|string|exists:provinsis,kode';
            $validationRules['kode_kab'] = 'required|string|exists:kabupatens,kode';
            $validationRules['kode_kec'] = 'required|string|exists:kecamatans,kode';
        }

        $validated = $request->validate($validationRules);

        // Validasi Wilayah: pastikan kode wilayah sesuai dengan kewenangan user
        if (!$this->validateWilayah($currentUser, $request)) {
            return response()->json([
                'message' => 'Wilayah admin yang akan dibuat tidak sesuai dengan kewenangan Anda'
            ], 403);
        }

        // Validasi tambahan: untuk admin_kab, pastikan kode_kab ada di provinsi yang ditargetkan
        if ($role->name === 'admin_kabupaten' && $request->filled('kode_kab')) {
            $kabupaten = DB::table('kabupatens')
                ->where('kode', $request->kode_kab)
                ->where('kode_prov', $request->kode_prov)
                ->exists();

            if (!$kabupaten) {
                return response()->json([
                    'message' => 'Kabupaten tidak ditemukan di provinsi tersebut'
                ], 422);
            }
        }

        // Validasi tambahan: untuk admin_kec, pastikan kode_kec ada di kabupaten yang ditargetkan
        if ($role->name === 'admin_kecamatan' && $request->filled('kode_kec')) {
            $kecamatan = DB::table('kecamatans')
                ->where('kode', $request->kode_kec)
                ->where('kode_kab', $request->kode_kab)
                ->exists();

            if (!$kecamatan) {
                return response()->json([
                    'message' => 'Kecamatan tidak ditemukan di kabupaten tersebut'
                ], 422);
            }
        }

        // Simpan foto
        $fotoPath = $this->saveFoto($request);

        // Create user
        $user = User::create([
            'id_user' => (string) Str::uuid(),
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id_role,
            'no_telp' => $validated['no_telp'] ?? null,
            'foto' => $fotoPath,
            'kode_prov' => $request->kode_prov ?? null,
            'kode_kab' => $request->kode_kab ?? null,
            'kode_kec' => $request->kode_kec ?? null,
            'created_by' => $currentUser->id_user,
            'status' => 'active',
        ]);

        $user->load(['role', 'provinsi', 'kabupaten', 'kecamatan']);

        // Catat log CREATE admin bawahan
        $this->logCreate($request, 'User:AdminBawahan', $user->id_user, $user->toArray(), "Admin bawahan '{$user->name}' dengan role '{$role->name}' berhasil dibuat.");

        return response()->json([
            'message' => 'Admin bawahan berhasil dibuat',
            'data' => $user
        ], 201);
    }

    /**
     * POST /api/users/pj-grup
     * Create PJ Grup dengan validasi role dan wilayah
     */
    public function storePjGrup(Request $request)
    {
        $currentUser = $request->user();
        $role = Role::where('name', 'pj_grup')->first();

        // Validasi: apakah user ini boleh membuat pj_grup
        if (!in_array('pj_grup', $this->getAllowedRolesToCreate($currentUser))) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin membuat PJ Grup'
            ], 403);
        }

        // Validasi Request
        $validated = $request->validate(array_merge(
            $this->validateCommonFields(),
            ['kode_prov' => 'nullable|string|exists:provinsis,kode',
             'kode_kab' => 'nullable|string|exists:kabupatens,kode',
             'kode_kec' => 'nullable|string|exists:kecamatans,kode']
        ));

        // Validasi Wilayah
        if (!$this->validateWilayah($currentUser, $request)) {
            return response()->json([
                'message' => 'Wilayah PJ Grup tidak sesuai dengan kewenangan Anda'
            ], 403);
        }

        // Simpan foto
        $fotoPath = $this->saveFoto($request);

        // Create user
        $user = User::create([
            'id_user' => (string) Str::uuid(),
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id_role,
            'no_telp' => $validated['no_telp'] ?? null,
            'foto' => $fotoPath,
            'kode_prov' => $request->kode_prov ?? null,
            'kode_kab' => $request->kode_kab ?? null,
            'kode_kec' => $request->kode_kec ?? null,
            'created_by' => $currentUser->id_user,
            'status' => 'active',
        ]);

        $user->load(['role', 'provinsi', 'kabupaten', 'kecamatan']);

        // Catat log CREATE pj_grup
        $this->logCreate($request, 'User:PjGrup', $user->id_user, $user->toArray(), "PJ Grup '{$user->name}' berhasil dibuat.");

        return response()->json([
            'message' => 'PJ Grup berhasil dibuat',
            'data' => $user
        ], 201);
    }

    /**
     * ====================================
     * SHOW / UPDATE / DESTROY (SHARED)
     * ====================================
     */

    /**
     * GET /api/users/{role}/{id}
     * Get single user dengan check akses berdasarkan wilayah
     */
    public function show(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::with(['role', 'provinsi', 'kabupaten', 'kecamatan'])->find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Check apakah current user punya akses ke target user
        if (!$this->canAccessUser($currentUser, $targetUser)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke user ini'
            ], 403);
        }

        return response()->json([
            'message' => 'Data user berhasil diambil',
            'data' => $targetUser
        ]);
    }

    /**
     * PUT /api/users/{role}/{id}
     * Update user dengan check akses dan validasi wilayah
     */
    public function update(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Check akses
        if (!$this->canAccessUser($currentUser, $targetUser)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses untuk mengupdate user ini'
            ], 403);
        }

        // Validasi Request
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'username' => 'sometimes|string|max:100|unique:users,username,' . $id . ',id_user',
            'password' => 'sometimes|string|min:6',
            'role_id' => 'sometimes|string|exists:roles,id_role',
            'no_telp' => 'nullable|string|max:20',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'kode_prov' => 'nullable|string|exists:provinsis,kode',
            'kode_kab' => 'nullable|string|exists:kabupatens,kode',
            'kode_kec' => 'nullable|string|exists:kecamatans,kode',
            'status' => 'sometimes|enum:active,inactive',
        ]);

        // Jika update wilayah, validasi bahwa wilayah baru sesuai kewenangan
        if ($request->filled('kode_prov') || $request->filled('kode_kab') || $request->filled('kode_kec')) {
            if (!$this->validateWilayah($currentUser, $request)) {
                return response()->json([
                    'message' => 'Wilayah baru tidak sesuai dengan kewenangan Anda'
                ], 403);
            }
        }

        // Handle foto update
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada dan bukan temp file
            if ($targetUser->foto && !str_contains($targetUser->foto, 'Temp')) {
                try {
                    Storage::disk('public')->delete($targetUser->foto);
                } catch (\Exception $e) {
                    // File mungkin sudah terhapus atau path invalid, lanjutkan
                }
            }
            // Simpan foto baru
            $newFotoPath = $this->saveFoto($request);
            if ($newFotoPath) {
                $validated['foto'] = $newFotoPath; // PENTING: masukkan ke validated agar di-update ke database
            }
        }

        // Update fields (including foto jika ada)
        $dataLama = $targetUser->toArray();
        $targetUser->update($validated);
        $targetUser->load(['role', 'provinsi', 'kabupaten', 'kecamatan']);

        // Catat log UPDATE
        $this->logUpdate($request, 'User', $targetUser->id_user, $dataLama, $targetUser->toArray(), "User '{$targetUser->name}' berhasil diperbarui.");

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'data' => $targetUser
        ]);
    }

    /**
     * DELETE /api/users/{role}/{id}
     * Delete user dengan check akses
     */
    public function destroy(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Check akses
        if (!$this->canAccessUser($currentUser, $targetUser)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses untuk menghapus user ini'
            ], 403);
        }

        // Delete foto if exists dan bukan temp file
        if ($targetUser->foto && !str_contains($targetUser->foto, 'Temp')) {
            try {
                Storage::disk('public')->delete($targetUser->foto);
            } catch (\Exception $e) {
                // File mungkin sudah terhapus atau path invalid, tetap lanjutkan delete user
            }
        }

        $dataLama = $targetUser->toArray();
        $targetUser->delete();

        // Catat log DELETE
        $this->logDelete($request, 'User', $id, $dataLama, "User '{$dataLama['name']}' berhasil dihapus.");

        return response()->json([
            'message' => 'User berhasil dihapus',
            'data' => null
        ]);
    }
}
