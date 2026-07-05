<?php

namespace Database\Seeders\SampelData;

use App\Models\AnggotaGrupDampingan;
use App\Services\NoAnggotaService;
use App\Services\QrCodeService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DataDampinganSeeder extends Seeder
{
    public function run(): void
    {
        $pekerjaans = DB::table('pekerjaans')->pluck('id_pekerjaan', 'name');

        $mapPekerjaan = function ($name) use ($pekerjaans) {
            $lower = strtolower(trim($name));
            $map = [
                'buruh' => 'Lainnya',
                'irt' => 'Lainnya',
                'pemulung' => 'Lainnya',
                'petani' => 'Petani',
                'petani kebun' => 'Petani',
                'wiraswasta' => 'Wirausaha',
                'wirausaha' => 'Wirausaha',
                'pelajar/mahasiswa' => 'Pelajar/Mahasiswa',
                'pedagang' => 'Pedagang',
                'buruh tani' => 'Buruh Tani',
                'buruh tani/perkebunan' => 'Buruh Tani',
                'karyawan' => 'Karyawan Swasta',
                'swasta' => 'Karyawan Swasta',
                'buruh harian lepas' => 'Lainnya',
                'buruh harian/irt' => 'Lainnya',
                'tukang jahit' => 'Lainnya',
                'penjahit' => 'Lainnya',
                'peternak' => 'Peternak',
                'pns' => 'PNS',
                'ibu rumah tangga' => 'Lainnya',
                'reparasi kursi' => 'Lainnya',
                'tukang pijat' => 'Lainnya',
                'perangkat desa' => 'Lainnya',
                'pegawai kontrak' => 'Lainnya',
                'perawat' => 'Lainnya',
                'pensiunan' => 'Lainnya',
                'tani' => 'Petani',
                'tani buruh penggarap' => 'Buruh Tani',
                'honorer' => 'Lainnya',
                'guru' => 'Guru/Dosen',
                'karyawan swasta' => 'Karyawan Swasta',
            ];
            if ($lower === '') {
                return null;
            }

            $mapped = $map[$lower] ?? 'Lainnya';

            return $pekerjaans[$mapped] ?? null;
        };

        $parseDate = function ($date) {
            if (empty(trim($date))) {
                return null;
            }
            $date = trim($date);

            $months = [
                'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
                'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
                'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12,
            ];

            if (preg_match('/^(\d{1,2})\s+(.+?)\s+(\d{4})$/i', $date, $m)) {
                $d = (int) $m[1];
                $monthName = strtolower($m[2]);
                $y = (int) $m[3];
                $mon = $months[$monthName] ?? null;
                if ($mon) {
                    return sprintf('%04d-%02d-%02d', $y, $mon, $d);
                }
            }

            $parts = preg_split('#[/-]#', $date);
            if (count($parts) === 3) {
                $d = (int) $parts[0];
                $m = (int) $parts[1];
                $y = (int) $parts[2];
                if ($y < 100) {
                    $y += 2000;
                }
                if ($y < 1900) {
                    $y += 1000;
                }

                return sprintf('%04d-%02d-%02d', $y, $m, $d);
            }

            return null;
        };

        $mapGender = function ($g) {
            $lower = strtolower(trim($g));
            if ($lower === 'l') {
                return 'L';
            }
            if ($lower === 'p') {
                return 'P';
            }

            return $lower === 'laki-laki' || $lower === 'laki - laki' ? 'L' : 'P';
        };

        $this->seedMardiko($mapPekerjaan, $parseDate, $mapGender);
        $this->seedKokap($mapPekerjaan, $parseDate, $mapGender);
        $this->seedJATAMDifabel($mapPekerjaan, $parseDate, $mapGender);
        $this->seedJATAMMinggir($mapPekerjaan, $parseDate, $mapGender);
        $this->seedNgoroNgoro($mapPekerjaan, $parseDate, $mapGender);
        $this->seedGading($mapPekerjaan, $parseDate, $mapGender);
        $this->seedBankDifabel($mapPekerjaan, $parseDate, $mapGender);
        $this->seedAsongan($mapPekerjaan, $parseDate, $mapGender);
        $this->seedGERKATINSleman($mapPekerjaan, $parseDate, $mapGender);
        $this->seedJALAMU($mapPekerjaan, $parseDate, $mapGender);
    }

    private function seedMardiko(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'Mardiko')->first();
        if (! $grup) {
            $this->command->error('Grup Mardiko tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Pemulung%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Pemulung tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Sotirah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1949', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suyanti (B)', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '13/10/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suyanti (A)', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '06/01/1988', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Indah Safitri', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '21/12/2001', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Rini Zumawati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '13/05/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bendo, Ngablak, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Susi Susanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '16/08/1994', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suratman', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '20/05/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Nia Afriyati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '29/01/1998', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Giman', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '26/05/1978', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sarinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '18/07/1959', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Anik Nursangadah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/02/1987', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Musri', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '25/07/1950', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Mujiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '27/12/1974', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Tartiani', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '27/05/1993', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Rohmiyati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '09/08/1989', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Walji Utomo/Waljono', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '23/11/1965', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Muji Rihartini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/12/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Nasti Ari Setiani', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '09/11/1996', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Ngatiran', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/12/1968', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suminah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '11/04/1974', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sriyanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '03/11/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Jumiran', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '04/11/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mendhit, Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suraji', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '01/11/1981', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mendhit, Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sunardi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/12/1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mendhit, Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Siti Utami', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '01/01/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mendhit, Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Tugiran', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '16/05/1978', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Kartini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '09/11/1983', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Mendhit, Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sumadi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '06/09/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Siti Aisah', 'tempat_lahir' => 'Lampung', 'tgl_lahir' => '09/08/1983', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Giyanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '02/08/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Kedung Walikukun, Banyakan II RT. 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Pardiyono', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '24/06/1965', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Demangan, Jambidan, Banguntapan, Bantul', 'no_telp' => ''],
            ['name' => 'Mujiyono', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '19/03/1978', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Yatmini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '17/08/1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mendit RT 05, Ngablak, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sokirah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '17/04/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Herni Miyanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/01/1998', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pelajar/Mahasiswa', 'alamat' => 'Ngablak RT 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sumiyati', 'tempat_lahir' => 'Magelang', 'tgl_lahir' => '18/03/1976', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Gunadi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1959', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mojosari RT. 05, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Rubnah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1958', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Mojosari RT. 05, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Andika Sriyanto', 'tempat_lahir' => 'Klaten', 'tgl_lahir' => '28/05/1995', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Waginem/Sarto', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '21/05/1939', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Ngablak RT. 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sartini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1965', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Ayis Sunoto', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '02/05/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suparjo', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '13/01/1959', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sutamti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1980', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Lasiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1962', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Paijem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '17/07/1962', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Anik', 'tempat_lahir' => 'Magelang', 'tgl_lahir' => '22/12/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Mila Arisandi Jumilah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/06/1980', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Martinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '11/03/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Pulepayung, Srimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Yani Isnawati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '03/05/1984', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sakinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1969', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentulrejo, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sarwati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '07/06/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Jambon RT 04, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sri Haryatun', 'tempat_lahir' => 'Klaten', 'tgl_lahir' => '29/11/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Gurinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1955', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Iksanudin', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '18/07/1979', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Wahyuni', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '20/10/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Anis Styaningsih', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '17/12/2000', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Tomi Wahyu Pradana', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '27/05/1989', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Erwindi Astuti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '11/07/1985', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Wagiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/11/1954', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Salam, RT.03, Temuwuh, Dlingo, Bantul', 'no_telp' => ''],
            ['name' => 'Pitoyo', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '05/01/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Pulepayung, Srimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Marsiyah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/05/1980', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngentak, Poncosari, Srandakan, Bantul', 'no_telp' => ''],
            ['name' => 'Sukiyem', 'tempat_lahir' => 'Bandung', 'tgl_lahir' => '16/05/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani', 'alamat' => 'Ngablak, Rt. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Parliyan', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '12/06/1970', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Depok, RT.002, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Yoni', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '12/06/1964', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Depok, RT.002, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Temon', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1972', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Depok, RT.003, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sukinah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1967', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Depok, RT.003, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Tukinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/02/1965', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.005, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sugiyanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '12/07/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Demangan, RT.007, Jambidan, Banguntapan, Bantul', 'no_telp' => ''],
            ['name' => 'Jumiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '28/08/1974', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Ngegong, RT.06, Kaligatuk, Srimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sulastri', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/08/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Surodinanggan, RT.007, Jambidan, Banguntapan, Bantul', 'no_telp' => ''],
            ['name' => 'Parjiyah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '04/08/1974', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Dengkeng, RT.01, Wukirsari, Imogiri, Bantul', 'no_telp' => ''],
            ['name' => 'Isti Nurjanah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/07/1988', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Depok, RT.001 Wonolelo,, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Surami', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/12/1949', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Fitriyah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '05/10/1967', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Cegokan RT. 01, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Ngatini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '25/05/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT 05, Sitimulyo, Bantul', 'no_telp' => ''],
            ['name' => 'Mutinah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '08/02/1980', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Depok RT. 01, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Narijo', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '05/07/1972', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan', 'alamat' => 'Ngablak RT 03, Stimiulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sutilah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '01/03/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Depok RT 01, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Asmawi', 'tempat_lahir' => 'Trenggalek', 'tgl_lahir' => '12/09/1972', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngegong RT 06, Kaligatuk, Srimulyo, Bantul', 'no_telp' => ''],
            ['name' => 'Sogiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1970', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Trayeman RT. 03, Pleret, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Siti Fatimah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1969', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I RT 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Tarini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '18/11/1957', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Wiwik Istiyanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '16/05/1979', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentulrejo RT 02, Bawuran, Pleret Bantul', 'no_telp' => ''],
            ['name' => 'Rozin', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '25/01/1983', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Turainem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '12/06/1967', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Ngatmi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/06/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Trukan RT 05, Segoroyoso, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Zumaidah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '23/08/1982', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Genting Sari RT 05, Banyakan II, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Kardi Wiyono', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '20/08/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Banyakan III RT 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Ngatinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '20/10/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Banyakan III RT 04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Paniem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '21/05/1969', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Isti Khuiriyah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '14/04/1992', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sokinah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '25/10/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Erno Susanti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '05/05/1992', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentulrejo RT 02, Bawuran, Pleret Bantul', 'no_telp' => ''],
            ['name' => 'Daliyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/10/1965', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Depok RT 01, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Gining', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1967', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani', 'alamat' => 'Bawuran I, RT 006, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sarmi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '04/04/1985', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Miskinem', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '01/07/1964', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Karangkulon RT 06, Wukirsari, Imogiri, Bantul', 'no_telp' => ''],
            ['name' => 'Samto Giyono', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1951', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Maryono', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '17/08/1967', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Trayeman RT. 03, Pleret, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Umi Asih', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '24/08/1987', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, Rt. 03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Erma Romayani', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '26/03/1991', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I RT 06,  Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sariti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '18/02/1990', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I RT 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Yatinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani', 'alamat' => 'Bawuran I, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Wasinem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1953', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Bawuran I RT 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Esti Raniatunningsih', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '05/08/1984', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I RT 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Yuminiyati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '26/01/1974', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Tukang Jahit', 'alamat' => 'Depok, RT.001 Wonolelo,, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Pavina Linda Winarni', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/06/1988', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Bawuran I RT. 06, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Parijo/Pakin', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '18/03/1974', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentul Rejo RT. 04, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Suryadi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '13/12/1983', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentul Rejo RT. 04, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sarni', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1965', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentul Rejo RT. 03, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Wagilah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '19/07/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentul Rejo RT. 03, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Tujiah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1961', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Kedungpring, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Ratmi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1954', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I RT. 06, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Giyarti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '23/08/1983', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Nglengkong, Bawuran I RT. 06, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Juminem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1945', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.03, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sutamti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '21/11/1993', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Sentulrejo, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Wakiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Sentulrejo, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Ngatinah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1956', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani/Perkebunan', 'alamat' => 'Sentulrejo, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Jumirah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1964', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani/Perkebunan', 'alamat' => 'Sentulrejo, RT.002, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Winarti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/10/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh harian/IRT', 'alamat' => 'Sentulrejo, RT.002, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sartini', 'tempat_lahir' => '', 'tgl_lahir' => '', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Sentulrejo, RT.002, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Rubiyah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '25/06/1962', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Sentulrejo, RT.002, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Slamet/Amir Sutoyo', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Sentulrejo, RT.002, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Slamet/Uji Utomo', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1996', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani/Perkebunan', 'alamat' => 'Sentulrejo, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Jumiyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '30/10/1970', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Sentulrejo, RT.002, Bawuran, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sulastinah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/07/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Depok, RT.001 Wonolelo,, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sogiran', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Pairin', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '16/07/1972', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Poniyem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1961', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Ponijan', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '07/06/1979', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Buwang', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '27/12/1970', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Giyarti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Paiman', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '07/09/1971', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suratini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '18/02/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak, RT.04, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Romedah', 'tempat_lahir' => 'Klaten', 'tgl_lahir' => '17/12/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Gliyangan, RT. 03, Wonolelo, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Wagiyah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1969', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Kedungpring, RT 02, Bawuran, Pleret Bantul', 'no_telp' => ''],
            ['name' => 'Lanjar', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '19/12/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Kedungpring, RT 02, Bawuran, Pleret Bantul', 'no_telp' => ''],
            ['name' => 'Ngatirah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '16/04/1985', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Depok, RT.001 Wonolelo,, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Sugiyarti', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '15/06/1984', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Depok, RT.001 Wonolelo,, Pleret, Bantul', 'no_telp' => ''],
            ['name' => 'Paijem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '06/08/1949', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Banyakan III RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sumarmi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '04/09/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Banyakan III RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Suharyanto', 'tempat_lahir' => 'Kulonprogo', 'tgl_lahir' => '30/04/1986', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Ngablak RT. 05, Sitimulyo, Piyungan, Bantul', 'no_telp' => ''],
            ['name' => 'Sri Sumarwati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '04/08/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pedagang', 'alamat' => 'Onggopatran RT. 01, Kebonagung, Imogiri, Bantul', 'no_telp' => ''],
            ['name' => 'Sairoh', 'tempat_lahir' => 'Brebes', 'tgl_lahir' => '16/07/1970', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Sentulrejo RT. 04, Bawuran, PLeret, Bantul', 'no_telp' => ''],
            ['name' => 'Martini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '01/03/1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemulung', 'alamat' => 'Salam, RT.03,Temuwuh, Dlingo, Bantul', 'no_telp' => ''],
            ['name' => 'Soginem', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '31/12/1945', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Bawuran I, RT 006, Bawuran, Pleret, Bantul', 'no_telp' => ''],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'Mardiko');
    }

    private function seedKokap(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'Kokap')->first();
        if (! $grup) {
            $this->command->error('Grup Kokap tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%UMKM%')->first();
        if (! $bidang) {
            $this->command->error('Bidang UMKM tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Paniyem', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '17/04/1965', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Mursiyamti', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '27/08/1976', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Tri Hastuti', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '10/06/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Teguh Mulyani', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '16/07/1988', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Tegiri I RT. 56 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Ngatilah', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '12/04/1981', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Tegiri I RT. 56 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Saminten', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '12/03/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Sawinem', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '06/05/1945', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Susanti', 'tempat_lahir' => 'Palembang', 'tgl_lahir' => '22/11/1979', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'IRT', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Turbingah', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '18/09/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Ngatijem', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '22/12/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 56 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Sugiyanti', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '15/11/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 56 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Samsilah', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '06/10/1958', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Mahmud Jazali', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '15/01/1974', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Sri Lestari', 'tempat_lahir' => 'Grobogan', 'tgl_lahir' => '09/08/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Tegiri I RT. 57 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
            ['name' => 'Ngatimin', 'tempat_lahir' => '', 'tgl_lahir' => '', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Tegiri I RT. 56 RW. 21, Hargowilis, Kokap, Kulon Progo', 'no_telp' => ''],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'Kokap');
    }

    private function seedJATAMDifabel(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'JATAM Difabel')->first();
        if (! $grup) {
            $this->command->error('Grup JATAM Difabel tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Peternak%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Peternak tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Didik Anugrah Estiaji', 'tempat_lahir' => 'Bekasi', 'tgl_lahir' => '02 Mei 2000', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'peternak', 'alamat' => 'Ganjuran 01/06 Widodomartani Ngemplak Sleman', 'no_telp' => ''],
            ['name' => 'Sismartanto', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '07-03-1976', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh harian lepas', 'alamat' => 'Putat, rt44/rw07 bleberan, playen, gunung kidul', 'no_telp' => ''],
            ['name' => 'Bambang Suyanto', 'tempat_lahir' => 'Surabaya', 'tgl_lahir' => '25-02-1961', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wirausaha', 'alamat' => 'Pundung RT 06/32 tirtomartani Kalasan Sleman', 'no_telp' => ''],
            ['name' => 'Eko Suwito', 'tempat_lahir' => 'Kudus', 'tgl_lahir' => '11-04-1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'buruh harian lepas', 'alamat' => 'Keceme rt/rw. 05/47', 'no_telp' => ''],
            ['name' => 'Purnama', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '30 Juni 1976', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'wiraswasta', 'alamat' => 'Garongan Rt 01/18 Wonokerto, Turi, Sleman, DIY', 'no_telp' => ''],
            ['name' => 'Suparji', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '13 April 1970', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'barepan VII rt5/16, Sumberrahayu, Moyudan, Sleman DIY', 'no_telp' => ''],
            ['name' => 'Muh Nasir', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '11 Maret 1961', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Selobonggo Bangunkerto Turi Sleman', 'no_telp' => ''],
            ['name' => 'Mardiyono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '09-12-1968', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Klenggukan RT/RW 03/31 Tirtomartani Kalasan Sleman.', 'no_telp' => ''],
            ['name' => 'Sugeng riyadi', 'tempat_lahir' => 'Klaten', 'tgl_lahir' => '15-02-1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Reparasi kursi', 'alamat' => 'sermo sumberarum moyudan', 'no_telp' => ''],
            ['name' => 'Saiful sigit margono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '27-04-1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani kebun', 'alamat' => 'Karang tanjung, Bejen, rt 003/rw042', 'no_telp' => ''],
            ['name' => 'Prio suprapto', 'tempat_lahir' => 'Curup', 'tgl_lahir' => '30-12-1972', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pedagang', 'alamat' => 'Pojokan Bejen, rt 004/rw042', 'no_telp' => ''],
            ['name' => 'Marjiyo', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '14-08-1965', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'wiraswasta', 'alamat' => 'Ganjuran, rt01/rw02', 'no_telp' => ''],
            ['name' => 'Ali afandi', 'tempat_lahir' => 'Bandung', 'tgl_lahir' => '30-07-1982', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'wiraswasta', 'alamat' => 'Gedongkuning,no 24A, rt007/rw002 rejowinangun, kotagede', 'no_telp' => ''],
            ['name' => 'Ujang kamaludin', 'tempat_lahir' => 'Bandung', 'tgl_lahir' => '07-04-1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'PNS', 'alamat' => 'Bejen, rt03/rw43 caturharjo sleman', 'no_telp' => ''],
            ['name' => 'Waluyo', 'tempat_lahir' => 'Kebumen', 'tgl_lahir' => '06-08-1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'wiraswasta', 'alamat' => 'Candi III, rt06/rw07 Sardonoharjo, ngaglik Sleman', 'no_telp' => ''],
            ['name' => 'Ngadino', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '06-07-1976', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'tukang pijat', 'alamat' => 'Kliwang,rt04/rw08, Argo mulyo, cangkringan, Sleman', 'no_telp' => ''],
            ['name' => 'Uri suherman', 'tempat_lahir' => 'Ciamis', 'tgl_lahir' => '23-01-1958', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Jl Tabung no 6B, pojok tiyasan, rt 02/rw01 condong catur sleman', 'no_telp' => ''],
            ['name' => 'Akhmad soleh', 'tempat_lahir' => 'Kudus', 'tgl_lahir' => '16-07-1965', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'PNS', 'alamat' => 'jL pendowo no 4, Plakaran kidul, Banguntapan Bantul', 'no_telp' => ''],
            ['name' => 'Endang dwi lestari putriningsih', 'tempat_lahir' => 'Sukoharjo', 'tgl_lahir' => '', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Penjahit', 'alamat' => 'Barepan VII rt 5/16, Sumberrahayu, Moyudan Sleman DIY', 'no_telp' => ''],
            ['name' => 'Sri asmawati', 'tempat_lahir' => 'Bengkulu', 'tgl_lahir' => '28-10-1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah tangga', 'alamat' => 'Pundung RT 06/32 Tirtomartani kalasan Sleman', 'no_telp' => ''],
            ['name' => 'Muryati', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '28 Februari 1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Penjahit', 'alamat' => 'Gejagan rt03/12.sumberarum.moyudan.sleman', 'no_telp' => ''],
            ['name' => 'Karsini', 'tempat_lahir' => 'Kebumen', 'tgl_lahir' => '11-06-1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Candi III rt06/rw07 Sardonoharjo Ngaglik Sleman', 'no_telp' => ''],
            ['name' => 'Ari titik handayani', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '25-05-1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu Rumah tangga', 'alamat' => 'Bejen, rt 03/rw 43', 'no_telp' => ''],
            ['name' => 'Sudaryanti', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '09-09-1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu Rumah tangga', 'alamat' => 'Keceme, rt05/rw47 caturharjo, Sleman', 'no_telp' => ''],
            ['name' => 'Supriyati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '01-12-1970', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu Rumah tangga', 'alamat' => 'Priyan,Dk Priyan, Rt 002/000, tri renggo, bantul', 'no_telp' => ''],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'JATAM Difabel');
    }

    private function seedJATAMMinggir(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'JATAM Minggir')->first();
        if (! $grup) {
            $this->command->error('Grup JATAM Minggir tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Petani%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Petani tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Ashadi Hermanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/10/1980', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Klodran RT/RW 01/13 Sendangarum, Minggir', 'no_telp' => ''],
            ['name' => 'Bagas Kuncoro', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta (Ternak)', 'alamat' => 'Sendangmulyo, Minggir', 'no_telp' => ''],
            ['name' => 'Basyori', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '02/03/1974', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nalan Plembun RT/RW 06/13 Sendangsari, Minggir', 'no_telp' => ''],
            ['name' => 'Dwi Sumartono', 'tempat_lahir' => 'Banjarmasin', 'tgl_lahir' => '10/10/1969', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Jetis Depok RT/RW 01/03 Sendangsari, Minggir', 'no_telp' => ''],
            ['name' => 'Eko Triyanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'PNS', 'alamat' => 'Nanggulan, Sendangagung, Minggir', 'no_telp' => ''],
            ['name' => 'Galih Untoro', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '06/05/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pegawai Kontrak', 'alamat' => 'Sunten, Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'H. Nurudin Mahmud, M.T.', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/01/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan', 'alamat' => 'Perum. Griya Delima 1 Kav. 4 Jl. Warungsilah, Ciganjur, Jagakarsa', 'no_telp' => ''],
            ['name' => 'Hardiman', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '22/09/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Jogorejo RT/RW 01/05 Sendangsari, Minggir', 'no_telp' => ''],
            ['name' => 'Muh. Sugiman', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '10/10/1946', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Jogorejo RT/RW 04/06 Sendangsari, Minggir', 'no_telp' => ''],
            ['name' => 'Muhammad Sugianto', 'tempat_lahir' => 'Simalungun', 'tgl_lahir' => '10/02/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan Swasta', 'alamat' => 'Bekelan X RT/RW 02/22 Sendangagung, Minggir', 'no_telp' => ''],
            ['name' => 'Murjono Tri Atmojo', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '24/10/1975', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Perawat', 'alamat' => 'Botokan, Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'Mustamhadi, S.S., M.Pd.', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '20/12/1959', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pensiunan', 'alamat' => 'Nglengking, Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'Samija', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '08/11/1964', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan Swasta', 'alamat' => 'Kebitan RT/RW 03/20 Sendangarum, Minggir', 'no_telp' => ''],
            ['name' => 'Sudijo', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '15/06/1957', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Tani', 'alamat' => 'Tobayan, Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'Suhardi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '09/12/1954', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Pensiunan', 'alamat' => 'Pakeran RT/RW 01/13 Sendangmulyo, Minggir', 'no_telp' => ''],
            ['name' => 'Suharta', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/07/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Plaosan, Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'Sumarsono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/05/1954', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Tani Buruh Penggarap', 'alamat' => 'Ngepringan II Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'Sunu Tri Widada', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '06/04/1973', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Perangkat Desa', 'alamat' => 'Plembon Cilik, Sendangsari, Minggir', 'no_telp' => ''],
            ['name' => 'Sutiyono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/05/1976', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Honorer', 'alamat' => 'Plembon RT/RW 03/12 Sendangsari, Minggir', 'no_telp' => ''],
            ['name' => 'Walgito Muhsin', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '22/01/1964', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Tani', 'alamat' => 'Jarakan RT/RW 06/26 Sendangrejo, Minggir', 'no_telp' => ''],
            ['name' => 'Wihadi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '26/02/1982', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan Swasta', 'alamat' => '', 'no_telp' => ''],
            ['name' => 'Zahrowi, S.Ag.', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '28/02/1965', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Guru', 'alamat' => 'Parakan Kulon RT/RW 03/01 Sendangsari, Minggir', 'no_telp' => ''],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'JATAM Minggir');
    }

    private function seedNgoroNgoro(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'Ngoro - Ngoro')->first();
        if (! $grup) {
            $this->command->error('Grup Ngoro - Ngoro tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%UMKM%')->first();
        if (! $bidang) {
            $this->command->error('Bidang UMKM tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Baryati', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '24/04/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Tawang RT 04 RW 01 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Eli Suheli', 'tempat_lahir' => 'Purwakarta', 'tgl_lahir' => '05/07/1984', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Salaran RT 21 RW 06 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Ita Nurnamasari', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '06/04/1988', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'perangkat desa', 'alamat' => 'Salaran RT 21 RW 06 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Jumirah', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '04/01/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'Jatikuning 38/11 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Jumiyati', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '05/07/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Jatikuning 39/11 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Ngadinem', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '07/05/1964', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Kledung RT 14 RW 04 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Nihar Astuti', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '28/02/1992', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Sepat RT 07 RW 02 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Novilia Bintari', 'tempat_lahir' => 'Jakarta', 'tgl_lahir' => '22/11/1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'Salaran RT 23 RW 06 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Rokhayatun', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '03/02/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Senggotan RT 26 RW 07 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Rubinem', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '01/01/1964', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'soka', 'no_telp' => ''],
            ['name' => 'Rukmini', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '15/08/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Sepat RT 07 RW 02 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Rusiyem', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '18/10/1980', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Tawang RT 02 RW 01 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Sati Nur Utami', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '15/03/1967', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Gembyong RT 10 RW 03 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Siti Rahayu', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '05/10/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'Salaran RT 24 RW 06 ngoro-oro, Patuk, Gunungkidul', 'no_telp' => ''],
            ['name' => 'Sri Mursilah', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '08/12/1974', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Gembyong RT 11 RW 03 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Sri Widada', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '19/06/1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'Salaran RT 22 RW 06 Ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Sugiyem', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'Sepat Rt 07 RW 02 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Sumarni', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '08/12/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'soka 33/09 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Sumirahayu', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '10/10/1959', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Sumiyati', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '15/02/1969', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => '', 'no_telp' => ''],
            ['name' => 'Suratmiran', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '15/06/1959', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'Salaran RT 24 RW 06 ngoro-oro, Patuk, Gunungkidul', 'no_telp' => ''],
            ['name' => 'Sutiyah', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '04/07/1964', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'ibu rumah tangga', 'alamat' => 'Salaran RT 22 RW 06 Ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Wagiyem', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '16/05/1965', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'petani', 'alamat' => 'soka 33/09 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Widayati', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '21/09/1970', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Jatikuning 39/11 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Widayatun', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '11/10/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Salaran RT 21 RW 06 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
            ['name' => 'Yuni Isnaini', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '08/06/1994', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Sepat Rt 08 RW 02 ngoro-oro, patuk, gunungkidul', 'no_telp' => ''],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'Ngoro - Ngoro');
    }

    private function seedGading(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'Gading')->first();
        if (! $grup) {
            $this->command->error('Grup Gading tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Difabel%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Difabel tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Andri Saputra', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '17/04/2004', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Jitengan Rt 003/028, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Aprilria Vidya Qasanah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '28/04/2005', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Jambon Rt 2, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Baryadi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '28/05/1966', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Biru Rt 6/31, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Bayu Prasetyo', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '16/05/1997', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'jln penitia dimandakan 38 rt 33/9, pandayan membrukhanyo', 'no_telp' => ''],
            ['name' => 'Bekti Dessy Pandiastuti', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '20/12/1989', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Pasekan rt 006/ rw 004, balecatur, gamping', 'no_telp' => ''],
            ['name' => 'Danis Mayanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '21/07/2004', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Gamol Rt 1/15, balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Deri Raahmansari', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '27/04/1998', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Nyemplung Kidul Rt 004/006, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Dwi Wulaningsih', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/04/1998', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Keditan salakan, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Erpan Subagyo', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '06/05/1977', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Beji, Sidoarum, Godean', 'no_telp' => ''],
            ['name' => 'Farida Wahyuningsih', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/12/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Delingsari, Ambarketawang, Gamping', 'no_telp' => ''],
            ['name' => 'Fendy Norapandya Rafi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '07/11/2002', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Plawonan, argomulyo, Sedayu', 'no_telp' => ''],
            ['name' => 'Fiola Cahyaning Faudziah', 'tempat_lahir' => 'Jakarta', 'tgl_lahir' => '01/05/1995', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Perum Jati sawit 04 Rt 011/ Rw 050, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Gamas Adi Prasetyo', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '23/06/2000', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Margoyasan PA II, Gunung Kastur, Pakualaman', 'no_telp' => ''],
            ['name' => 'Hamizan Farell Wicaksono', 'tempat_lahir' => 'Purbalingga', 'tgl_lahir' => '23/10/2007', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Dukuh Rt 5/8, Banyuraden, Gamping', 'no_telp' => ''],
            ['name' => 'Handy Sanjaya', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '28/03/1980', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'karang anom 1 rt 003/ 004, ngawis karang mojo', 'no_telp' => ''],
            ['name' => 'Hariz Maulana', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/03/2011', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Modinan, BAnyuraden, Gamping', 'no_telp' => ''],
            ['name' => 'Hasan Abdul Aziz', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '08/02/2010', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'bodoh rt 06/ 025, ambarketawang, gamping', 'no_telp' => ''],
            ['name' => 'Hassna Afifah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '26/03/2007', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Basole Rt 7/34, Panggung Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Husein Abdul Aziz', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '08/02/2010', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'bodoh rt 06/ 025, ambarketawang, gamping', 'no_telp' => ''],
            ['name' => 'IKha Noor Rizky', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '17/11/2000', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Tegalyoso, Banyuraden, Gamping', 'no_telp' => ''],
            ['name' => 'Isna Sudistyawati', 'tempat_lahir' => 'Gunungkidul', 'tgl_lahir' => '13/09/1978', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'karang anom 1 rt 003/ 004, ngawis karang mojo', 'no_telp' => ''],
            ['name' => 'Jatria Luna Salwa', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '25/05/2002', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Perum jati sawit asri blok J1-2, Rt 007/ rw 050, Balecatur Gamping', 'no_telp' => ''],
            ['name' => 'Jifan Wrijamanko', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '07/05/1997', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'bodoh, 008/ 026, ambarketawang, gamping', 'no_telp' => ''],
            ['name' => 'Lusianan Rizky Saputr', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '27/03/2008', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Mujing Wetan, Ambarketawang, Gamping', 'no_telp' => ''],
            ['name' => 'Mellynda Octavia Anjani', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '11/10/2003', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Turusan, Banyuraden, Gamping', 'no_telp' => ''],
            ['name' => 'Meyya Eka Rustiasari', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '07/05/2004', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Bedog Rt 4/25, Trihanggo Gamping', 'no_telp' => ''],
            ['name' => 'Muhammad Eka Ramadhan', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '06/09/2010', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Bantulan Sidoarum, Godean', 'no_telp' => ''],
            ['name' => 'Muhammad LAtif Harya Yudhono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '20/02/2009', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Tegalyoso, Dukuh, Banyuraden', 'no_telp' => ''],
            ['name' => 'Neny Christiyanti', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '09/01/1979', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Gamping Kidul, Ambarketawang, Gamping', 'no_telp' => ''],
            ['name' => 'Nunsahit', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'pasekan kidul rt 005/ 002, balecatur, gamping', 'no_telp' => ''],
            ['name' => 'Parjiyem', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '11/02/1976', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Bedog, Trihanggoo, Gamping', 'no_telp' => ''],
            ['name' => 'Praditya Pandega Damansah', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '07/07/1993', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'jln sawit rt 11/ Rw 5, Bale caatur, Gamping', 'no_telp' => ''],
            ['name' => 'Prapti Handayani', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '21/02/1979', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Nyamplung, gamping', 'no_telp' => ''],
            ['name' => 'Prihatin', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '09/02/1964', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Guyangan, Nogotirto, Gamping', 'no_telp' => ''],
            ['name' => 'R Febry Ferdananto', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '01/02/1986', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Bedog rt 3/24, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Radiman', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '25/09/1973', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Ngawen Rt 3/11, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Raif Adiansyah Oktaf', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Peneng kembang rt 005/ 02, balecatur, gamping', 'no_telp' => ''],
            ['name' => 'Robbi Pahim', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '13/05/2008', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'singojayan rt 006/001, pakuwon wirobrajan', 'no_telp' => ''],
            ['name' => 'Satyadaru Muhti Prabawa', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '06/07/1997', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Perum Jati mass permai jati sawit Rt 010 Rw 040, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Setyaningsih', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '12/08/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Karang tengah, Nogotirto, Gamping', 'no_telp' => ''],
            ['name' => 'soleh agus purnomo', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '30/07/1997', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'jatisawit rt 003/026, balecatur gamping', 'no_telp' => ''],
            ['name' => 'Sri Ayam', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '15/05/1962', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Mejing Kidul, Ambarketawang', 'no_telp' => ''],
            ['name' => 'Sri Rahayu', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '15/06/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Jambon, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Sudirno', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '16/11/1982', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Kluwih Rt 002/ Rw 010, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Sugeng Widodo', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '08/08/1979', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Sumba rt 004/ 009, balecatur gamping', 'no_telp' => ''],
            ['name' => 'Sunani', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '11/11/1982', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Sumba rt 004/ 009, balecatur gamping', 'no_telp' => ''],
            ['name' => 'Suradiman', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '26/06/1962', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Nyemplung Kidul Rt 4/16, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Surip', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '27/06/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Pereng Kembang, BAlecatur, Gambping', 'no_telp' => ''],
            ['name' => 'Surpriyanto', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '14/12/1973', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Gamping Kidul rt 1/17, Ambarketawang, Gamping', 'no_telp' => ''],
            ['name' => 'Syifa Nur arrafah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '30/03/2010', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Kronggatian 1, Trihanggo, Gamping', 'no_telp' => ''],
            ['name' => 'Trimaryani', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '05/05/1989', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Kluwih Rt 002/ Rw 010, Balecatur Gamping', 'no_telp' => ''],
            ['name' => 'Tugiro', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '11/11/1972', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Depok,Ambarketawang, Gamping', 'no_telp' => ''],
            ['name' => 'Wahid Nur Sunandiyanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Temuwuh Kidul rt 002/031, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Wildan Aiulia Rizqi Ramadhan', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '18/02/1995', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Perum Griya Gejawan Indah blok B, Balecatur, Gamping', 'no_telp' => ''],
            ['name' => 'Yuliana', 'tempat_lahir' => 'Ketapang', 'tgl_lahir' => '04/07/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Salakan Rt 3/26. Trihanggo, Gamping', 'no_telp' => ''],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'Gading');
    }

    private function seedBankDifabel(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'Bank Difabel')->first();
        if (! $grup) {
            $this->command->error('Grup Bank Difabel tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Difabel%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Difabel tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Adnan', 'tempat_lahir' => '', 'tgl_lahir' => '10/04/1961', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Wirausaha', 'alamat' => 'Sono Rt 4Rw 61, Sinduadi Mlati'],
            ['name' => 'Amir', 'tempat_lahir' => 'Cilacap', 'tgl_lahir' => '05/04/1985', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Kariawan', 'alamat' => 'Nganggrung Rt 002/Rw 030, Sukoharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Andika Indra S', 'tempat_lahir' => 'Boyolali', 'tgl_lahir' => '05/10/1987', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Wirausaha', 'alamat' => 'Kongklangon Rt 04 Rw 05, Tawangsari Teras, Boyolali'],
            ['name' => 'Anik Maryani S.Sos', 'tempat_lahir' => 'Sragen', 'tgl_lahir' => '20/11/1979', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Dagang', 'alamat' => 'Gayam Rt 001/ Rw 041, Argomulyo, Cangkringan, Sleman'],
            ['name' => 'Arifin Risman', 'tempat_lahir' => 'Purbalingga', 'tgl_lahir' => '07/03/1979', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Craft dompet kulit ikan pari', 'alamat' => 'Losari RT002/010, Sukoharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Arum Suryo Pujilestari', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '04/06/1983', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Penjahit', 'alamat' => 'Gondanglegi Rt 03/ Rw 013, Sariharjo, Ngaglik, Sleman'],
            ['name' => 'Atik Sunarti', 'tempat_lahir' => '', 'tgl_lahir' => '02/02/1984', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pemjahit', 'alamat' => 'Nganggrung Rt 002 Rw 030, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Bonni', 'tempat_lahir' => '', 'tgl_lahir' => '30/08/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Bakulan', 'alamat' => 'Mrican 66, Buntu 2/5 Rt 07/03 Caturtunggal, Depok,Sleman'],
            ['name' => 'Ditem', 'tempat_lahir' => 'Cilacap', 'tgl_lahir' => '25/03/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Candi 3, RT 001/005, Sardonoharjo, Ngaglik, Sleman Yk'],
            ['name' => 'Dody Kurniawan Kaliri', 'tempat_lahir' => '', 'tgl_lahir' => '05/10/1974', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Mlati Dukuh, Sendansasi, Sleman'],
            ['name' => 'Dwiono Arifiyanto', 'tempat_lahir' => 'Banjarnegara', 'tgl_lahir' => '17/01/1976', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Rakit Rt/Rw 003/001, Banjar Negara'],
            ['name' => 'Dyah Hartati', 'tempat_lahir' => '', 'tgl_lahir' => '10/03/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Ternak Ikan', 'alamat' => 'Nepen 001/015, Candibinangun, Pakem, Sleman'],
            ['name' => 'Ebit Riyanto', 'tempat_lahir' => '', 'tgl_lahir' => '16/01/1982', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Menjahit', 'alamat' => 'Pasar jetis Rt02/43, Wedomartani Ngemplak, Sleman'],
            ['name' => 'Endang Sundayani', 'tempat_lahir' => '', 'tgl_lahir' => '08/09/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Craft', 'alamat' => 'Ngangkruk Sardonoharjo, Ngaglik, Sleman'],
            ['name' => 'Erna Mujiwati/ Sugeng Priyono', 'tempat_lahir' => '', 'tgl_lahir' => '27/04/1978', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Jualan Online', 'alamat' => 'Tanjung Sri Rt 002 Rw 005, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Esah/Nisa', 'tempat_lahir' => '', 'tgl_lahir' => '06/04/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Ngangkrung rt 002 rw 030, Sukoharjo, Ngaglik,Sleman'],
            ['name' => 'Hepi Nafisah', 'tempat_lahir' => '', 'tgl_lahir' => '01/07/2007', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Candi Winangun Rt 03/ Rw 12'],
            ['name' => 'Hestina Fatmasari', 'tempat_lahir' => '', 'tgl_lahir' => '', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Gordyn', 'alamat' => 'Segoroyoso II rt 4, Pleret, Bantul'],
            ['name' => 'Irvana Nesti', 'tempat_lahir' => '', 'tgl_lahir' => '31/08/1989', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Jualan cemilan anak-anak', 'alamat' => 'Gempolan Rt 01/ Rw 01, Tri renggo, Bantul'],
            ['name' => 'Ismuwasis', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '14/08/1968', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Perikanan', 'alamat' => 'Candi 3 Rt 01/05, Sardonoharjo, Nganglik, Sleman'],
            ['name' => 'Isnandar', 'tempat_lahir' => 'Pati', 'tgl_lahir' => '15/01/1966', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Laundry', 'alamat' => 'Besi Rt 03/ Rw 031, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Iswanto', 'tempat_lahir' => 'Kebumen', 'tgl_lahir' => '29/05/1972', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Menjahit', 'alamat' => 'Tonggalan 003/15, Wedomartani Ngeplak, Sleman, Yk'],
            ['name' => 'Joko Purwanto', 'tempat_lahir' => 'Sragen', 'tgl_lahir' => '13/04/1989', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Gedonganlor Rt 03 Rw 02 Wedomartani, Ngamplak, Sleman'],
            ['name' => 'Jumar/ Hendrik Sholikin', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '05/02/1992', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Warung kelontong', 'alamat' => 'Nganggrung Rt 02/30, Sukoharjo, Nganglik, Sleman, Yk'],
            ['name' => 'Kristini', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '30/11/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pedagang kaki lima', 'alamat' => 'Balong Rt 02/Rw 01, Donoharjo, Ngaglik, Sleman'],
            ['name' => 'Kuni Fatonah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '25/05/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Bantarjo, Donoharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Kurniati Khasanah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '21/02/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Rejodani 01, RT/RW 04-04, Sariharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Lina Susanti', 'tempat_lahir' => 'Banyuwangi', 'tgl_lahir' => '28/12/1972', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Kariawan Swasta', 'alamat' => 'Pogung lor Rt 011 Rw 48 Sinduadi Mlati, Sleman'],
            ['name' => 'Lusia Rubiyati', 'tempat_lahir' => '', 'tgl_lahir' => '10/11/1959', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Warung kelontong', 'alamat' => 'Kayunan, Donoharjo, Ngaglik, Sleman'],
            ['name' => 'Mahfud Anwar/ Yanti', 'tempat_lahir' => '', 'tgl_lahir' => '16/05/1986', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Online shop', 'alamat' => 'Njangrung Rt 02/30, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Mintarsih', 'tempat_lahir' => '', 'tgl_lahir' => '10/06/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Penjahit', 'alamat' => 'Gaten Rt 05 Rw 28, Condong Catur Depok, Sleman'],
            ['name' => 'Misnah', 'tempat_lahir' => '', 'tgl_lahir' => '06/01/1967', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Warung kelontong', 'alamat' => 'Besi rt 4 rw 031., Sukiharjo, Ngaglik, Sleman'],
            ['name' => 'Nabila /Siyati', 'tempat_lahir' => '', 'tgl_lahir' => '28/10/2005', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Warung kelontong', 'alamat' => 'Donolayan Rt 02 Rw 21, Donoharjo, Ngaglik, Sleman, YK'],
            ['name' => 'Nur Iswanti', 'tempat_lahir' => '', 'tgl_lahir' => '25/05/1982', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Kamdanen Rt 02/Rw 07, Sariharjo, Ngaglik, Sleman'],
            ['name' => 'Purwono Adi', 'tempat_lahir' => 'Magelang', 'tgl_lahir' => '30/09/1980', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Pengrajin dompet, tas', 'alamat' => 'Besi Blok B33A Rt 004/031, Sukoharjo,Nganglik, Sleman'],
            ['name' => 'Rendy Andiska', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/06/1989', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Kariawan Swasta', 'alamat' => 'Ngabean kulon rt 05 rw 035, sindoharjo, ngaglik, sleman'],
            ['name' => 'Rohman', 'tempat_lahir' => '', 'tgl_lahir' => '12/07/1981', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Pengrajin kulit', 'alamat' => 'Candi dukuh Rt 03/ Rw 03, Sardonoharjo, Ngaglik, Sleman'],
            ['name' => 'Rosmiyati', 'tempat_lahir' => '', 'tgl_lahir' => '12/10/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Menjahit', 'alamat' => 'Jalapan Rt 001/015, Margodadi Seyegan, Sleman'],
            ['name' => 'S. Marheni', 'tempat_lahir' => '', 'tgl_lahir' => '06/02/1966', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Jl. Tabung No.6B Rt 02/01, Pojok tiasan, Condongcatur, Depok, Sleman'],
            ['name' => 'Sajimin', 'tempat_lahir' => 'Lampung', 'tgl_lahir' => '06/06/1976', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Swasta (service elektronik)', 'alamat' => 'Rejodani 01, Sariharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Sakir', 'tempat_lahir' => 'Kulonprogo', 'tgl_lahir' => '28/09/1967', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Besi rt 4/ rw 3, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Santoso', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '24/07/1984', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Menjahit', 'alamat' => 'Griya Perwita Besi Sukoharjo, Nganglik, Sleman'],
            ['name' => 'Sih Endarwati', 'tempat_lahir' => '', 'tgl_lahir' => '11/08/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Penem Donoharjo, Ngaglik, Sleman'],
            ['name' => 'Siti Daryati/ Nur Rohman. M', 'tempat_lahir' => '', 'tgl_lahir' => '10/02/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pengrajin kulit', 'alamat' => 'Candi III rt 6 rw 06 Sardonoharjo, Ngaglik, Sleman'],
            ['name' => 'Siti Nine R', 'tempat_lahir' => '', 'tgl_lahir' => '21/09/1976', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Gang Gabus 7, No.30 Rt 23/ Rw 05 Minomartani, Ngaglik, Sleman'],
            ['name' => 'Slamet Maryanto', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '04/11/1987', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh harian lepas', 'alamat' => 'Mutihan 004 Srimartani Piyungan, Bantul'],
            ['name' => 'Sri Widodo', 'tempat_lahir' => '', 'tgl_lahir' => '29/09/1959', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Menjahit', 'alamat' => 'Bantarjo, Rt 02/27, Donoharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Sri Wijayanti', 'tempat_lahir' => 'Pati', 'tgl_lahir' => '25/09/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Jasa', 'alamat' => 'Dukuh 1 rt 013 rw 05 demen temon kulonprogo'],
            ['name' => 'Subandi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '03/03/1953', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Wonoselo Rt 06/02, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Subarsono', 'tempat_lahir' => '', 'tgl_lahir' => '18/08/1952', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Serabutan', 'alamat' => 'Jl. Mujair Rt 06 Rw 02, Minomartani, Ngaglik, Sleman'],
            ['name' => 'Subasya', 'tempat_lahir' => '', 'tgl_lahir' => '26/08/1968', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh harian lepas', 'alamat' => 'Bantarjo, Rt 01/27, Donoharjo, Ngaglik, Sleman'],
            ['name' => 'Sudarmi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '15/01/1975', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Warung kelontong', 'alamat' => 'Losari sukoharjo, Ngaglik,Sleman'],
            ['name' => 'Sudartatik', 'tempat_lahir' => '', 'tgl_lahir' => '05/11/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Pelem Rt 05 Rw 24, Harjobinangun, Pakem, Sleman'],
            ['name' => 'Sugeng Prasetyo', 'tempat_lahir' => '', 'tgl_lahir' => '08/06/1968', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Servis Elekro', 'alamat' => 'Bandulon rt 4 rw18, Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Sujadi', 'tempat_lahir' => '', 'tgl_lahir' => '12/08/1972', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Bandulan Sukoharjo, Ngaglik, Sleman'],
            ['name' => 'Sunarto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '21/06/1973', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Angkringan', 'alamat' => 'Klidon, rt 4/rw 34, Sukoharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Suwandi', 'tempat_lahir' => 'Grabangan', 'tgl_lahir' => '15/04/1972', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Craf dompet', 'alamat' => 'Panggungsari rt 09/rw 23, no.185. Sariharjo, Ngaglik,Sleman'],
            ['name' => 'Suwarni', 'tempat_lahir' => '', 'tgl_lahir' => '04/08/1973', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Pedagang bakso bakar', 'alamat' => 'Jodag rt 4, Sumberadi Mlati, Sleman'],
            ['name' => 'Tris Waspo', 'tempat_lahir' => '', 'tgl_lahir' => '07/08/1968', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Budi daya janur tiram', 'alamat' => 'Mandungan 2 Rt 01 Rw 26, Seyegan ,Sleman'],
            ['name' => 'Wahyu Tri Kuncono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/08/1984', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Pijat Masage', 'alamat' => 'Rejosari Sardonoharjo, Ngaglik, Sleman'],
            ['name' => 'Waluyo', 'tempat_lahir' => 'Kebumen', 'tgl_lahir' => '06/08/1975', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Swasta (Usaha madu)', 'alamat' => 'Candi 3, Sardonoharjo, Ngaglik, Sleman Yk'],
            ['name' => 'Waluyo', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '08/09/1964', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => '', 'alamat' => 'Balong Rt 02/Rw 01, Donoharjo, Ngaglik, Sleman'],
            ['name' => 'Warsito', 'tempat_lahir' => '', 'tgl_lahir' => '15/03/1977', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Bengkel motor', 'alamat' => 'Besi Rt 04/ 31, Sukoharjo, Ngaglik, Sleman, Yk'],
            ['name' => 'Yahya Purnama', 'tempat_lahir' => 'Banjarnegara', 'tgl_lahir' => '21/10/1983', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh harian lepas', 'alamat' => 'Ketulan Rt 4/Rw 02, Candibinangun, Pakem'],
            ['name' => 'Yenni Amelia', 'tempat_lahir' => '', 'tgl_lahir' => '18/06/1969', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Swasta', 'alamat' => 'Nepen Candibinangun, Pakem, Sleman'],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'Bank Difabel');
    }

    private function seedAsongan(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'Asongan')->first();
        if (! $grup) {
            $this->command->error('Grup Asongan tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Pedagang%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Pedagang tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Badaruddin', 'tempat_lahir' => 'Kulon Progo', 'tgl_lahir' => '06/10/1950', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Dagang', 'alamat' => 'Bintaran Kidul Rt 009 Rw 003, Yogyakarta'],
            ['name' => 'Dyah Ayu Yunita Kurniawati', 'tempat_lahir' => 'Blora', 'tgl_lahir' => '14/06/1976', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Jl. Nogosari 3 Rt 035 Rw 002 Patehan, Kraton, Yogyakarta'],
            ['name' => 'Esmanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '04/02/1978', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Pabrik', 'alamat' => 'Sumber Arum, Moyudan, Sleman'],
            ['name' => 'Giyanto', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '20/10/1977', 'jenis_kelamin' => 'Laki-Laki', 'agama' => 'Islam', 'pekerjaan' => 'Buruh', 'alamat' => 'Jl. Nogosari 2C, Kraton, Yogyakarta'],
            ['name' => 'Murwantinah', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '22/02/1981', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Sumber Arum, Moyudan, Sleman'],
            ['name' => 'Siti Mufalikah', 'tempat_lahir' => 'Lampung', 'tgl_lahir' => '05/01/1961', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Dagang', 'alamat' => 'Jl. Nogosari 2C Rt 05 Rw 02 Kadipaten Kidul, Kadipaten, Kraton, Yogyakarta'],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'Asongan');
    }

    private function seedGERKATINSleman(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'GERKATIN Sleman')->first();
        if (! $grup) {
            $this->command->error('Grup GERKATIN Sleman tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Difabel%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Difabel tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Agus Ariyanto', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '03/04/1967', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Pengok Kidul GK4/1080 Gondokusuman, Yogyakarta'],
            ['name' => 'Agil Lensana', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '13/11/1997', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Munggur 004/- Sitimulyo, Piyungan, Bantul'],
            ['name' => 'Anisa Awalia Wijayanti', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '10/02/1989', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Pulerejo 008/003 Bokoharjo, Prambanan, Sleman'],
            ['name' => 'Boinem', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '27/09/1967', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Gancahan VI RT05 RW014'],
            ['name' => 'Brahma Cahya Dhaksinarga', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '04/06/1994', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Kranon 002/006 Kepek, Wonosari, Gunungkidul'],
            ['name' => 'Choiril Asom', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '01/08/1974', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Medelan 01/- Sumberagung Imogiri, Bantul'],
            ['name' => 'Cipto Budi Santoso', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '26/05/1969', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Bawuk 028/011 No. 87, Minnomartani, Ngaglik Sleman'],
            ['name' => 'Dewi Yunita Wisnu Aji', 'tempat_lahir' => 'Klaten', 'tgl_lahir' => '30/06/1983', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => '006/006, Sentonorejo 006/006, Blambangan, Jogotirto, Berbah, Sleman'],
            ['name' => 'Dwi Rahayu Februarti', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '12/02/1979', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Gemawang 003/044, Sinduadi, Mlati, Sleman'],
            ['name' => 'Edi Sukamto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '09/10/1969', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Pegawai Negeri Sipil', 'alamat' => 'Kragan 001/001, Mororejo, Tempel, Sleman'],
            ['name' => 'Elfiandi Nain', 'tempat_lahir' => 'Bukittinggi', 'tgl_lahir' => '09/07/1972', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Gemawang 003/044, Sinduadi, Mlati, Sleman'],
            ['name' => 'Fajar Santoso', 'tempat_lahir' => 'Jakarta Selatan', 'tgl_lahir' => '05/07/1995', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Ngelo Lor RT2 RW013 Beji, Ngawen, Gunungkidul'],
            ['name' => 'Hanif Adhi Pratama', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '19/08/1999', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Pelajar/Mahasiswa', 'alamat' => 'Watuadeg 001/019, Purwobinangun, Pakem, Sleman'],
            ['name' => 'Hartini', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '03/09/1969', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Nologaten 010/004 Caturtunggal. Depok, Sleman'],
            ['name' => 'Heri Santoso', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '25/05/1968', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Ngringin 006/008 Bejiharjo, Karangmojo, Gunungkidul'],
            ['name' => 'Heru Sunarto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '16/05/1978', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Plosorejo 003/014 Umbulharjo, Cangkringan Sleman'],
            ['name' => 'Ika Nur Widayati', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '25/01/1983', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'KLUMPIT 003/014 Kepek Wonosari, Gunungkidul'],
            ['name' => 'Karsiati', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '21/05/1971', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Sambilegi Lor 004/054 Maguwoharjo, Depok Sleman'],
            ['name' => 'Lidya Dessy Prihastuti', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '16/06/1979', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Kuncen WB I/668 RT27 RW06 Wirobrajan Yogyakarta'],
            ['name' => 'Martono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '29/04/1972', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan swasta', 'alamat' => 'Mulungan Wetan 007/017, Sendangadi, Mlati, Sleman'],
            ['name' => 'Muhammad Irfan Fathoni', 'tempat_lahir' => 'Bandung', 'tgl_lahir' => '20/10/1996', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Guru', 'alamat' => 'Modinan 007/021 Bayuraden, Gamping, Sleman'],
            ['name' => 'Muhammad Makinuddin', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '13/12/1982', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Kanggotan 003/- Pleret Bantul'],
            ['name' => 'Muhammad Rayhan Ukaasyah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '26/01/2001', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Pelajar/Mahasiswa', 'alamat' => 'Wonorejo 004/008 no.89 Sariharjo, Ngaglik, Slemann'],
            ['name' => 'Ngatini', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '19/12/1969', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Gunungan RT008/-'],
            ['name' => 'Novita Nur Alifah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '20/11/1996', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Pelajar/Mahasiswa', 'alamat' => 'Cibukan 005/007 No; 30 Sumberadi, Malti, Sleman'],
            ['name' => 'Nurlintang Pratiwi', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '25/10/1985', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan', 'alamat' => 'Ambarukmo No349 RT07 RW003'],
            ['name' => 'Paryono', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '22/09/1989', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Kandangsari 004/011, Sukloharjo, Ngaglik, Sleman'],
            ['name' => 'Riza Fachrudi', 'tempat_lahir' => 'Yogyakarta', 'tgl_lahir' => '06/02/1968', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan', 'alamat' => 'Jl Palagan Tentara Pelajar km.7 Tegal sari RT08 Rw030'],
            ['name' => 'Rr.Farida Yuniar', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '26/06/1976', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Belum bekerja', 'alamat' => '006/003, Jl. Letkol Subadri 006/003, no.14, kalakijo, Sleman'],
            ['name' => 'Rumidah', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '12/05/1980', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Kadekgunung DK Kadekrowo RT04'],
            ['name' => 'Rumini', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '02/06/1983', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Pelemsari 001/004 Bokoharjo Prambanan, Sleman'],
            ['name' => 'Sri Dewi Wuri Ernawati', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '05/07/1984', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Bangunrejo TR I/1693 RT047 RW010 Kircak, TegalRejo Yogyakarta'],
            ['name' => 'Suharini', 'tempat_lahir' => 'Kulonprogo', 'tgl_lahir' => '12/07/1983', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Jeronan Padukuhan X RT041 RW019'],
            ['name' => 'Suparman', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '15/09/1958', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Petani/Pekebun', 'alamat' => 'Karangwetan, Ngaglik RT05/RW027'],
            ['name' => 'Sutrisni', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '23/04/1991', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Ponggok I Trimulyo, Jetis, Bantul'],
            ['name' => 'Suwardi', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '28/09/1990', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Pete 02/016 Sidomoyo, Godean, Sleman'],
            ['name' => 'Suyanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '26/09/1974', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Nogosari 001/026 Sidokarto, Godean, Sleman'],
            ['name' => 'Tom Hariyanto', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '29/08/1979', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => 'Pulerejo 008/003 Bokoharjo, Prambanan, Sleman'],
            ['name' => 'Tri Maryuni', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '10/10/1984', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Canden 001/- Canden, Jetis, Bantul'],
            ['name' => 'Umi Syarofah', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '31/12/1970', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Wiraswasta', 'alamat' => 'Brambang Gatak I RT05/ RW003 Selomartani Kalasan'],
            ['name' => 'Wahadi', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '08/05/1973', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Buruh Harian Lepas', 'alamat' => '001/- Canden'],
            ['name' => 'Wahyu Sutrisno', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '08/03/1968', 'jenis_kelamin' => 'L', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan swasta', 'alamat' => 'Iropaten I 002/002, Sleman'],
            ['name' => 'Warsani', 'tempat_lahir' => 'Selman', 'tgl_lahir' => '16/11/1968', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Klampis RT01 RW015'],
            ['name' => 'Yayang Fitri Nurohma', 'tempat_lahir' => 'Bantul', 'tgl_lahir' => '17/12/2000', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Ibu Rumah Tangga', 'alamat' => 'Kurahan II DK VIII RT03/- Murtigading, Sanden, Bantul'],
            ['name' => 'Yuni Lestari', 'tempat_lahir' => 'Sleman', 'tgl_lahir' => '01/02/1983', 'jenis_kelamin' => 'P', 'agama' => 'Islam', 'pekerjaan' => 'Karyawati', 'alamat' => 'Genengsari 01/013 Umbulharjo, Cangkringan, Sleman'],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'GERKATIN Sleman');
    }

    private function seedJALAMU(callable $mapPekerjaan, callable $parseDate, callable $mapGender): void
    {
        $grup = DB::table('grup_dampingans')->where('name', 'JALAMU')->first();
        if (! $grup) {
            $this->command->error('Grup JALAMU tidak ditemukan.');

            return;
        }

        $bidang = DB::table('bidangs')->where('name', 'LIKE', '%Nelayan%')->first();
        if (! $bidang) {
            $this->command->error('Bidang Nelayan tidak ditemukan.');

            return;
        }

        $data = [
            ['name' => 'Gemi', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '13/10/1970', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Heru Nufiyanta', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '13/06/1988', 'jenis_kelamin' => 'Laki-laki', 'agama' => 'Islam', 'pekerjaan' => 'Perangkat Desa', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Lia Ayu Saputri', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '29/03/1994', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Mengurus Rumah Tangga', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Musiyem', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '17/10/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Ngatikem', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '23/03/1968', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Renny Milawati', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '28/10/1997', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Mengurus Rumah Tangga', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Ria Pegi Muhdianingsih', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '12/01/1994', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Karyawan Swasta', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Sujiyem', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '09/03/1984', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Sutarti', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '22/01/1971', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Katolik', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Sutini', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '02/10/1982', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Warsini', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '25/03/1976', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
            ['name' => 'Yuniati', 'tempat_lahir' => 'Gunung Kidul', 'tgl_lahir' => '28/06/1985', 'jenis_kelamin' => 'Perempuan', 'agama' => 'Islam', 'pekerjaan' => 'Petani', 'alamat' => 'Nanas, Tileng, Girisobo, GK'],
        ];

        $this->insertAnggota($data, $bidang->id_bidang, $grup->id_grup_dampingan, $mapPekerjaan, $parseDate, $mapGender, 'JALAMU');
    }

    private function insertAnggota(array $data, string $bidangId, string $grupId, callable $mapPekerjaan, callable $parseDate, callable $mapGender, string $grupName): void
    {
        $qrService = app(QrCodeService::class);
        $noAnggotaService = app(NoAnggotaService::class);
        $count = 0;

        foreach ($data as $row) {
            $anggota = AnggotaGrupDampingan::create([
                'id_anggota_grup' => (string) Str::uuid(),
                'bidang_id' => $bidangId,
                'no_anggota' => $noAnggotaService->generate($grupId),
                'name' => $row['name'],
                'tempat_lahir' => ($row['tempat_lahir'] ?? null) ?: null,
                'tgl_lahir' => $parseDate($row['tgl_lahir']),
                'jenis_kelamin' => $mapGender($row['jenis_kelamin']),
                'agama' => ($row['agama'] ?? null) ?: null,
                'alamat' => ($row['alamat'] ?? null) ?: null,
                'no_telp' => ($row['no_telp'] ?? null) ?: null,
                'foto' => null,
                'pekerjaan_id' => $mapPekerjaan($row['pekerjaan'] ?? '') ?: null,
                'grup_id' => $grupId,
                'status' => 'aktif',
                'created_at' => now(),
            ]);

            $qrService->generateForAnggota($anggota);
            $count++;
        }

        $this->command->info('✓ '.$count.' anggota grup '.$grupName.' berhasil ditambahkan.');
    }
}
