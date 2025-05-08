import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * API endpoint to download a PDF file with an automatically added watermark/header
 * showing the last updated date and current download date
 */
export const GET: RequestHandler = async ({ url, fetch }) => {
  try {
    // Get file path and last updated date from query parameters
    const filePath = url.searchParams.get('file');
    const lastUpdated = url.searchParams.get('lastUpdated');

    if (!filePath) {
      return error(400, 'Missing file parameter');
    }

    if (!lastUpdated) {
      return error(400, 'Missing lastUpdated parameter');
    }

    // Fetch the original PDF (either from public directory or from storage)
    // For simplicity in this mockup, we'll assume PDFs are in the static/files directory
    const fileResponse = await fetch(`/files/${filePath}`);

    if (!fileResponse.ok) {
      return error(404, 'File not found');
    }

    // MOCKUP ONLY: For demonstration purposes, create a new PDF when using placeholder files
    // In a real implementation, we would modify existing PDFs
    const fileContent = await fileResponse.text();
    let pdfDoc;

    // Check if this is one of our placeholder files
    if (fileContent.startsWith('This is a sample placeholder')) {
      // Create a new PDF document with the content
      pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add content from the placeholder file
      page.drawText(fileContent, {
        x: 50,
        y: 700,
        size: 12,
        font,
        maxWidth: 500,
        lineHeight: 16
      });

      // Add a note explaining this is a mockup
      page.drawText('Note: This is a mockup PDF generated for demonstration purposes.', {
        x: 50,
        y: 660,
        size: 10,
        font,
        color: rgb(0.7, 0, 0)
      });
    } else {
      // For real PDFs, load the file
      const pdfBytes = await fileResponse.arrayBuffer();
      pdfDoc = await PDFDocument.load(pdfBytes);
    }

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Embed the default font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;

    // Format dates
    const formattedLastUpdated = new Date(lastUpdated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create watermark text
    const watermarkText = `Last updated: ${formattedLastUpdated} • Downloaded: ${currentDate}`;

    // Calculate text width to center it
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textX = (width - textWidth) / 2;

    // Add the watermark text to the top of the first page
    // We'll add it as a header with some padding from the top
    firstPage.drawText(watermarkText, {
      x: textX,
      y: height - 30, // 30 points from the top
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5) // Gray color
    });

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Return the modified PDF with appropriate headers
    return new Response(modifiedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filePath.split('/').pop()}"`,
        'Content-Length': modifiedPdfBytes.byteLength.toString()
      }
    });
  } catch (err) {
    console.error('Error modifying PDF:', err);
    return error(500, 'Failed to process PDF file');
  }
}; 
