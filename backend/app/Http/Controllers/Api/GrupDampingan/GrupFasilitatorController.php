<?php

namespace App\Http\Controllers\Api\GrupDampingan;

use App\Http\Controllers\Controller;
use App\Models\GrupDampingan;
use App\Models\GrupFasilitator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrupFasilitatorController extends Controller
{
    /**
     * ====================================
     * HELPER METHODS
     * ====================================
     */

    /**
     * Cek apakah current user bisa mengakses grup dampingan
     */
    private function canAccessGrup(User $currentUser, GrupDampingan $grupDampingan): bool
    {
        if ($currentUser->role->name === 'superadmin') {
            return true;
        }

        if ($currentUser->role->name === 'admin_provinsi') {
            return $grupDampingan->kode_prov === $currentUser->kode_prov;
        }

        if ($currentUser->role->name === 'admin_kabupaten') {
            return $grupDampingan->kode_kab === $currentUser->kode_kab;
        }

        if ($currentUser->role->name === 'admin_kecamatan') {
            return $grupDampingan->kode_kec === $currentUser->kode_kec;
        }

        if ($currentUser->role->name === 'pj_grup') {
            return $grupDampingan->pengurus_id === $currentUser->id_user;
        }

        return false;
    }

    /**
     * Cek apakah user2 ada di wilayah yang sama dengan current user
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

    /**
     * ====================================
     * INDEX METHOD
     * ====================================
     */

    /**
     * GET /api/grup-dampingan/{grupId}/fasilitator
     * List fasilitator dari grup dampingan tertentu
     */
    public function index(Request $request, $grupId)
    {
        $grupDampingan = GrupDampingan::find($grupId);

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

        $fasilitators = $grupDampingan->grupFasilitators()
            ->with('fasilitator')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($gf) {
                return [
                    'id_grup_fasilitator' => $gf->id_grup_fasilitator,
                    'grup_dampingan_id' => $gf->grup_dampingan_id,
                    'fasilitator' => $gf->fasilitator,
                    'created_at' => $gf->created_at
                ];
            });

        return response()->json([
            'message' => 'Data fasilitator grup berhasil diambil',
            'data' => $fasilitators
        ]);
    }

    /**
     * ====================================
     * ATTACH METHOD (Add fasilitator)
     * ====================================
     */

    /**
     * POST /api/grup-dampingan/{grupId}/fasilitator
     * Tambahkan fasilitator ke grup dampingan
     */
    public function store(Request $request, $grupId)
    {
        $grupDampingan = GrupDampingan::find($grupId);

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

        // Validasi request
        $validated = $request->validate([
            'fasilitator_ids' => 'required|array',
            'fasilitator_ids.*' => 'string|exists:users,id_user',
        ]);

        $addedFasilitators = [];
        $duplicateFasilitators = [];
        $invalidFasilitators = [];

        foreach (array_unique($validated['fasilitator_ids']) as $fasilitatorId) {
            // Cek apakah fasilitator sudah ada
            if (GrupFasilitator::where('grup_dampingan_id', $grupId)
                ->where('fasilitator_id', $fasilitatorId)
                ->exists()) {
                $duplicateFasilitators[] = $fasilitatorId;
                continue;
            }

            // Validasi bahwa ini adalah fasilitator
            $fasilitator = User::find($fasilitatorId);
            if (!$fasilitator || $fasilitator->role->name !== 'fasilitator') {
                $invalidFasilitators[] = $fasilitatorId;
                continue;
            }

            // Validasi bahwa fasilitator ada di wilayah yang sama
            if (!$this->canAccessUser($currentUser, $fasilitator)) {
                $invalidFasilitators[] = $fasilitatorId;
                continue;
            }

            // Create GrupFasilitator
            $grupFasilitator = GrupFasilitator::create([
                'id_grup_fasilitator' => (string) Str::uuid(),
                'grup_dampingan_id' => $grupId,
                'fasilitator_id' => $fasilitatorId,
                'created_at' => now(),
            ]);

            $grupFasilitator->load('fasilitator');
            $addedFasilitators[] = $grupFasilitator;
        }

        $message = 'Fasilitator berhasil ditambahkan';
        $statusCode = 201;

        $responseData = [
            'message' => $message,
            'data' => $addedFasilitators,
        ];

        // Tambahkan info tentang duplikat atau invalid jika ada
        if (!empty($duplicateFasilitators) || !empty($invalidFasilitators)) {
            $responseData['warnings'] = [];
            if (!empty($duplicateFasilitators)) {
                $responseData['warnings']['duplicates'] = $duplicateFasilitators;
            }
            if (!empty($invalidFasilitators)) {
                $responseData['warnings']['invalid'] = $invalidFasilitators;
            }
        }

        return response()->json($responseData, $statusCode);
    }

    /**
     * ====================================
     * DETACH METHOD (Remove fasilitator)
     * ====================================
     */

    /**
     * DELETE /api/grup-dampingan/{grupId}/fasilitator/{fasilitatorId}
     * Hapus fasilitator dari grup dampingan
     */
    public function destroy(Request $request, $grupId, $fasilitatorId)
    {
        $grupDampingan = GrupDampingan::find($grupId);

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

        // Cari GrupFasilitator
        $grupFasilitator = GrupFasilitator::where('grup_dampingan_id', $grupId)
            ->where('fasilitator_id', $fasilitatorId)
            ->first();

        if (!$grupFasilitator) {
            return response()->json([
                'message' => 'Fasilitator tidak ditemukan di grup ini'
            ], 404);
        }

        $grupFasilitator->delete();

        return response()->json([
            'message' => 'Fasilitator berhasil dihapus dari grup'
        ]);
    }

    /**
     * ====================================
     * BULK UPDATE METHOD
     * ====================================
     */

    /**
     * PUT /api/grup-dampingan/{grupId}/fasilitator
     * Perbarui daftar fasilitator (replace semua fasilitator dengan yang baru)
     */
    public function updateBulk(Request $request, $grupId)
    {
        $grupDampingan = GrupDampingan::find($grupId);

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

        // Validasi request
        $validated = $request->validate([
            'fasilitator_ids' => 'nullable|array',
            'fasilitator_ids.*' => 'string|exists:users,id_user',
        ]);

        // Hapus semua fasilitator lama
        GrupFasilitator::where('grup_dampingan_id', $grupId)->delete();

        $newFasilitators = [];

        // Tambahkan fasilitator baru
        if ($request->filled('fasilitator_ids')) {
            foreach (array_unique($validated['fasilitator_ids']) as $fasilitatorId) {
                // Validasi bahwa ini adalah fasilitator
                $fasilitator = User::find($fasilitatorId);
                if (!$fasilitator || $fasilitator->role->name !== 'fasilitator') {
                    continue;
                }

                // Validasi bahwa fasilitator ada di wilayah yang sama
                if (!$this->canAccessUser($currentUser, $fasilitator)) {
                    continue;
                }

                // Create GrupFasilitator
                $grupFasilitator = GrupFasilitator::create([
                    'id_grup_fasilitator' => (string) Str::uuid(),
                    'grup_dampingan_id' => $grupId,
                    'fasilitator_id' => $fasilitatorId,
                    'created_at' => now(),
                ]);

                $grupFasilitator->load('fasilitator');
                $newFasilitators[] = $grupFasilitator;
            }
        }

        return response()->json([
            'message' => 'Fasilitator grup berhasil diperbarui',
            'data' => $newFasilitators
        ]);
    }
}
