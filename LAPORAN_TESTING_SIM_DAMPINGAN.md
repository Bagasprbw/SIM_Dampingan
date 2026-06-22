# LAPORAN TESTING SIM DAMPINGAN (MENTORA)
# MPM Muhammadiyah

Disusun Oleh :
- Edwin Ronaltama Mabrur (V3424050)
- Muhammad Harits Fahrizal (V3424063)
- Muhammad Iqbal Romadhon (V3424065)
- Bagas Prabowo (V3424042)
- Almas Yusuf Zanuar (V3424038)

PROGRAM STUDI D3 TEKNIK INFORMATIKA
SEKOLAH VOKASI
UNIVERSITAS SEBELAS MARET 
2026

---

## Daftar Isi
1. [A. Testing Plan](#a-testing-plan)
   - [a. Tujuan Pengujian](#a-tujuan-pengujian)
   - [b. Scope Pengujian](#b-scope-pengujian)
   - [c. Metode Pengujian](#c-metode-pengujian)
   - [d. Environment Pengujian](#d-environment-pengujian)
2. [B. Eksekusi Pengujian](#b-eksekusi-pengujian)
   - [a. Eksekusi Pengujian Role Super Admin](#a-eksekusi-pengujian-role-super-admin)
   - [b. Eksekusi Pengujian Role Admin Daerah](#b-eksekusi-pengujian-role-admin-daerah)
   - [c. Eksekusi Pengujian Role Fasilitator](#c-eksekusi-pengujian-role-fasilitator)
   - [d. Eksekusi Pengujian Role PJ Dampingan](#d-eksekusi-pengujian-role-pj-dampingan)
   - [e. Kesimpulan](#e-kesimpulan)
3. [C. Strategi Demo](#c-strategi-demo)

---

## A. Testing Plan

### a. Tujuan Pengujian
Pengujian dilakukan untuk memastikan seluruh fitur pada sistem SIM Dampingan (Mentora) berjalan sesuai kebutuhan fungsional pengguna, menghasilkan output yang benar, dan bebas dari bug yang dapat mengganggu operasional sistem.

### b. Scope Pengujian

**Role: Super Admin**
| No | Fitur Yang Diuji | Tujuan Pengujian |
|---|---|---|
| 1 | Login | Memastikan Superadmin dapat masuk ke sistem. |
| 2 | Dashboard | Memastikan halaman Dashboard menampilkan statistik dan ringkasan data. |
| 3 | Data Admin | Memastikan Superadmin dapat melihat dan mengelola data Admin. |
| 4 | Data Fasilitator | Memastikan Superadmin dapat melihat dan mengelola data Fasilitator. |
| 5 | Data PJ Dampingan | Memastikan Superadmin dapat melihat dan mengelola data PJ Dampingan. |
| 6 | Data Grup Dampingan | Memastikan Superadmin dapat melihat dan mengelola data Grup Dampingan. |
| 7 | Data Dampingan | Memastikan Superadmin dapat melihat dan mengelola data masyarakat dampingan. |
| 8 | Kegiatan Dampingan | Memastikan Superadmin dapat melihat list seluruh kegiatan dampingan. |
| 9 | Kelola Kegiatan | Memastikan Superadmin dapat mengelola data kegiatan dampingan. |
| 10 | Kelola Hak Akses | Memastikan Superadmin dapat mengatur hak akses dan fitur secara dinamis. |
| 11 | Peta Sebaran | Memastikan Superadmin dapat melihat visualisasi peta persebaran kelompok. |
| 12 | Log Aktifitas | Memastikan Superadmin dapat memantau riwayat aktivitas semua pengguna. |
| 13 | Panduan Penggunaan | Memastikan Superadmin dapat mengelola pusat panduan. |

**Role: Admin Daerah**
| No | Fitur Yang Diuji | Tujuan Pengujian |
|---|---|---|
| 1 | Login | Memastikan Admin Daerah dapat masuk ke sistem. |
| 2 | Dashboard | Memastikan halaman Dashboard menampilkan statistik khusus wilayah Admin Daerah. |
| 3 | Data Admin | Memastikan Admin Daerah dapat melihat dan mengelola data Admin bawahannya. |
| 4 | Data Fasilitator | Memastikan Admin Daerah dapat melihat dan mengelola data Fasilitator di daerahnya. |
| 5 | Data PJ Dampingan | Memastikan Admin Daerah dapat melihat data PJ Dampingan sesuai wilayahnya. |
| 6 | Data Grup Dampingan | Memastikan Admin Daerah dapat mengelola data Grup Dampingan sesuai wilayahnya. |
| 7 | Data Dampingan | Memastikan Admin Daerah dapat mengelola data masyarakat dampingan di daerahnya. |
| 8 | Kegiatan Dampingan | Memastikan Admin Daerah dapat melihat list kegiatan dari wilayahnya. |
| 9 | Kelola Kegiatan | Memastikan Admin Daerah dapat mengelola data kegiatan dampingan di daerahnya. |
| 10 | Peta Sebaran | Memastikan Admin Daerah dapat melihat peta persebaran kelompok pada daerahnya. |
| 11 | Log Aktifitas | Memastikan Admin Daerah dapat memantau riwayat aktivitas pengguna di daerahnya. |
| 12 | Panduan Penggunaan | Memastikan Admin Daerah dapat mengakses pusat panduan. |

**Role: Fasilitator**
| No | Fitur Yang Diuji | Tujuan Pengujian |
|---|---|---|
| 1 | Login | Memastikan Fasilitator dapat masuk ke sistem. |
| 2 | Dashboard | Memastikan halaman Dashboard menampilkan statistik dampingan milik Fasilitator. |
| 3 | Konfirmasi Anggota | Memastikan Fasilitator dapat mengkonfirmasi (setujui/tolak) pengajuan anggota. |
| 4 | Kelola Dampingan | Memastikan Fasilitator dapat melihat dan mengelola grup dampingannya. |
| 5 | Kelola Kegiatan | Memastikan Fasilitator dapat melakukan CRUD pada kegiatan dampingannya. |
| 6 | Kegiatan Dampingan | Memastikan Fasilitator dapat melihat kegiatan dampingan yang dikelola. |
| 7 | Peta Sebaran | Memastikan Fasilitator dapat melihat peta persebaran grup dampingannya. |
| 8 | Log Aktifitas | Memastikan Fasilitator dapat melihat riwayat aktivitas dirinya sendiri. |
| 9 | Panduan Penggunaan | Memastikan Fasilitator dapat mengakses pusat panduan. |

**Role: PJ Dampingan**
| No | Fitur Yang Diuji | Tujuan Pengujian |
|---|---|---|
| 1 | Login | Memastikan PJ Dampingan dapat masuk ke sistem. |
| 2 | Dashboard | Memastikan halaman Dashboard menampilkan statistik ringkasan khusus PJ Dampingan. |
| 3 | Pendaftaran Anggota | Memastikan PJ Dampingan dapat mengajukan anggota baru ke Fasilitator. |
| 4 | Informasi Dampingan | Memastikan PJ Dampingan dapat melihat detail grup dampingannya. |
| 5 | Kegiatan Dampingan | Memastikan PJ Dampingan dapat melihat list kegiatan dari grupnya. |
| 6 | Peta Sebaran | Memastikan PJ Dampingan dapat melihat peta persebaran grupnya. |
| 7 | Log Aktifitas | Memastikan PJ Dampingan dapat melihat riwayat aktivitas dirinya sendiri. |
| 8 | Panduan Penggunaan | Memastikan PJ Dampingan dapat mengakses pusat panduan. |

### c. Metode Pengujian
Metode yang digunakan untuk melakukan pengujian adalah metode Black Box Testing, yaitu pengujian yang berfokus pada fungsionalitas sistem berdasarkan input dan output tanpa melihat kode program.

### d. Environment Pengujian
| Komponen | Detail |
|---|---|
| Sistem Operasi | Windows 11 Pro / macOS / Linux |
| Browser | Google Chrome |
| Device | Laptop |
| Koneksi Internet | Wi-Fi |
| Aplikasi yang Diuji | SIM Dampingan (Mentora) |

---

## B. Eksekusi Pengujian

Tahap eksekusi pengujian dilakukan untuk memverifikasi bahwa setiap fitur berfungsi sesuai dengan kebutuhan dan hak akses masing-masing pengguna.

### a. Eksekusi Pengujian Role Super Admin
| ID | Fitur | Priority | Skenario Pengujian | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-SA-001 | Login | P1 | Login menggunakan akun Super Admin yang valid | Berhasil masuk ke dashboard. | Berhasil masuk ke dashboard | PASS |
| TC-SA-002 | Dashboard | P1 | Membuka halaman Dashboard | Menampilkan seluruh jumlah data secara global | Sesuai ekspektasi | PASS |
| TC-SA-003 | Data Admin | P1 | Melakukan fungsi CRUD data admin | Data admin berhasil tersimpan dan berubah | Sesuai ekspektasi | PASS |
| TC-SA-004 | Data Fasilitator | P1 | Melakukan fungsi CRUD data fasilitator | Data fasilitator berhasil dikelola | Sesuai ekspektasi | PASS |
| TC-SA-005 | Data PJ Dampingan | P1 | Melakukan akses pada data PJ Dampingan | Data PJ Dampingan tertampil dan dapat dikelola | Sesuai ekspektasi | PASS |
| TC-SA-006 | Data Grup Dampingan | P1 | Melakukan pengelolaan (CRUD) pada Grup Dampingan | Data grup dampingan terupdate di sistem | Sesuai ekspektasi | PASS |
| TC-SA-007 | Data Dampingan | P1 | Mengakses dan melakukan CRUD pada anggota masyarakat | Data anggota dapat diubah/ditambah/dihapus | Sesuai ekspektasi | PASS |
| TC-SA-008 | Kegiatan Dampingan | P2 | Melihat halaman list kegiatan dampingan | Daftar kegiatan dampingan secara global muncul | Sesuai ekspektasi | PASS |
| TC-SA-009 | Kelola Kegiatan | P1 | Menambahkan atau mengedit Kegiatan Dampingan | Kegiatan berhasil ditambahkan dan disimpan | Sesuai ekspektasi | PASS |
| TC-SA-010 | Kelola Hak Akses | P1 | Mengatur ulang perizinan Role | Hak akses role berhasil berubah secara dinamis | Sesuai ekspektasi | PASS |
| TC-SA-011 | Peta Sebaran | P2 | Membuka visualisasi persebaran masyarakat | Peta menampilkan titik-titik persebaran valid | Sesuai ekspektasi | PASS |
| TC-SA-012 | Log Aktifitas | P2 | Membuka log riwayat dari semua role | Muncul catatan rekam jejak operasi sistem | Sesuai ekspektasi | PASS |
| TC-SA-013 | Panduan Penggunaan | P3 | Mengunggah Link Panduan/Video | Panduan berhasil disimpan | Sesuai ekspektasi | PASS |

### b. Eksekusi Pengujian Role Admin Daerah
| ID | Fitur | Priority | Skenario Pengujian | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-AD-001 | Login | P1 | Login dengan akun Admin Daerah | Berhasil masuk dashboard | Berhasil masuk dashboard | PASS |
| TC-AD-002 | Dashboard | P1 | Membuka halaman Dashboard | Hanya menampilkan ringkasan daerah Admin bersangkutan | Sesuai ekspektasi | PASS |
| TC-AD-003 | Data Admin | P1 | Melihat data Admin bawahan | Data admin bawahan ditampilkan sesuai wilayah | Sesuai ekspektasi | PASS |
| TC-AD-004 | Data Fasilitator | P1 | Melakukan fungsi CRUD data fasilitator | Hanya bisa CRUD fasilitator di wilayahnya | Sesuai ekspektasi | PASS |
| TC-AD-005 | Data PJ Dampingan | P1 | Membuka data PJ Dampingan | Data yang muncul terfilter di wilayah tersebut | Sesuai ekspektasi | PASS |
| TC-AD-006 | Data Grup Dampingan | P1 | Mengakses dan melakukan CRUD pada grup dampingan | Hanya bisa CRUD grup dampingan di wilayahnya | Sesuai ekspektasi | PASS |
| TC-AD-007 | Data Dampingan | P1 | Melakukan fungsi CRUD data masyarakat | Hanya dapat akses anggota di wilayah admin | Sesuai ekspektasi | PASS |
| TC-AD-008 | Kegiatan Dampingan | P2 | Melihat tabel kegiatan | Tabel hanya berisi kegiatan dampingan wilayahnya | Sesuai ekspektasi | PASS |
| TC-AD-009 | Kelola Kegiatan | P1 | Mengedit/mengelola data kegiatan dampingan | Kegiatan berhasil dikelola | Sesuai ekspektasi | PASS |
| TC-AD-010 | Peta Sebaran | P2 | Membuka Peta Persebaran masyarakat | Peta terfokus dan filter pada daerah admin terkait | Sesuai ekspektasi | PASS |
| TC-AD-011 | Log Aktifitas | P2 | Membuka log aktivitas | Menampilkan riwayat aksi dari pengguna di wilayahnya | Sesuai ekspektasi | PASS |
| TC-AD-012 | Panduan Penggunaan | P3 | Mengakses halaman panduan pengguna | Tautan dan panduan ditampilkan | Sesuai ekspektasi | PASS |

### c. Eksekusi Pengujian Role Fasilitator
| ID | Fitur | Priority | Skenario Pengujian | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-FA-001 | Login | P1 | Login dengan akun Fasilitator | Berhasil masuk dashboard Fasilitator | Berhasil masuk dashboard | PASS |
| TC-FA-002 | Dashboard | P1 | Melihat halaman Dashboard | Menampilkan statistik dampingan dan grup Fasilitator | Sesuai ekspektasi | PASS |
| TC-FA-003 | Konfirmasi Anggota | P1 | Memverifikasi ajukan pengajuan anggota baru dari PJ | Status masyarakat berubah menjadi aktif | Sesuai ekspektasi | PASS |
| TC-FA-004 | Kelola Dampingan | P1 | Mengelola grup yang diampu oleh Fasilitator | Berhasil melihat dan mengelola grup dampingan | Sesuai ekspektasi | PASS |
| TC-FA-005 | Kelola Kegiatan | P1 | Membuat atau mengubah kegiatan dampingan | Kegiatan dampingan tersimpan dengan baik | Sesuai ekspektasi | PASS |
| TC-FA-006 | Kegiatan Dampingan | P2 | Melihat rincian tabel kegiatan dampingan | Tabel menampilkan data kegiatan secara detail | Sesuai ekspektasi | PASS |
| TC-FA-007 | Peta Sebaran | P2 | Membuka peta titik dampingan fasilitator | Titik pemetaan daerah grup dampingan tampil | Sesuai ekspektasi | PASS |
| TC-FA-008 | Log Aktifitas | P3 | Mengecek history log Fasilitator | Catatan operasi spesifik milik Fasilitator tersebut tertampil | Sesuai ekspektasi | PASS |
| TC-FA-009 | Panduan Penggunaan | P3 | Membuka pusat panduan | Akses sukses melihat video maupun link drive panduan | Sesuai ekspektasi | PASS |

### d. Eksekusi Pengujian Role PJ Dampingan
| ID | Fitur | Priority | Skenario Pengujian | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-PJ-001 | Login | P1 | Login dengan akun PJ Dampingan | Berhasil masuk dashboard PJ Dampingan | Berhasil masuk dashboard | PASS |
| TC-PJ-002 | Dashboard | P1 | Melihat halaman Dashboard | Ringkasan dampingan dan statusnya (pending/aktif) tampil | Sesuai ekspektasi | PASS |
| TC-PJ-003 | Pendaftaran Anggota | P1 | PJ mengisi pengajuan anggota baru | Data masyarakat terkirim untuk di-acc oleh Fasilitator | Sesuai ekspektasi | PASS |
| TC-PJ-004 | Informasi Dampingan | P2 | Membuka list Informasi Grup Dampingan | Rincian grup seperti alamat, fasilitator dan anggota muncul | Sesuai ekspektasi | PASS |
| TC-PJ-005 | Kegiatan Dampingan | P2 | Melihat tabel informasi kegiatan dari grupnya | Informasi tanggal dan waktu kegiatan tertampil | Sesuai ekspektasi | PASS |
| TC-PJ-006 | Peta Sebaran | P3 | Melihat map box lokasi | Mapbox tampil normal | Sesuai ekspektasi | PASS |
| TC-PJ-007 | Log Aktifitas | P3 | Membuka tab Log Aktivitas | Rekam jejak input sistem milik PJ terkait dapat dibaca | Sesuai ekspektasi | PASS |
| TC-PJ-008 | Panduan Penggunaan | P3 | Membuka pusat bantuan penggunaan sistem | Membuka tautan YouTube dengan lancar | Sesuai ekspektasi | PASS |

### e. Kesimpulan
Berdasarkan hasil pengujian yang telah dilakukan dengan **Metode Black Box Testing**, seluruh fitur fungsional SIM Dampingan pada setiap level akses (Super Admin, Admin Daerah, Fasilitator, dan PJ Dampingan) dapat berjalan sesuai dengan kebutuhan sistem tanpa adanya kendala kritis.

---

## C. Strategi Demo (Pitching Plan)

**1. Opening & Pengantar Proyek**
- **Tugas (Edwin Ronaltama Mabrur - V3424050) / Moderator:**
  - Mengucapkan salam dan menyapa Dosen Penilai.
  - Memperkenalkan anggota tim.
  - Memberikan latar belakang singkat terkait sistem SIM Dampingan yang dikembangkan pada Sprint 2 ini untuk MPM Muhammadiyah.
  - Menjelaskan secara ringkas fitur-fitur apa saja yang sudah diselesaikan sesuai *list* (Superadmin: 13 Fitur, Admin Daerah: 12 Fitur, Fasilitator: 9 Fitur, PJ Dampingan: 8 Fitur).

**2. Live Demo: Sisi Manajemen/Backend**
- **Tugas (Bagas Prabowo - V3424042):**
  - Mendemokan role **Superadmin & Admin Daerah**.
  - Fokus menjelaskan alur logika sistem (Backend), seperti bagaimana **Kelola Hak Akses (RBAC)** bekerja secara dinamis.
  - Mempraktekkan *Cascade Wilayah* pada Admin Daerah (mencontohkan batasan data yang difilter oleh backend berdasarkan wilayah tiap admin).

**3. Live Demo: Sisi Lapangan/Frontend**
- **Tugas (Muhammad Harits Fahrizal - V3424063) & (Muhammad Iqbal Romadhon - V3424065):**
  - Mendemokan role **Fasilitator & PJ Dampingan**. Fokus pada antarmuka (Frontend) dan kemudahan penggunaan di lapangan.
  - **Harits:** Login sebagai PJ Dampingan, kemudian mendemokan proses mengisi **Pendaftaran Anggota** baru.
  - **Iqbal:** Login sebagai Fasilitator, mendemokan proses membuka pengajuan anggota lalu mengklik **Konfirmasi / ACC** agar anggota menjadi aktif.

**4. Hasil Testing**
- **Tugas (Almas Yusuf Zanuar - V3424038):**
  - Menjelaskan bahwa pengujian dilakukan menggunakan metode *Black Box Testing* secara menyeluruh.
  - Menampilkan tabel hasil Eksekusi Pengujian.
  - Memaparkan bahwa semua fungsionalitas UI/UX dari 4 Role berbeda telah selesai dan berjalan mulus tanpa hambatan (status *PASS* 100%).

**5. Closing & QnA**
- **Tugas (Edwin Ronaltama Mabrur - V3424050):**
  - Menyampaikan kesimpulan penutup dari hasil pekerjaan Sprint 2.
  - Mengucapkan terima kasih kepada Dosen Penilai.
  - Membuka sesi tanya jawab (QnA) dan mendistribusikan pertanyaan sesuai porsi masing-masing: pertanyaan terkait logika diserahkan ke Bagas, antarmuka ke Harits/Iqbal, dan seputar error/pengujian ke Almas.
