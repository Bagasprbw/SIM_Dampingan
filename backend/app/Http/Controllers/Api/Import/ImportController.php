<?php

namespace App\Http\Controllers\Api\Import;

use App\Http\Controllers\Controller;
use App\Http\Traits\LogsActivity;
use App\Models\AnggotaGrupDampingan;
use App\Models\Bidang;
use App\Models\FasilitatorBidang;
use App\Models\GrupDampingan;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Models\Pekerjaan;
use App\Models\Provinsi;
use App\Models\Role;
use App\Models\User;
use App\Services\NoAnggotaService;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    use LogsActivity;

    /**
     * Preview / Validasi data sebelum di-commit
     */
    public function preview(Request $request)
    {
        $user = $request->user();
        if (! $user || ($user->role->name ?? '') !== 'superadmin') {
            return response()->json(['message' => 'Akses ditolak. Fitur ini hanya untuk Superadmin.'], 403);
        }

        $type = $request->input('type');
        $rows = $request->input('rows', []);

        if (! is_array($rows) || empty($rows)) {
            return response()->json(['status' => 'error', 'message' => 'Data import kosong'], 400);
        }

        $valid = [];
        $invalid = [];

        switch ($type) {
            case 'admin':
                $this->previewAdmin($rows, $valid, $invalid);
                break;
            case 'fasilitator':
                $this->previewFasilitator($rows, $valid, $invalid);
                break;
            case 'grup':
                $this->previewGrup($rows, $valid, $invalid);
                break;
            case 'dampingan':
                $this->previewDampingan($rows, $valid, $invalid);
                break;
            default:
                return response()->json(['status' => 'error', 'message' => 'Tipe import tidak valid'], 400);
        }

        return response()->json([
            'status' => 'success',
            'type' => $type,
            'summary' => [
                'total' => count($rows),
                'valid_count' => count($valid),
                'invalid_count' => count($invalid),
            ],
            'valid' => $valid,
            'invalid' => $invalid,
        ]);
    }

    /**
     * Commit data valid ke Database
     */
    public function commit(Request $request)
    {
        $user = $request->user();
        if (! $user || ($user->role->name ?? '') !== 'superadmin') {
            return response()->json(['message' => 'Akses ditolak. Fitur ini hanya untuk Superadmin.'], 403);
        }

        $type = $request->input('type');
        $validRows = $request->input('valid_rows', []);

        if (empty($validRows)) {
            return response()->json(['status' => 'error', 'message' => 'Tidak ada data valid untuk diimport'], 400);
        }

        DB::beginTransaction();
        try {
            $count = 0;
            switch ($type) {
                case 'admin':
                    $count = $this->commitAdmin($validRows);
                    break;
                case 'fasilitator':
                    $count = $this->commitFasilitator($validRows);
                    break;
                case 'grup':
                    $count = $this->commitGrup($validRows);
                    break;
                case 'dampingan':
                    $count = $this->commitDampingan($validRows);
                    break;
            }

            DB::commit();

            // Log aktivitas
            $this->logCreate($request, 'ImportData', 'import-'.$type, [
                'type' => $type,
                'inserted_count' => $count,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => "Berhasil mengimport {$count} data {$type}",
                'inserted_count' => $count,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengimport data: '.$e->getMessage(),
            ], 500);
        }
    }

    // ==========================================
    // PRIVATE PREVIEW METHODS
    // ==========================================

    private function resolveWilayah($kodeOrName, $type)
    {
        if (empty($kodeOrName)) {
            return null;
        }
        $val = trim((string) $kodeOrName);

        if ($type === 'prov') {
            $res = Provinsi::where('kode', $val)->orWhere('name', 'like', "%{$val}%")->first();

            return $res?->kode;
        }
        if ($type === 'kab') {
            $res = Kabupaten::where('kode', $val)->orWhere('name', 'like', "%{$val}%")->first();

            return $res?->kode;
        }
        if ($type === 'kec') {
            $res = Kecamatan::where('kode', $val)->orWhere('name', 'like', "%{$val}%")->first();

            return $res?->kode;
        }

        return null;
    }

    private function previewAdmin(array $rows, &$valid, &$invalid)
    {
        $existingUsernames = User::pluck('username')->toArray();
        $batchUsernames = [];

        foreach ($rows as $index => $row) {
            $errors = [];
            $name = trim($row['name'] ?? $row['nama'] ?? $row['Nama Lengkap'] ?? '');
            $username = trim($row['username'] ?? $row['Username'] ?? '');
            $password = trim($row['password'] ?? $row['Password'] ?? '12345678');
            $noTelp = trim($row['no_telp'] ?? $row['No Telp'] ?? $row['Nomor Telepon'] ?? '');
            $roleName = trim($row['role'] ?? $row['Role'] ?? '');
            $prov = $this->resolveWilayah($row['kode_prov'] ?? $row['Provinsi'] ?? '', 'prov');
            $kab = $this->resolveWilayah($row['kode_kab'] ?? $row['Kabupaten'] ?? '', 'kab');
            $kec = $this->resolveWilayah($row['kode_kec'] ?? $row['Kecamatan'] ?? '', 'kec');

            if (empty($name)) {
                $errors[] = 'Nama wajib diisi';
            }
            if (empty($username)) {
                $errors[] = 'Username wajib diisi';
            } elseif (in_array($username, $existingUsernames) || in_array($username, $batchUsernames)) {
                $errors[] = "Username '{$username}' sudah terpakai";
            }

            $validRoles = ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'];
            if (! in_array($roleName, $validRoles)) {
                $errors[] = "Role '{$roleName}' tidak valid (pilihan: admin_provinsi, admin_kabupaten, admin_kecamatan)";
            }

            if (! empty($errors)) {
                $invalid[] = array_merge($row, ['_row' => $index + 2, '_errors' => $errors]);
            } else {
                $batchUsernames[] = $username;
                $valid[] = [
                    '_row' => $index + 2,
                    'name' => $name,
                    'username' => $username,
                    'password' => $password,
                    'no_telp' => $noTelp,
                    'role_name' => $roleName,
                    'kode_prov' => $prov,
                    'kode_kab' => $kab,
                    'kode_kec' => $kec,
                ];
            }
        }
    }

    private function previewFasilitator(array $rows, &$valid, &$invalid)
    {
        $existingUsernames = User::pluck('username')->toArray();
        $batchUsernames = [];

        foreach ($rows as $index => $row) {
            $errors = [];
            $name = trim($row['name'] ?? $row['nama'] ?? $row['Nama Lengkap'] ?? '');
            $username = trim($row['username'] ?? $row['Username'] ?? '');
            $password = trim($row['password'] ?? $row['Password'] ?? '12345678');
            $noTelp = trim($row['no_telp'] ?? $row['No Telp'] ?? '');
            $prov = $this->resolveWilayah($row['kode_prov'] ?? $row['Provinsi'] ?? '', 'prov');
            $kab = $this->resolveWilayah($row['kode_kab'] ?? $row['Kabupaten'] ?? '', 'kab');
            $kec = $this->resolveWilayah($row['kode_kec'] ?? $row['Kecamatan'] ?? '', 'kec');

            $bidangStr = trim($row['bidang_names'] ?? $row['Bidang Dampingan'] ?? $row['bidang'] ?? '');
            $bidangIds = [];
            if (! empty($bidangStr)) {
                $bidangList = array_map('trim', explode(',', $bidangStr));
                foreach ($bidangList as $bName) {
                    $bObj = Bidang::where('name', 'like', "%{$bName}%")->first();
                    if ($bObj) {
                        $bidangIds[] = $bObj->id_bidang;
                    } else {
                        $errors[] = "Bidang '{$bName}' tidak ditemukan";
                    }
                }
            }

            if (empty($name)) {
                $errors[] = 'Nama wajib diisi';
            }
            if (empty($username)) {
                $errors[] = 'Username wajib diisi';
            } elseif (in_array($username, $existingUsernames) || in_array($username, $batchUsernames)) {
                $errors[] = "Username '{$username}' sudah terpakai";
            }

            if (! empty($errors)) {
                $invalid[] = array_merge($row, ['_row' => $index + 2, '_errors' => $errors]);
            } else {
                $batchUsernames[] = $username;
                $valid[] = [
                    '_row' => $index + 2,
                    'name' => $name,
                    'username' => $username,
                    'password' => $password,
                    'no_telp' => $noTelp,
                    'kode_prov' => $prov,
                    'kode_kab' => $kab,
                    'kode_kec' => $kec,
                    'bidang_ids' => array_unique($bidangIds),
                    'bidang_names' => $bidangStr,
                ];
            }
        }
    }

    private function previewGrup(array $rows, &$valid, &$invalid)
    {
        $existingUsernames = User::pluck('username')->toArray();
        $batchUsernames = [];

        foreach ($rows as $index => $row) {
            $errors = [];
            $namaGrup = trim($row['nama_grup'] ?? $row['Nama Grup'] ?? $row['name'] ?? '');
            $prov = $this->resolveWilayah($row['kode_prov'] ?? $row['Provinsi'] ?? '', 'prov');
            $kab = $this->resolveWilayah($row['kode_kab'] ?? $row['Kabupaten'] ?? '', 'kab');
            $kec = $this->resolveWilayah($row['kode_kec'] ?? $row['Kecamatan'] ?? '', 'kec');

            $level = 'pusat';
            if (! empty($kec)) {
                $level = 'kecamatan';
            } elseif (! empty($kab)) {
                $level = 'kabupaten';
            } elseif (! empty($prov)) {
                $level = 'provinsi';
            }

            $bidangStr = trim($row['bidang_names'] ?? $row['Bidang Dampingan'] ?? '');
            $bidangIds = [];
            if (! empty($bidangStr)) {
                $bidangList = array_map('trim', explode(',', $bidangStr));
                foreach ($bidangList as $bName) {
                    $bObj = Bidang::where('name', 'like', "%{$bName}%")->first();
                    if ($bObj) {
                        $bidangIds[] = $bObj->id_bidang;
                    } else {
                        $errors[] = "Bidang '{$bName}' tidak ditemukan";
                    }
                }
            }

            // PJ info
            $namaPj = trim($row['nama_pj'] ?? $row['Nama PJ'] ?? '');
            $usernamePj = trim($row['username_pj'] ?? $row['Username PJ'] ?? '');
            $passwordPj = trim($row['password_pj'] ?? $row['Password PJ'] ?? '12345678');
            $noTelpPj = trim($row['no_telp_pj'] ?? $row['No Telp PJ'] ?? '');

            if (empty($namaGrup)) {
                $errors[] = 'Nama Grup wajib diisi';
            }

            if (! empty($usernamePj)) {
                if (in_array($usernamePj, $existingUsernames) || in_array($usernamePj, $batchUsernames)) {
                    $errors[] = "Username PJ '{$usernamePj}' sudah terpakai";
                }
            }

            if (! empty($errors)) {
                $invalid[] = array_merge($row, ['_row' => $index + 2, '_errors' => $errors]);
            } else {
                if (! empty($usernamePj)) {
                    $batchUsernames[] = $usernamePj;
                }
                $valid[] = [
                    '_row' => $index + 2,
                    'nama_grup' => $namaGrup,
                    'kode_prov' => $prov,
                    'kode_kab' => $kab,
                    'kode_kec' => $kec,
                    'level_dampingan' => $level,
                    'bidang_ids' => array_unique($bidangIds),
                    'bidang_names' => $bidangStr,
                    'nama_pj' => $namaPj,
                    'username_pj' => $usernamePj,
                    'password_pj' => $passwordPj,
                    'no_telp_pj' => $noTelpPj,
                ];
            }
        }
    }

    private function previewDampingan(array $rows, &$valid, &$invalid)
    {
        foreach ($rows as $index => $row) {
            $errors = [];
            $sheetName = trim($row['_sheet'] ?? $row['Sheet'] ?? '');
            $grupName = trim($row['grup_name'] ?? $row['Nama Grup'] ?? $sheetName);

            $grup = GrupDampingan::where('name', 'like', "%{$grupName}%")->first();
            if (! $grup) {
                $errors[] = "Grup '{$grupName}' tidak ditemukan di database";
            }

            $name = trim($row['name'] ?? $row['nama'] ?? $row['Nama Lengkap'] ?? '');
            $bidangName = trim($row['bidang'] ?? $row['Bidang Dampingan'] ?? '');

            $bidangObj = null;
            if (! empty($bidangName)) {
                $bidangObj = Bidang::where('name', 'like', "%{$bidangName}%")->first();
                if (! $bidangObj) {
                    $errors[] = "Bidang '{$bidangName}' tidak ditemukan";
                }
            } elseif ($grup) {
                $bidangObj = $grup->bidangs()->first();
            }

            $jk = strtoupper(trim($row['jenis_kelamin'] ?? $row['Jenis Kelamin'] ?? 'L'));
            if ($jk === 'LAKI-LAKI' || $jk === 'PRAPUAN' || $jk === 'LAKI') {
                $jk = 'L';
            }
            if ($jk === 'PEREMPUAN' || $jk === 'WANITA' || $jk === 'P') {
                $jk = 'P';
            }
            if (! in_array($jk, ['L', 'P'])) {
                $jk = 'L';
            }

            $pekerjaanName = trim($row['pekerjaan'] ?? $row['Pekerjaan'] ?? '');
            $pekerjaanObj = null;
            if (! empty($pekerjaanName)) {
                $pekerjaanObj = Pekerjaan::where('name', 'like', "%{$pekerjaanName}%")->first();
            }

            if (empty($name)) {
                $errors[] = 'Nama Anggota wajib diisi';
            }

            if (! empty($errors)) {
                $invalid[] = array_merge($row, ['_row' => $index + 2, '_sheet' => $sheetName, '_errors' => $errors]);
            } else {
                $valid[] = [
                    '_row' => $index + 2,
                    '_sheet' => $sheetName,
                    'name' => $name,
                    'grup_id' => $grup?->id_grup_dampingan,
                    'grup_name' => $grup?->name,
                    'bidang_id' => $bidangObj?->id_bidang,
                    'bidang_name' => $bidangObj?->name,
                    'jenis_kelamin' => $jk,
                    'tempat_lahir' => trim($row['tempat_lahir'] ?? $row['Tempat Lahir'] ?? ''),
                    'tgl_lahir' => trim($row['tgl_lahir'] ?? $row['Tanggal Lahir'] ?? ''),
                    'agama' => trim($row['agama'] ?? $row['Agama'] ?? 'Islam'),
                    'alamat' => trim($row['alamat'] ?? $row['Alamat'] ?? ''),
                    'no_telp' => trim($row['no_telp'] ?? $row['No Telp'] ?? ''),
                    'pekerjaan_id' => $pekerjaanObj?->id_pekerjaan,
                ];
            }
        }
    }

    // ==========================================
    // PRIVATE COMMIT METHODS
    // ==========================================

    private function commitAdmin(array $rows): int
    {
        $count = 0;
        foreach ($rows as $row) {
            $role = Role::where('name', $row['role_name'])->first();
            if (! $role) {
                continue;
            }

            User::create([
                'id_user' => (string) Str::uuid(),
                'name' => $row['name'],
                'username' => $row['username'],
                'password' => Hash::make($row['password'] ?? '12345678'),
                'no_telp' => $row['no_telp'] ?? null,
                'role_id' => $role->id_role,
                'kode_prov' => $row['kode_prov'] ?? null,
                'kode_kab' => $row['kode_kab'] ?? null,
                'kode_kec' => $row['kode_kec'] ?? null,
                'status' => 'active',
                'created_at' => now(),
            ]);
            $count++;
        }

        return $count;
    }

    private function commitFasilitator(array $rows): int
    {
        $count = 0;
        $role = Role::where('name', 'fasilitator')->first();
        if (! $role) {
            return 0;
        }

        foreach ($rows as $row) {
            $user = User::create([
                'id_user' => (string) Str::uuid(),
                'name' => $row['name'],
                'username' => $row['username'],
                'password' => Hash::make($row['password'] ?? '12345678'),
                'no_telp' => $row['no_telp'] ?? null,
                'role_id' => $role->id_role,
                'kode_prov' => $row['kode_prov'] ?? null,
                'kode_kab' => $row['kode_kab'] ?? null,
                'kode_kec' => $row['kode_kec'] ?? null,
                'status' => 'active',
                'created_at' => now(),
            ]);

            if (! empty($row['bidang_ids'])) {
                foreach ($row['bidang_ids'] as $bidangId) {
                    FasilitatorBidang::create([
                        'id_fasilitator_bidang' => (string) Str::uuid(),
                        'user_id' => $user->id_user,
                        'bidang_id' => $bidangId,
                        'created_at' => now(),
                    ]);
                }
            }
            $count++;
        }

        return $count;
    }

    private function commitGrup(array $rows): int
    {
        $count = 0;
        $pjRole = Role::where('name', 'pj_grup')->first();

        foreach ($rows as $row) {
            $pjUser = null;
            if (! empty($row['username_pj'])) {
                $pjUser = User::create([
                    'id_user' => (string) Str::uuid(),
                    'name' => $row['nama_pj'] ?: $row['nama_grup'].' PJ',
                    'username' => $row['username_pj'],
                    'password' => Hash::make($row['password_pj'] ?? '12345678'),
                    'no_telp' => $row['no_telp_pj'] ?? null,
                    'role_id' => $pjRole?->id_role,
                    'kode_prov' => $row['kode_prov'] ?? null,
                    'kode_kab' => $row['kode_kab'] ?? null,
                    'kode_kec' => $row['kode_kec'] ?? null,
                    'status' => 'active',
                    'created_at' => now(),
                ]);
            }

            $grup = GrupDampingan::create([
                'id_grup_dampingan' => (string) Str::uuid(),
                'name' => $row['nama_grup'],
                'pengurus_id' => $pjUser?->id_user,
                'level_dampingan' => $row['level_dampingan'] ?? 'kabupaten',
                'kode_prov' => $row['kode_prov'] ?? null,
                'kode_kab' => $row['kode_kab'] ?? null,
                'kode_kec' => $row['kode_kec'] ?? null,
                'created_at' => now(),
            ]);

            if (! empty($row['bidang_ids'])) {
                $grup->bidangs()->sync($row['bidang_ids']);
            }

            $count++;
        }

        return $count;
    }

    private function commitDampingan(array $rows): int
    {
        $count = 0;
        $noAnggotaService = app(NoAnggotaService::class);
        $qrCodeService = app(QrCodeService::class);

        foreach ($rows as $row) {
            // Generates no_anggota automatically
            $noAnggota = $noAnggotaService->generate($row['grup_id']);

            $tglLahir = null;
            if (! empty($row['tgl_lahir'])) {
                try {
                    $tglLahir = date('Y-m-d', strtotime($row['tgl_lahir']));
                } catch (\Exception $e) {
                }
            }

            $anggota = AnggotaGrupDampingan::create([
                'id_anggota_grup' => (string) Str::uuid(),
                'name' => $row['name'],
                'no_anggota' => $noAnggota,
                'grup_id' => $row['grup_id'],
                'bidang_id' => $row['bidang_id'],
                'jenis_kelamin' => $row['jenis_kelamin'] ?? 'L',
                'tempat_lahir' => $row['tempat_lahir'] ?? null,
                'tgl_lahir' => $tglLahir,
                'agama' => $row['agama'] ?? 'Islam',
                'alamat' => $row['alamat'] ?? null,
                'no_telp' => $row['no_telp'] ?? null,
                'pekerjaan_id' => $row['pekerjaan_id'] ?? null,
                'status' => 'aktif',
                'created_at' => now(),
            ]);

            // Generate QR code
            try {
                $qrCodeService->generateForAnggota($anggota);
            } catch (\Exception $e) {
            }

            $count++;
        }

        return $count;
    }
}
