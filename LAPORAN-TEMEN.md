Testing Plan
Tujuan Pengujian
Pengujian dilakukan untuk memastikan seluruh fitur pada sistem C-Track berjalan sesuai kebutuhan pengguna, menghasilkan output yang benar, dan bebas daari bug yang dapat mengganggu operasional sistem.
Scope Pengujian
Role: Super Admin
No
Fitur Yang Diuji
Tujuan Pengujian
1
Login
Memastikan Super Admin dapat masuk ke sistem.
2
Logout
Memastikan Super Admin dapat keluar dari sistem.
3
Dashboard
Memastikan halaman Dashboard dapat diakses Super Admin dengan tampilan yang berisi:
Summary mengenai semua tugas yang diberikan.
Summary penugasan dalam bentuk grafik.
Tabel Pemberi Peringatan mengenai karyawan yang perlu ditinjau.
4
Analytics
Memastikan halaman Analytics dapat diakses Super Admin dengan tampilan yang berisi:
Summary mengenai penugasan karyawan.
Summary penugasan karyawan dalam bentuk grafik.
Tabel kalender untuk memantau tugas yang selesai dalam satu hari.
Tabel Leaderboard Karyawan.
5
Task
Memastikan Super Admin dapat membuat dan memantau Task.
6
Taken
Memastikan Super Admin dapat menugaskan karyawan.
7
Monitoring Karyawan
Memastikan Super Admin dapat me-monitoring pergerakan karyawan dan membaca laporan yang dikirimkan.
8
Report
Memastikan laporan dapat ditampilkan sesuai data.
9
Chat
Memastikan Super Admin dapat mengirim pesan untuk membalas laporan yang telah dikirimkan karyawan.
10
Users
Memastikan Super Admin dapat menambah, mengubah, dan menghapus akun Admin dan employee. 
11
AI Assistant
Memastikan AI Assistant dapat menerima dan memberikan respons terhadap pertanyaan yang berkaitan dengan sistem C-Track.


Role: Admin
No
Fitur Yang Diuji
Tujuan Pengujian
1
Login
Memastikan Admin dapat masuk ke sistem.
2
Logout
Memastikan Admin dapat keluar dari sistem.
3
Dashboard
Memastikan halaman Dashboard dapat diakses Admin dengan tampilan yang berisi:
Summary mengenai semua tugas yang diberikan.
Summary penugasan dalam bentuk grafik.
Tabel Pemberi Peringatan mengenai karyawan yang perlu ditinjau.
4
Analytics
Memastikan halaman Analytics dapat diakses Admin dengan tampilan yang berisi:
Summary mengenai penugasan karyawan.
Summary penugasan karyawan dalam bentuk grafik.
Tabel kalender untuk memantau tugas yang selesai dalam satu hari.
Tabel Leaderboard Karyawan.
5
Task
Memastikan Admin dapat membuat dan memantau Task.
6
Taken
Memastikan Admin dapat menugaskan karyawan.
7
Monitoring Karyawan
Memastikan Admin dapat me-monitoring pergerakan karyawan dan membaca laporan yang dikirimkan.
8
Report
Memastikan laporan dapat ditampilkan sesuai data.
9
Chat
Memastikan Admin dapat mengirim pesan untuk membalas laporan yang telah dikirimkan karyawan.
10
Users
Memastikan Admin dapat menambah, mengubah, dan menghapus akun employee. 
11
AI Assistant
Memastikan AI Assistant dapat menerima dan memberikan respons terhadap pertanyaan yang berkaitan dengan sistem C-Track.


Role Employee:
No
Fitur Yang Diuji
Tujuan Pengujian
1
Login
Memastikan Employee dapat masuk ke sistem.
2
Logout
Memastikan Employee dapat keluar dari sistem.
3
Beranda
Memastikan tugas yang diberikan kepada Employee sesuai dengan data yang tersimpan di database.
4
Menerima Tugas
Employee dapat melakukan swipe untuk menerima tugas yang diberikan.
5
Mengirim Laporan
Memastikan Employee dapat mengirimkan laporan berupa foto dan deskripsi ke Super Admin dan Admin.
6
Chat
Memastikan fitur pesan memungkinkan Employee untuk mengirim pesan ke Super Admin & Admin dan menerima pesan dari Super Admin & Admin.
7
Notifikasi 
Memastikan Employee mendapatkan notifikasi untuk beberapa aktivitas, diantaranya:
Notifikasi saat Employee ditugaskan.
Notifikasi saat Employee menempati peringkat pertama pada leaderboard.
Notifikasi saat Employee mengirim dan menerima pesan.
Notifikasi saat Employee menyelesaikan tugas.
8
Pencapaian 
Memastikan Employee dapat melihat halaman pencapaian sesuai dengan data pada database.


Metode Pengujian
Metode yang digunakan untuk melakukan pengujian adalah metode Black Box Testing, yaitu pengujian yang berfokus pada fungsionalitas sistem berdasarkan input dan output tanpa melihat kode program.
Environment Pengujian
Komponen
Detail
Sistem Operasi
Windows 11 Pro
Browser
Google Chrome
Device
Laptop
Koneksi Internet
Wi-Fi
Aplikasi yang Diuji
C-Track (Cleon Track)


Eksekusi Pengujian
Tahap eksekusi pengujian dilakukan untuk memverifikasi bahwa setiap fitur pada project C-Track berfungsi sesuai dengan kebutuhan dan hak akses masing-masing pengguna. Pengujian dilakukan menggunakan metode Black Box testing dengan berfokus pada kesesuaian antara hasil yang diharapkan (Expected Result) dan hasil aktual (Actual Result) yang diperoleh saat pengujian.
Eksekusi Pengujian Role Super Admin
ID
Fitur
Priority
Skenario Pengujian
Expected Result
Actual Result
Status
TC-SA-001
Login
P1
Login menggunakan akun Super Admin yang valid
Berhasil masuk ke dashboard.
Berhasil masuk ke dashboard
PASS
TC-SA-002
Login
P1
Login menggunakan akun gmail yang tidak terdaftar
Muncul peringatan bahwa email atau password salah.
Muncul peringatan bahwa email atau password salah.
PASS
TC-SA-003
Login
P1
Menginput password yang salah
Muncul peringatan bahwa email atau password salah.
Muncul peringatan bahwa email atau password salah.
PASS
TC-SA-004
Logout
P1
Klik tombol 'Logout'
Berhasil keluar dari sistem.
Berhasil keluar dari sistem.
PASS
TC-SA-005
Melihat Dashboard
P1
Mengakses dashboard sesuai dengan role
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
PASS
TC-SA-006
Melihat Analytics
P1
Mengakses analytics sesuai dengan role
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
PASS
TC-SA-007
Melihat Task Management
P1
Mengakses task management
Menampilkan tabel task sesuai urutan dari ticket yang ada
Menampilkan tabel task sesuai urutan dari ticket yang ada
PASS
TC-SA-008
Membuat Task
P1
Membuat task dengan mengisi form sesuai dengan ketentuan
Task baru terbuat.
Task baru terbuat.
PASS
TC-SA-009
Membuat Task
P1
Membuat task tanpa mengisi form
Muncul validation message yang mengarahkan Super Admin untuk mengisi form yang tersedia.
Muncul validation message yang mengarahkan Super Admin untuk mengisi form yang tersedia.
PASS
TC-SA-010
Mengedit Task
P1
Mengubah data pada form edit task sesuai dengan data terbaru
Task diperbarui sesuai dengan data terbaru.
Task diperbarui sesuai dengan data terbaru.
PASS
TC-SA-011
Menghapus Task
P1
Menghapus task yang sedang berjalan
Task terhapus
Task terhapus
PASS
TC-SA-012
Menghapus Task
P1
Menghapus task kemudian internet terputus
Task gagal terhapus.
Task gagal terhapus.
PASS
TC-SA-013
Nonaktif Task
P1
Me-nonactive kan task yang sedang dikerjakan
Task nonaktif.
Task nonaktif.
PASS
TC-SA-014
Mengaktifkan Task
P1
Mengaktifkan task yang di nonaktifkan
Task aktif.
Task aktif.
PASS
TC-SA-015
Melihat Task Assignment Management
P1
Mengakses task assignment management
Menampilkan tabel task dengan karyawan yang ditugaskan sesuai urutan dari ticket yang ada.
Menampilkan tabel task dengan karyawan yang ditugaskan sesuai urutan dari ticket yang ada.
PASS
TC-SA-016
Task Selesai Dikerjakan
P2
Karyawan telah menyelesaikan Task
Muncul notifikasi task diselesaikan.
Muncul notifikasi task diselesaikan.
PASS
TC-SA-017
Menugaskan Karyawan
P1
Mengisi form penugasan sesuai dengan ketentuan
Karyawan berhasil ditugaskan dan penugasan muncul di tabel.
Karyawan berhasil ditugaskan dan penugasan muncul di tabel.
PASS
TC-SA-018
Menugaskan Karyawan
P1
Menugaskan task ke karyawan
Sistem mengirim notifikasi penugasan pada device karyawan terkait.
Sistem mengirim notifikasi penugasan pada device karyawan terkait.
PASS
TC-SA-019
Menghapus Task Assignment
P1
Menghapus Task Assignment yang sedaang berjalan atau sudah selesai
Task Assignment berhasil terhapus.
Task Assignment berhasil terhapus.
PASS
TC-SA-020
Monitoring Karyawan
P1
Mengakses halaman monitoring
Menampilkan riwayat lokasi karyawan selama melaksanakan tugas.
Menampilkan riwayat lokasi karyawan selama melaksanakan tugas.
PASS
TC-SA-021
Laporan Masuk
P2
Karyawan mengirim laporan untuk Task
Muncul notifikasi laporan baru masuk.
Muncul notifikasi laporan baru masuk.
PASS
TC-SA-022
Melihat Laporan
P1
Mengakses laporan yang telah dikirimkan karyawan
Laporan menampilkan deskripsi, foto, dan mengakses chat.
Laporan menampilkan deskripsi, foto, dan mengakses chat.
PASS
TC-SA-023
Mengirim Pesan
P1
Mengirim pesan
Pesan terkirim.
Pesan terkirim.
PASS
TC-SA-024
Mengirim Pesan
P2
Pesan diterima tetapi device karyawan tidak sedang membuka aplikasi C-Track
Centang satu.
Centang satu.
PASS
TC-SA-025
Mengirim Pesan
P2
Pesan diterima dengan device karyawan sedang membuka aplikasi C-Track
Centang dua.
Centang dua.
PASS
TC-SA-026
Mengirim Pesan
P2
Terdapat pesan baru masuk
Notifikasi pesan baru muncul.
Notifikasi pesan baru muncul.
PASS
TC-SA-027
Mengirim Pesan
P2
Pesan dibaca oleh salah satu karyawan yang bertugas
Centang dua abu-abu.
Centang dua abu-abu.
FAILED
TC-SA-028
Mengirim Pesan
P2
Pesan dibaca oleh semua karyawan yang bertugas
Centang biru.
Centang biru.
FAILED
TC-SA-029
Mengirim Pesan
P2
Membalas pesan tertentu
Pesan berhasil terkirim sebagai balasan dan menampilkan referensi terhadap pesan yang dibalas.
Pesan berhasil terkirim sebagai balasan dan menampilkan referensi terhadap pesan yang dibalas.
PASS
TC-SA-030
Mengirim Pesan
P2
Pesan yang telah dikirim diedit
Pesan teredit dan muncul keterangan "diedit" pada pesan.
Pesan teredit dan muncul keterangan "diedit" pada pesan.
PASS
TC-SA-031
Mengirim Pesan
P2
Menghapus pesan yang telah dikirim
Muncul indikator "Pesan ini dihapus" untuk menggantikan isi dari pesan sebelum dihapus.
Muncul indikator "Pesan ini dihapus" untuk menggantikan isi dari pesan sebelum dihapus.
PASS
TC-SA-032
Mengirim Pesan
P3
Karyawan sedang mengetik balasan pada room chat
Indikator "(Nama Karyawan) sedang mengetik..." muncul pada sisi Super Admin.
Inddikator "(Nama Karyawan) sedang mengetik..." muncul pada sisi Super Admin.
PASS
TC-SA-033
Mengirim Pesan
P3
Karyawan berhenti mengetik atau mengirim pesan
Indikator typing menghilang.
Indikator typing menghilang.
PASS
TC-SA-034
Membuat Users
P1
Mengisi form user baru sesuai ketentuan dengan menentukan role (Admin atau Employee)
User baru terbuat.
User baru terbuat.
PASS
TC-SA-035
Membuat Users
P1
Tidak mengisi form pengisian user baru dan langsung menekan tombol 'Add User'
Muncul validation message yang mengarahkan Super Admin untuk mengisi form yang tersedia.
Muncul validation message yang mengarahkan Super Admin untuk mengisi form yang tersedia.
PASS
TC-SA-036
Membuat Users
P1
Mengisi form password berbeda dengan confirm password
Muncul notifikasi pop up yang menyatakan bahwa password dan konfirmasi tidak sama.
Muncul notifikasi pop up yang menyatakan bahwa password dan konfirmasi tidak sama.
PASS
TC-SA-037
Edit Users
P1
Mengubah password user
Perubahan disimpan dan password user berubah.
Perubahan disimpan dan password user berubah.
PASS
TC-SA-038
Menghapus User
P1
Menghapus user
User terhapus.
User terhapus.
PASS
TC-SA-039
Nonaktif User
P1
Menonaktifkan user yang sudah tidak digunakan
User dinonaktifkan.
User dinonaktifkan.
PASS
TC-SA-040
Mengaktifkan User
P1
Mengaktifkan user yang dinonaktifkan
User aktif.
User aktif.
PASS
TC-SA-041
AI Assistant
P1
Super Admin mengirim pertanyaan kepada AI Assistant
Pertanyaan berhasil dikirim dan diproses oleh AI Assistant.
Pertanyaan berhasil dikirim dan diproses oleh AI Assistant.
PASS
TC-SA-042
AI Assistant
P1
AI Assistant meberikan jawaban atas pertanyaan Super Admin
Jawaban tampil sesuai pertanyaan yang ditanyakan.
Jawaban tampil sesuai pertanyaan yang ditanyakan.
PASS
TC-SA-043
AI Assistant
P1
Super Admin mengirim pertanyaan lebih dari satu kali dalam satu room chat
AI Assistant tetap memberikan respons untuk setiap pertanyaan.
AI Assistant tetap memberikan respons untuk setiap pertanyaan.
PASS
TC-SA-044
AI Assistant
P2
Riwayat percakapan AI Assistant ditamilkan kembali
Riwayat percakapan tampil sesuai percakapan sebelumnya.
Riwayat percakapan tampil sesuai percakapan sebelumnya.
PASS
TC-SA-045
AI Assistant
P3
AI Assistant sedang memproses pertanyaan
Loading indicator muncul hingga jawaban diterima.
Loading indicator muncul hingga jawaban diterima.
PASS
TC-SA-046
AI Assistant
P3
Super Admin mengirim pertanyaan yang tidak dikenali
AI Assistant memberikan respons fallback atau pesan yang sesuai.
AI Assistant memberikan respons fallback atau pesan yang sesuai.
PASS
TC-SA-047
Pemberitahuan
P1
Super Admin menerima laporan dari karyawan
Muncul In-app Notification di pojok kanan atas
Muncul In-app Notification di pojok kanan atas
PASS
TC-SA-048
Pemberitahuan
P1
Super Admin menerima pesan dari karyawan
Muncul In-app Notification di pojok kanan atas
Muncul In-app Notification di pojok kanan atas
PASS
TC-SA-049
Pemberitahuan
P1
Super Admin menerima pesan dari Admin
Muncul In-app Notification di pojok kanan atas
Muncul In-app Notification di pojok kanan atas
PASS
TC-SA-050
Pemberitahuan
P1
Super Admin menerima pemberituan tugas selesai saat salah satu karyawan menyelesaikan tugas
tidak Muncul In-app Notification di pojok kanan atas
tidak Muncul In-app Notification di pojok kanan atas
PASS
TC-SA-051
Pemberitahuan
P1
Super Admin menerima pemberituan tugas selesai saat salah satu karyawan menyelesaikan tugas
Muncul In-app Notification di pojok kanan atas
Muncul In-app Notification di pojok kanan atas
PASS
TC-SA-052
Pemberitahuan pesan
P2
klik "lihat pesan" pada In-app Notification
mengarah ke pesan terbaru pada halaman Forum diskusi
mengarah ke pesan terbaru pada halaman Forum diskusi
PASS
TC-SA-053
Pemberitahuan Laporan
P2
klik "lihat Laporan" pada In-app Notification
mengarah ke Laporan terbaru pada halaman Forum diskusi
mengarah ke Laporan terbaru pada halaman Forum diskusi
PASS
TC-SA-054
Pemberitahuan Taken Selesai
P2
klik "lihat Taken" pada In-app Notification
mengarah ke Tugas Selesai pada halaman Monitoring tugas tersebut
mengarah ke Laporan terbaru pada halaman Forum diskusi
PASS



Eksekusi Pengujian Role Admin
ID
Fitur
Priority
Skenario Pengujian
Expected Result
Actual Result
Status
TC-AD-001
Login
P1
Login menggunakan akun Admin yang valid
Berhasil masuk ke dashboard.
Berhasil masuk ke dashboard
PASS
TC-AD-002
Login
P1
Login menggunakan akun gmail yang tidak terdaftar
Muncul peringatan bahwa email atau password salah.
Muncul peringatan bahwa email atau password salah.
PASS
TC-AD-003
Login
P1
Menginput password yang salah
Muncul peringatan bahwa email atau password salah.
Muncul peringatan bahwa email atau password salah.
PASS
TC-AD-004
Logout
P1
Klik tombol 'Logout'
Berhasil keluar dari sistem.
Berhasil keluar dari sistem.
PASS
TC-AD-005
Melihat Dashboard
P1
Mengakses dashboard sesuai dengan role
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
PASS
TC-AD-006
Melihat Analytics
P1
Mengakses analytics sesuai dengan role
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
Informasi yang ditampilkan sesuai dengan data yang tersimpan.
PASS
TC-AD-007
Melihat Task Management
P1
Mengakses task management
Menampilkan tabel task sesuai urutan dari ticket yang ada
Menampilkan tabel task sesuai urutan dari ticket yang ada
PASS
TC-AD-008
Membuat Task
P1
Membuat task dengan mengisi form sesuai dengan ketentuan
Task baru terbuat.
Task baru terbuat.
PASS
TC-AD-009
Membuat Task
P1
Membuat task tanpa mengisi form
Muncul validation message yang mengarahkan Admin untuk mengisi form yang tersedia.
Muncul validation message yang mengarahkan Admin untuk mengisi form yang tersedia.
PASS
TC-AD-010
Mengedit Task
P1
Mengubah data pada form edit task sesuai dengan data terbaru
Task diperbarui sesuai dengan data terbaru.
Task diperbarui sesuai dengan data terbaru.
PASS
TC-AD-011
Menghapus Task
P1
Menghapus task yang sedang berjalan
Task terhapus
Task terhapus
PASS
TC-AD-012
Menghapus Task
P1
Menghapus task kemudian internet terputus
Task gagal terhapus.
Task gagal terhapus.
PASS
TC-AD-013
Nonaktif Task
P1
Me-nonactive kan task yang sedang dikerjakan
Task nonaktif.
Task nonaktif.
PASS
TC-AD-014
Mengaktifkan Task
P1
Mengaktifkan task yang di nonaktifkan
Task aktif.
Task aktif.
PASS
TC-AD-015
Melihat Task Assignment Management
P1
Mengakses task assignment management
Menampilkan tabel task dengan karyawan yang ditugaskan sesuai urutan dari ticket yang ada.
Menampilkan tabel task dengan karyawan yang ditugaskan sesuai urutan dari ticket yang ada.
PASS
TC-AD-016
Task Selesai Dikerjakan
P2
Karyawan telah menyelesaikan Task
Muncul notifikasi task diselesaikan.
Muncul notifikasi task diselesaikan.
PASS
TC-AD-017
Menugaskan Karyawan
P1
Mengisi form penugasan sesuai dengan ketentuan
Karyawan berhasil ditugaskan dan penugasan muncul di tabel.
Karyawan berhasil ditugaskan dan penugasan muncul di tabel.
PASS
TC-AD-018
Menugaskan Karyawan
P1
Menugaskan task ke karyawan
Sistem mengirim notifikasi penugasan pada device karyawan terkait.
Sistem mengirim notifikasi penugasan pada device karyawan terkait.
PASS
TC-AD-019
Menghapus Task Assignment
P1
Menghapus Task Assignment yang sedaang berjalan atau sudah selesai
Task Assignment berhasil terhapus.
Task Assignment berhasil terhapus.
PASS
TC-AD-020
Monitoring Karyawan
P1
Mengakses halaman monitoring
Menampilkan riwayat lokasi karyawan selama melaksanakan tugas.
Menampilkan riwayat lokasi karyawan selama melaksanakan tugas.
PASS
TC-AD-021
Laporan Masuk
P2
Karyawan mengirim laporan untuk Task
Muncul notifikasi laporan baru masuk.
Muncul notifikasi laporan baru masuk.
PASS
TC-AD-022
Melihat Laporan
P1
Mengakses laporan yang telah dikirimkan karyawan
Laporan menampilkan deskripsi, foto, dan mengakses chat.
Laporan menampilkan deskripsi, foto, dan mengakses chat.
PASS
TC-AD-023
Mengirim Pesan
P1
Mengirim pesan
Pesan terkirim.
Pesan terkirim.
PASS
TC-AD-024
Mengirim Pesan
P2
Pesan diterima tetapi device karyawan tidak sedang membuka aplikasi C-Track
Centang satu.
Centang satu.
PASS
TC-AD-025
Mengirim Pesan
P2
Pesan diterima dengan device karyawan sedang membuka aplikasi C-Track
Centang dua.
Centang dua.
PASS
TC-AD-026
Mengirim Pesan
P2
Terdapat pesan baru masuk
Notifikasi pesan baru muncul.
Notifikasi pesan baru muncul.
PASS
TC-AD-027
Mengirim Pesan
P2
Pesan dibaca oleh salah satu karyawan yang bertugas
Centang dua abu-abu.
Centang dua abu-abu.
FAILED
TC-AD-028
Mengirim Pesan
P2
Pesan dibaca oleh semua karyawan yang bertugas
Centang biru.
Centang biru.
PASS
TC-AD-029
Mengirim Pesan
P2
Membalas pesan tertentu
Pesan berhasil terkirim sebagai balasan dan menampilkan referensi terhadap pesan yang dibalas.
Pesan berhasil terkirim sebagai balasan dan menampilkan referensi terhadap pesan yang dibalas.
PASS
TC-AD-030
Mengirim Pesan
P2
Pesan yang telah dikirim diedit
Pesan teredit dan muncul keterangan "diedit" pada pesan.
Pesan teredit dan muncul keterangan "diedit" pada pesan.
PASS
TC-AD-031
Mengirim Pesan
P2
Menghapus pesan yang telah dikirim
Muncul indikator "Pesan ini dihapus" untuk menggantikan isi dari pesan sebelum dihapus.
Muncul indikator "Pesan ini dihapus" untuk menggantikan isi dari pesan sebelum dihapus.
PASS
TC-AD-032
Mengirim Pesan
P3
Karyawan sedang mengetik balasan pada room chat
Indikator "(Nama Karyawan) sedang mengetik..." muncul pada sisi Admin.
Inddikator "(Nama Karyawan) sedang mengetik..." muncul pada sisi Admin.
PASS
TC-AD-033
Mengirim Pesan
P3
Karyawan berhenti mengetik atau mengirim pesan
Indikator typing menghilang.
Indikator typing menghilang.
PASS
TC-AD-034
Membuat Users
P1
Mengisi form user baru sesuai ketentuan dengan role Employee
User baru terbuat.
User baru terbuat.
PASS
TC-AD-035
Membuat Users
P1
Tidak mengisi form pengisian user baru dan langsung menekan tombol 'Add User'
Muncul validation message yang mengarahkan Admin untuk mengisi form yang tersedia.
Muncul validation message yang mengarahkan Admin untuk mengisi form yang tersedia.
PASS
TC-AD-036
Membuat Users
P1
Mengisi form password berbeda dengan confirm password
Muncul notifikasi pop up yang menyatakan bahwa password dan konfirmasi tidak sama.
Muncul notifikasi pop up yang menyatakan bahwa password dan konfirmasi tidak sama.
PASS
TC-AD-037
Membuat Users
P1
Mencoba membuat user dengan role Super Admin dan Admin
Dropdown form hanya memunculkan role employee.
Dropdown form hanya memunculkan role employee.
PASS
TC-AD-038
Edit Users
P1
Mengubah password user
Perubahan disimpan dan password user berubah.
Perubahan disimpan dan password user berubah.
PASS
TC-AD-039
Menghapus User
P1
Menghapus user
User terhapus.
User terhapus.
PASS
TC-AD-040
Menghapus User
P1
Menghapus Super Admin
Data Super Admin tidak dapat dihapus dan tombol aksi dinonaktifkan.
Data Super Admin tidak dapat dihapus dan tombol aksi dinonaktifkan.
PASS
TC-AD-041
Menghapus User
P1
Menghapus user dengan role admin
Data Admin tidak dapat dihapus dan tombol aksi dinonaktifkan.
Data Admin tidak dapat dihapus dan tombol aksi dinonaktifkan.
PASS
TC-AD-042
Nonaktif User
P1
Menonaktifkan user yang sudah tidak digunakan
User dinonaktifkan.
User dinonaktifkan.
PASS
TC-AD-043
Mengaktifkan User
P1
Mengaktifkan user yang dinonaktifkan
User aktif.
User aktif.
PASS
TC-AD-044
AI Assistant
P1
Admin mengirim pertanyaan kepada AI Assistant
Pertanyaan berhasil dikirim dan diproses oleh AI Assistant.
Pertanyaan berhasil dikirim dan diproses oleh AI Assistant.
PASS
TC-AD-045
AI Assistant
P1
AI Assistant meberikan jawaban atas pertanyaan Admin
Jawaban tampil sesuai pertanyaan yang ditanyakan.
Jawaban tampil sesuai pertanyaan yang ditanyakan.
PASS
TC-AD-046
AI Assistant
P1
Admin mengirim pertanyaan lebih dari satu kali dalam satu room chat
AI Assistant tetap memberikan respons untuk setiap pertanyaan.
AI Assistant tetap memberikan respons untuk setiap pertanyaan.
PASS
TC-AD-047
AI Assistant
P2
Riwayat percakapan AI Assistant ditamilkan kembali
Riwayat percakapan tampil sesuai percakapan sebelumnya.
Riwayat percakapan tampil sesuai percakapan sebelumnya.
PASS
TC-AD-048
AI Assistant
P3
AI Assistant sedang memproses pertanyaan
Loading indicator muncul hingga jawaban diterima.
Loading indicator muncul hingga jawaban diterima.
PASS
TC-AD-049
AI Assistant
P3
Admin mengirim pertanyaan yang tidak dikenali
AI Assistant memberikan respons fallback atau pesan yang sesuai.
AI Assistant memberikan respons fallback atau pesan yang sesuai.
PASS
















Eksekusi Pengujian Role Employee
ID
Fitur
Priority
Skenario Pengujian
Expected Result
Actual Result
Status
TC-EM-001
Login
P1
Login menggunakan gmail dan password yang valid
Berhasil masuk ke beranda.
Berhasil masuk ke beranda.
PASS
TC-EM-002
Login
P1
Login menggunakan akun gmail yang tidak terdaftar
Muncul peringatan bahwa email atau password salah.
Muncul peringatan bahwa email atau password salah.
PASS
TC-EM-003
Login
P1
Menginput password yang salah
Muncul peringatan bahwa email atau password salah.
Muncul peringatan bahwa email atau password salah.
PASS
TC-EM-004
Logout
P1
Klik tombol 'Logout'
Berhasil keluar dari sistem.
Berhasil keluar dari sistem.
PASS
TC-EM-005
Melihat Beranda
P1
Mengakses beranda sesuai dengan role
Menampilkan semua tugas yang dikerjakan.
Menampilkan semua tugas yang dikerjakan.
PASS
TC-EM-006
Melihat Beranda
P1
Menerima penugasan
Status tugas berubah menjadi "Aktif".
Status tugas berubah menjadi "Aktif".
PASS
TC-EM-007
Melihat Halaman Laporan
P1
Mengakses daftar tugas yang sedang dan sudah dikerjakan
Menampilkan daftar tugas yang sedang dansudah selesai dikerjakan.
Menampilkan daftar tugas yang sedang dansudah selesai dikerjakan.
PASS
TC-EM-008
Melihat Laporan
P1
Mengakses riwayat laporan yang pernah dikirim
Laporan menampilkan deskripsi, foto, dan mengakses chat sesuai dengan data yang tersimpan.
Laporan menampilkan deskripsi, foto, dan mengakses chat sesuai dengan data yang tersimpan.
PASS
TC-EM-009
Membuat Laporan
P1
Membuat laporan dengan mengisi deskripsi dan mengunggah foto
Laporan terbuat.
Laporan terbuat.
PASS
TC-EM-010
Membuat Laporan
P1
Mengedit laporan yang telah dikirim
Laporan berhasil diperbarui.
Laporan berhasil diperbarui.
PASS
TC-EM-011
Mengirim Pesan
P1
Mengirim pesan
Pesan terkirim.
Pesan terkirim.
PASS
TC-EM-012
Mengirim Pesan
P2
Terdapat pesan baru masuk
Notifikasi pesan baru muncul.
Notifikasi pesan baru muncul.
PASS
TC-EM-013
Mengirim Pesan
P2
Pesan diterima tetapi website C-Track sedang ditutup atau tidak ada jaringan internet
Centang satu.
Centang satu.
PASS
TC-EM-014
Mengirim Pesan
P2
Pesan diterima website C-Track tetapi belum dibaca
Centang dua.
Centang dua.
PASS
TC-EM-015
Mengirim Pesan
P2
Pesan dibaca oleh salah satu dari Super Admin atau Admin
Centang biru.
Centang biru.
PASS
TC-EM-016
Mengirim Pesan
P2
Membalas pesan tertentu
Pesan berhasil terkirim sebagai balasan dan menampilkan referensi terhadap pesan yang dibalas.
Pesan berhasil terkirim sebagai balasan dan menampilkan referensi terhadap pesan yang dibalas.
PASS
TC-EM-017
Mengirim Pesan
P2
Pesan yang telah dikirim diedit
Pesan teredit dan muncul keterangan "diedit" pada pesan.
Pesan teredit dan muncul keterangan "diedit" pada pesan.
PASS
TC-EM-018
Mengirim Pesan
P2
Menghapus pesan yang telah dikirim
Muncul indikator "Pesan ini dihapus" untuk menggantikan isi dari pesan sebelum dihapus.
Muncul indikator "Pesan ini dihapus" untuk menggantikan isi dari pesan sebelum dihapus.
PASS
TC-EM-019
Mengirim Pesan
P3
Super Admin atau Admin sedang mengetik balasan pada room chat
Indikator "(Super Admin / Admin) sedang mengetik..." muncul pada sisi karyawan.
Indikator "(Super Admin / Admin) sedang mengetik..." muncul pada sisi karyawan.
PASS
TC-EM-020
Mengirim Pesan
P3
Super Admin atau Admin berhenti mengetik atau mengirim pesan
Indikator typing menghilang.
Indikator typing menghilang.
PASS
TC-EM-021
Melihat Peta
P1
Mengakses peta
Menampilkan lokasi dimana karyawan sedang berada.
Menampilkan lokasi dimana karyawan sedang berada.
PASS
TC-EM-022
Mengakses Halaman Notifikasi
P1
Mengakses halaman notifikasi
Menampilkan semua notifikasi yang diterima karyawan.
Menampilkan semua notifikasi yang diterima karyawan.
FAILED
TC-EM-023
Menerima Notifikasi
P1
Menerima notifikasi pesan baru masuk
Saat notifikasi di klik, otomatis akan diarahkan ke pesan tersebut.
Saat notifikasi di klik, otomatis akan diarahkan ke pesan tersebut.
PASS
TC-EM-024
Menerima Notifikasi
P1
Menerima notifikasi terdapat tugas baru
Saat notifikasi di klik, otomatis akan diarahkan ke tugas tersebut.
Saat notifikasi di klik, otomatis akan diarahkan ke tugas tersebut.
PASS
TC-EM-025
Menerima Notifikasi
P1
Menerima notifikasi pencapaian
Saat notifikasi di klik, otomatis akan diarahkan ke halaman pencapaian.
Saat notifikasi di klik, otomatis akan diarahkan ke halaman pencapaian.


TC-EM-026
Melihat Pencapaian
P2
Mengakses pencapaian
Pencapaian berhasil di tampilkan.
Pencapaian berhasil di tampilkan.



Kesimpulan
Berdasarkan hasil pengujian yang telah dilakukan, seluruh fitur utama sistem C-Track dapat berjalan sesuai kebutuhan fungsional.
Strategi Demo
Opening (Zaskiya)
Tugas:
Pembuka
Perkenalan Tim
Latar Belakang C-Track
Tujuan C-track
Fitur yang dibuat (Harits Naufal)
Tugas: 
Menjelaskan fitur yang dibuat & dikembangakan
Menjelaskan manfaat fitur
Demo (Hamka & Faiz)
Tugas:
Menjelaskan alur untuk Forum Diskusi
Menjelaskan alur notifikasi
Hasil Testing (Irsyad)
Tugas: 
Menjelaskan metode yang digunakan dalam testing
Menampilkan hasil testing
Closing (Zaskiya)
Tugas:
Kesimpulan 
Penutup
QnA


