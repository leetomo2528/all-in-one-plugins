import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function exportToPDF(content) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = 12;
  const lineHeight = fontSize * 1.2;
  const margin = 50;
  const maxWidth = page.getWidth() / 2 - margin * 2;

  const lines = content.split('\n');
  let y = page.getHeight() - margin;

  for (const line of lines) {
    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth,
    });
    y -= lineHeight;

    if (y < margin) {
      const newPage = pdfDoc.addPage([595.28, 841.89]);
      y = newPage.getHeight() - margin;
    }
  }

  return pdfDoc.save();
}
