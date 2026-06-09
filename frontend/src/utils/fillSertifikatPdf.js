import { PDFDocument, PDFTextField, StandardFonts } from 'pdf-lib';

/**
 * Isi template PDF fillable (AcroForm) dengan data sertifikat, lalu flatten.
 *
 * @param {string} templateUrl URL template PDF
 * @param {Record<string, string>} fieldValues map nama field → nilai teks
 * @returns {Promise<{ bytes: Uint8Array, filledCount: number, totalFields: number }>}
 */
export async function fillSertifikatPdf(templateUrl, fieldValues) {
    const response = await fetch(templateUrl);
    if (!response.ok) {
        throw new Error('Gagal memuat template PDF');
    }

    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const formFields = form.getFields();

    if (formFields.length === 0) {
        throw new Error('PDF tidak memiliki form field (bukan PDF fillable)');
    }

    let filledCount = 0;

    for (const field of formFields) {
        if (!(field instanceof PDFTextField)) {
            continue;
        }

        const name = field.getName();
        const value = fieldValues[name];

        if (value === undefined || value === null) {
            continue;
        }

        field.setText(String(value));
        filledCount++;
    }

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    form.updateFieldAppearances(helvetica);
    form.flatten();

    const bytes = await pdfDoc.save();

    return {
        bytes,
        filledCount,
        totalFields: formFields.length,
    };
}

/**
 * @param {Uint8Array} bytes
 * @param {string} filename
 */
export function downloadPdfBytes(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * @param {Uint8Array} bytes
 * @returns {string} blob URL (caller harus revoke)
 */
export function createPdfBlobUrl(bytes) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
}
