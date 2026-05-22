<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AnggotaGrupDampingan;
use App\Models\GrupDampingan;
use App\Models\Kegiatan;
use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardAdminController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user || ! $user->role || ! in_array($user->role->name, ['superadmin', 'admin_provinsi', 'admin_kabupaten', 'admin_kecamatan'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Endpoint ini hanya untuk admin.',
            ], 403);
        }

        $groupIds = null;
        $groupScope = null;

        if ($user->role->name !== 'superadmin') {
            $groupScope = GrupDampingan::query();

            if ($user->kode_prov) {
                $groupScope->where('kode_prov', $user->kode_prov);
            }

            if (in_array($user->role->name, ['admin_kabupaten', 'admin_kecamatan'], true) && $user->kode_kab) {
                $groupScope->where('kode_kab', $user->kode_kab);
            }

            if ($user->role->name === 'admin_kecamatan' && $user->kode_kec) {
                $groupScope->where('kode_kec', $user->kode_kec);
            }

            $groupIds = $groupScope->pluck('id_grup_dampingan');
        }

        $totalAdminDaerah = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['admin_provinsi', 'admin_kabupaten', 'admin_kecamatan']);
        })
            ->when($user->role->name !== 'superadmin', function ($query) use ($user) {
                if ($user->kode_prov) {
                    $query->where('kode_prov', $user->kode_prov);
                }

                if (in_array($user->role->name, ['admin_kabupaten', 'admin_kecamatan'], true) && $user->kode_kab) {
                    $query->where('kode_kab', $user->kode_kab);
                }

                if ($user->role->name === 'admin_kecamatan' && $user->kode_kec) {
                    $query->where('kode_kec', $user->kode_kec);
                }
            })
            ->count();

        $totalFasilitator = User::whereHas('role', function ($query) {
            $query->where('name', 'fasilitator');
        })
            ->when($user->role->name !== 'superadmin', function ($query) use ($user) {
                if ($user->kode_prov) {
                    $query->where('kode_prov', $user->kode_prov);
                }

                if (in_array($user->role->name, ['admin_kabupaten', 'admin_kecamatan'], true) && $user->kode_kab) {
                    $query->where('kode_kab', $user->kode_kab);
                }

                if ($user->role->name === 'admin_kecamatan' && $user->kode_kec) {
                    $query->where('kode_kec', $user->kode_kec);
                }
            })
            ->count();

        $totalGrupDampingan = $groupScope ? $groupScope->count() : GrupDampingan::count();

        $totalDampingan = AnggotaGrupDampingan::query()
            ->when($groupIds, fn ($query) => $query->whereIn('grup_id', $groupIds))
            ->where('status', 'aktif')
            ->count();

        $statistikDampingan = AnggotaGrupDampingan::query()
            ->join('grup_dampingans', 'anggota_grup_dampingans.grup_id', '=', 'grup_dampingans.id_grup_dampingan')
            ->leftJoin('kabupatens', 'grup_dampingans.kode_kab', '=', 'kabupatens.kode')
            ->leftJoin('kecamatans', 'grup_dampingans.kode_kec', '=', 'kecamatans.kode')
            ->leftJoin('provinsis', 'grup_dampingans.kode_prov', '=', 'provinsis.kode')
            ->when($groupIds, fn ($query) => $query->whereIn('grup_dampingans.id_grup_dampingan', $groupIds))
            ->where('anggota_grup_dampingans.status', 'aktif')
            ->selectRaw("COALESCE(kabupatens.name, kecamatans.name, provinsis.name, 'Tidak diketahui') as wilayah")
            ->selectRaw('COUNT(*) as total')
            ->groupBy('wilayah')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => [
                'wilayah' => $item->wilayah,
                'total' => (int) $item->total,
            ]);

        $now = Carbon::now();
        $start = $now->copy()->startOfMonth()->subMonths(5);
        $end = $now->copy()->endOfMonth();

        $monthLabels = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        $monthlyTotals = Kegiatan::query()
            ->selectRaw("DATE_FORMAT(COALESCE(tanggal, created_at), '%Y-%m-01') as month_key")
            ->selectRaw('COUNT(DISTINCT id_kegiatan) as total')
            ->when($groupIds, fn ($query) => $query->whereHas('kegiatanGrups', function ($query) use ($groupIds) {
                $query->whereIn('grup_dampingan_id', $groupIds);
            }))
            ->whereBetween(DB::raw('COALESCE(tanggal, created_at)'), [$start->toDateString(), $end->toDateString()])
            ->groupBy('month_key')
            ->orderBy('month_key')
            ->get()
            ->keyBy('month_key');

        $kegiatanPerBulan = [];
        $cursor = $start->copy();
        while ($cursor <= $end) {
            $key = $cursor->format('Y-m-01');
            $total = (int) ($monthlyTotals[$key]->total ?? 0);
            $monthNumber = (int) $cursor->format('n');

            $kegiatanPerBulan[] = [
                'name' => $monthLabels[$monthNumber] ?? $cursor->format('M'),
                'kegiatan' => $total,
                'month' => $monthNumber,
                'year' => (int) $cursor->format('Y'),
            ];

            $cursor->addMonth();
        }

        $monthStart = $now->copy()->startOfMonth()->toDateString();
        $monthEnd = $now->copy()->endOfMonth()->toDateString();

        $totalKegiatanBulanIni = Kegiatan::query()
            ->when($groupIds, fn ($query) => $query->whereHas('kegiatanGrups', function ($query) use ($groupIds) {
                $query->whereIn('grup_dampingan_id', $groupIds);
            }))
            ->whereBetween(DB::raw('COALESCE(tanggal, created_at)'), [$monthStart, $monthEnd])
            ->distinct('id_kegiatan')
            ->count('id_kegiatan');

        $groupDistributionCounts = GrupDampingan::query()
            ->when($groupIds, fn ($query) => $query->whereIn('id_grup_dampingan', $groupIds))
            ->selectRaw('SUM(CASE WHEN kode_prov IS NULL AND kode_kab IS NULL AND kode_kec IS NULL THEN 1 ELSE 0 END) as pusat')
            ->selectRaw('SUM(CASE WHEN kode_prov IS NOT NULL AND kode_kab IS NULL AND kode_kec IS NULL THEN 1 ELSE 0 END) as provinsi')
            ->selectRaw('SUM(CASE WHEN kode_kab IS NOT NULL AND kode_kec IS NULL THEN 1 ELSE 0 END) as kabupaten')
            ->selectRaw('SUM(CASE WHEN kode_kec IS NOT NULL THEN 1 ELSE 0 END) as kecamatan')
            ->first();

        $grupDistribusi = [
            ['name' => 'Pusat', 'grup' => (int) ($groupDistributionCounts->pusat ?? 0)],
            ['name' => 'Provinsi', 'grup' => (int) ($groupDistributionCounts->provinsi ?? 0)],
            ['name' => 'Kabupaten', 'grup' => (int) ($groupDistributionCounts->kabupaten ?? 0)],
            ['name' => 'Kecamatan', 'grup' => (int) ($groupDistributionCounts->kecamatan ?? 0)],
        ];

        $logAktivitas = LogAktivitas::with([
                'user:id_user,name,role_id',
                'user.role:id_role,name',
            ])
            ->when($user->role->name !== 'superadmin', function ($query) use ($user) {
                if ($user->kode_prov) {
                    $query->where('kode_prov', $user->kode_prov);
                }

                if (in_array($user->role->name, ['admin_kabupaten', 'admin_kecamatan'], true) && $user->kode_kab) {
                    $query->where('kode_kab', $user->kode_kab);
                }

                if ($user->role->name === 'admin_kecamatan' && $user->kode_kec) {
                    $query->where('kode_kec', $user->kode_kec);
                }
            })
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'id_log' => $item->id_log,
                'aksi' => $item->aksi,
                'modul' => $item->modul,
                'deskripsi' => $item->deskripsi,
                'created_at' => $item->created_at,
                'user' => [
                    'id_user' => $item->user?->id_user,
                    'name' => $item->user?->name,
                    'role' => [
                        'name' => $item->user?->role?->name,
                    ],
                ],
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'totals' => [
                    'total_admin_daerah' => $totalAdminDaerah,
                    'total_fasilitator' => $totalFasilitator,
                    'total_dampingan' => $totalDampingan,
                    'total_grup_dampingan' => $totalGrupDampingan,
                    'total_kegiatan_bulan_ini' => $totalKegiatanBulanIni,
                ],
                'statistik_dampingan' => $statistikDampingan,
                'kegiatan_per_bulan' => $kegiatanPerBulan,
                'grup_distribusi' => $grupDistribusi,
                'log_aktivitas' => $logAktivitas,
                'period' => [
                    'current_month' => (int) $now->format('n'),
                    'current_year' => (int) $now->format('Y'),
                    'current_month_label' => $monthLabels[(int) $now->format('n')] ?? $now->format('M'),
                ],
            ],
        ]);
    }
}
