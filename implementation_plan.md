# Rencana Perbaikan Bug Mapping Data & Form SIM Dampingan

Dokumen ini merangkum seluruh perbaikan yang telah kita rumuskan sebelumnya. Karena Anda akan melakukan `git pull` dari *branch* `main` yang mungkin saja menimpa (*overwrite*) perubahan lokal kita, maka **setelah Anda selesai melakukan pull**, kita akan mengecek poin-poin di bawah ini satu per satu. Jika di *branch* `main` ternyata belum diperbaiki, kita akan mengimplementasikannya ulang sesuai rencana ini.

## User Review Required

> [!IMPORTANT]
> Lakukan `git pull origin main` terlebih dahulu. Selesaikan *merge conflicts* jika ada. Setelah itu, konfirmasikan ke saya agar kita bisa mulai memverifikasi dan mengeksekusi rencana ini.

## Proposed Changes

Berikut adalah daftar pengecekan dan perbaikan yang akan kita lakukan setelah `pull`:

---

### 1. Frontend - Pemetaan Tabel (Data Mapping)

Kita perlu memastikan bahwa *frontend* membaca atribut JSON yang benar dari *backend*. Seringkali kode lama memanggil `nama_grup` padahal API mengirimkan `name`.

#### [MODIFY] `frontend/src/pages/DataGrupDampingan/DataGrupPage.jsx`
- Pastikan *mapping* relasi Fasilitator dan Bidang sudah benar:
  - Fasilitator: `item.grup_fasilitators?.map(gf => gf.fasilitator?.name)`
  - Bidang: `item.bidang?.name`

#### [MODIFY] `frontend/src/pages/DataFasilitator/DataFasilitatorPage.jsx`
- Ubah pemanggilan `item.bidang` menjadi `item.fasilitator_bidangs?.map(fb => fb.bidang?.name)`.
- Ubah pemanggilan `item.grup` menjadi `item.grup_fasilitators?.map(gf => gf.grup_dampingan?.name)`.

#### [MODIFY] `frontend/src/pages/DataPjDampingan/DataPjPage.jsx`
- Ubah pemanggilan `item.grup` menjadi `item.grup_dampingans_pengurus?.map(g => g.name)`.

#### [MODIFY] `frontend/src/pages/DataAdmin/DataAdminPage.jsx`
- Hapus kolom **Alamat** dari tabel karena tabel `users` di database tidak memiliki kolom `alamat`.
- Ubah pemanggilan `item.no_hp` menjadi `item.no_telp`.

---

### 2. Frontend - Form Modal (Dynamic Data & Input)

Kita perlu memastikan *dropdown* yang sebelumnya menggunakan *hardcode* angka (1, 2) sudah diganti dengan *fetching* data dinamis ke database.

#### [MODIFY] `frontend/src/components/modals/AddGrupModal.jsx` & `EditGrupModal.jsx`
- Pastikan *dropdown* Bidang sudah menggunakan `useBidangQuery` (UUID) dan *dropdown* Fasilitator sudah menggunakan *list* dari backend, bukan data palsu (hardcode).

#### [MODIFY] `frontend/src/components/modals/AddFacilitatorModal.jsx`
- Ganti *dropdown* Bidang Dampingan yang tadinya statis (`<option value="1">Perekonomian</option>`) menggunakan `useBidangQuery` agar mengambil UUID `id_bidang` asli dari database.

#### [MODIFY] `frontend/src/components/modals/AddAdminModal.jsx`
- Hapus *input* teks untuk **Alamat**, mengingat data ini tidak bisa disimpan di tabel `users`.

---

### 3. Backend - Eager Loading & Store Logic

Jika *frontend* sudah meminta datanya, *backend* harus wajib menyediakannya dan menyimpannya.

#### [MODIFY] `backend/app/Http/Controllers/Api/User/UserController.php`
- **Metode `indexFasilitator`**: Pastikan ada `with(['fasilitatorBidangs.bidang', 'grupFasilitators.grupDampingan'])` agar data relasi terkirim ke *frontend*.
- **Metode `indexPjGrup`**: Pastikan ada `with(['grupDampingansPengurus'])`.
- **Metode `storeFasilitator`**: Tangkap `bidang_id` dari *request* `POST` dan simpan ke dalam tabel `FasilitatorBidang` saat *user* fasilitator baru saja di-create.

## Verification Plan

### Manual Verification
1. Buka halaman **Data Admin** dan pastikan nomor telepon muncul, serta kolom alamat sudah hilang.
2. Buka halaman **Data Fasilitator** dan **Data PJ**, pastikan bidang dan grup tampil dengan nama yang benar, bukan `-` atau *error*.
3. Coba **Tambah Fasilitator Baru** dan pilih bidangnya, pastikan berhasil disimpan tanpa masalah validasi.
