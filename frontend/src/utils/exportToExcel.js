import * as XLSX from 'xlsx';

/**
 * Utility to export an array of objects to an Excel file
 * @param {Array} data - The array of objects to export
 * @param {String} fileName - The name of the file to save (without .xlsx)
 * @param {String} sheetName - The name of the sheet
 */
export const exportToExcel = (data, fileName, sheetName = 'Sheet1') => {
    // Buat workbook baru
    const wb = XLSX.utils.book_new();
    
    // Konversi JSON (array of objects) ke worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Otomatis menyesuaikan lebar kolom
    const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
    ws['!cols'] = colWidths;

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Download file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
