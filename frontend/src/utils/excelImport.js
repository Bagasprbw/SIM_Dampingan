import * as XLSX from 'xlsx';

export const TEMPLATE_CONFIGS = {
    dampingan: {
        title: 'Template Data Dampingan',
        fileName: 'Template_Import_Dampingan.xlsx',
        headers: [
            'Nama Lengkap',
            'Bidang Dampingan',
            'Jenis Kelamin (L/P)',
            'Tempat Lahir',
            'Tanggal Lahir (YYYY-MM-DD)',
            'Agama',
            'Alamat',
            'No Telp',
            'Pekerjaan'
        ],
        sampleRow: [
            'Budi Santoso',
            'Nelayan',
            'L',
            'Semarang',
            '1995-05-20',
            'Islam',
            'Jl. Merdeka No. 12',
            '081234567890',
            'Nelayan'
        ]
    },
    grup: {
        title: 'Template Data Grup & PJ',
        fileName: 'Template_Import_Grup_Dampingan.xlsx',
        headers: [
            'Nama Grup',
            'Provinsi',
            'Kabupaten',
            'Kecamatan',
            'Bidang Dampingan',
            'Nama PJ',
            'Username PJ',
            'No Telp PJ'
        ],
        sampleRow: [
            'Kelompok Tani Makmur',
            'Jawa Tengah',
            'Sukoharjo',
            'Sukoharjo',
            'Petani, UMKM',
            'Ahmad PJ',
            'pj_tani_makmur',
            '081987654321'
        ]
    },
    fasilitator: {
        title: 'Template Data Fasilitator',
        fileName: 'Template_Import_Fasilitator.xlsx',
        headers: [
            'Nama Lengkap',
            'Username',
            'No Telp',
            'Provinsi',
            'Kabupaten',
            'Kecamatan',
            'Bidang Dampingan'
        ],
        sampleRow: [
            'Siti Aminah',
            'fasil_siti',
            '085678901234',
            'Jawa Tengah',
            'Sukoharjo',
            'Sukoharjo',
            'Nelayan, Petani'
        ]
    },
    admin: {
        title: 'Template Data Admin',
        fileName: 'Template_Import_Admin.xlsx',
        headers: [
            'Nama Lengkap',
            'Username',
            'No Telp',
            'Role',
            'Provinsi',
            'Kabupaten',
            'Kecamatan'
        ],
        sampleRow: [
            'Rudi Admin Kab',
            'admin_kab_rudi',
            '081234599999',
            'admin_kabupaten',
            'Jawa Tengah',
            'Sukoharjo',
            ''
        ]
    }
};

/**
 * Format worksheet dengan wrap text, lebar kolom otomatis, dan style border.
 */
const formatWorksheet = (ws, headers) => {
    // Auto column width
    ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 6, 18) }));

    // Apply alignment & wrapText to all cells
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellAddress]) continue;
            
            if (!ws[cellAddress].s) ws[cellAddress].s = {};
            ws[cellAddress].s.alignment = {
                wrapText: true,
                vertical: 'center',
                horizontal: R === 0 ? 'center' : 'left'
            };
        }
    }
};

/**
 * Generate dan trigger download template Excel.
 * Khusus 'dampingan', me-render sheet dinamis per Grup Dampingan dari database.
 */
export const downloadImportTemplate = (type, grupsList = []) => {
    const config = TEMPLATE_CONFIGS[type];
    if (!config) return;

    const wb = XLSX.utils.book_new();

    if (type === 'dampingan' && grupsList.length > 0) {
        // Buat sheet per Grup Dampingan
        grupsList.forEach((grup) => {
            const sheetName = grup.name.replace(/[:\\/?*\[\]]/g, '').slice(0, 30) || 'Grup';
            const wsData = [
                config.headers,
                config.sampleRow
            ];
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            formatWorksheet(ws, config.headers);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });
    } else {
        // Fallback / Single sheet
        const sheetName = type === 'dampingan' ? 'Data Dampingan' : config.title.replace('Template ', '');
        const wsData = [
            config.headers,
            config.sampleRow
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        formatWorksheet(ws, config.headers);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    XLSX.writeFile(wb, config.fileName);
};

/**
 * Reading & parsing file Excel yang di-upload
 */
export const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array', cellStyles: true });
                const allRows = [];

                workbook.SheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                    jsonRows.forEach((row) => {
                        allRows.push({
                            _sheet: sheetName,
                            ...row
                        });
                    });
                });

                resolve(allRows);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
