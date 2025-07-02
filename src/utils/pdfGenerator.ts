import html2pdf from "html2pdf.js";

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'resume.pdf',
    quality = 0.98,
    scale = 2
  } = options;

  const pdfOptions = {
    margin: 0,
    filename,
    image: { 
      type: 'jpeg', 
      quality 
    },
    html2canvas: { 
      scale,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true,
      precision: 16
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] 
    }
  };

  try {
    await html2pdf().from(element).set(pdfOptions).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const previewPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<Blob> => {
  const {
    quality = 0.98,
    scale = 2
  } = options;

  const pdfOptions = {
    margin: 0,
    image: { 
      type: 'jpeg', 
      quality 
    },
    html2canvas: { 
      scale,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  try {
    const pdf = await html2pdf().from(element).set(pdfOptions).outputPdf('blob');
    return pdf;
  } catch (error) {
    console.error('PDF preview failed:', error);
    throw new Error('Failed to generate PDF preview.');
  }
};