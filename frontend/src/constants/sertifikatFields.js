/**
 * Nama field AcroForm di template PDF fillable.
 * Harus persis sama (case-sensitive) dengan nama field di LibreOffice Writer / Acrobat.
 */
export const SERTIFIKAT_PDF_FIELDS = [
    { name: 'nomor_sertifikat', label: 'Nomor Sertifikat', source: 'sertifikat.nomor_sertifikat' },
    { name: 'nama_peserta', label: 'Nama Peserta', source: 'peserta_kegiatan.nama_peserta / anggota.name' },
    { name: 'judul_kegiatan', label: 'Judul Kegiatan', source: 'kegiatan.judul' },
    { name: 'tanggal_kegiatan', label: 'Tanggal Kegiatan', source: 'kegiatan.tanggal (format: 8 Juni 2026)' },
    { name: 'tempat_kegiatan', label: 'Tempat Kegiatan', source: 'kegiatan.lokasi' },
    { name: 'bidang_dampingan', label: 'Bidang Dampingan', source: 'bidang.name' },
    { name: 'level_kegiatan', label: 'Level Kegiatan', source: 'level_kegiatan.nama_level' },
    { name: 'provinsi', label: 'Provinsi', source: 'provinsi.name' },
    { name: 'kabupaten_kota', label: 'Kabupaten/Kota', source: 'kabupaten.name' },
    { name: 'kecamatan', label: 'Kecamatan', source: 'kecamatan.name' },
    { name: 'tanggal_terbit', label: 'Tanggal Terbit', source: 'sertifikat.diterbitkan_at' },
];

/** Alias opsional untuk template lama */
export const SERTIFIKAT_PDF_FIELD_ALIASES = [
    { name: 'nama_kegiatan', mapsTo: 'judul_kegiatan' },
    { name: 'lokasi_kegiatan', mapsTo: 'tempat_kegiatan' },
    { name: 'nama_fasilitator', mapsTo: 'kegiatan.fasilitator.name' },
];
