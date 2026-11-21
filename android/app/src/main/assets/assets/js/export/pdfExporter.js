/**
 * CVForge - PDF Export & Vector Print Engine
 */

export function downloadPdf(elementId = 'cv-preview-content', filename = 'CVForge_Resume.pdf', paperSize = 'letter') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Preview element not found for PDF export');
    return;
  }

  if (window.html2pdf) {
    const isA4 = paperSize === 'a4';
    const opt = {
      margin: isA4 ? [12, 12, 12, 12] : [14, 14, 14, 14],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // 2x DPI for crisp font rendering
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: isA4 ? 'a4' : 'letter',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    if (window.AndroidBridge && typeof window.AndroidBridge.saveAndShareFile === 'function') {
      return window.html2pdf().set(opt).from(element).outputPdf('datauristring').then(pdfUri => {
        const base64 = pdfUri.split(',')[1];
        window.AndroidBridge.saveAndShareFile(base64, filename, 'application/pdf');
      });
    }

    return window.html2pdf().set(opt).from(element).save();
  } else {
    window.print();
  }
}

export function triggerPrint() {
  window.print();
}

export function togglePrintPreview() {
  document.body.classList.toggle('is-print-preview');
  const isPreview = document.body.classList.contains('is-print-preview');
  
  let banner = document.getElementById('print-preview-banner');
  if (isPreview) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'print-preview-banner';
      banner.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-in fade-in duration-200';
      banner.innerHTML = `
        <span>Print Preview Mode (Isolated Document Canvas)</span>
        <button type="button" id="btn-exit-print-preview" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[11px] transition">Exit Preview</button>
      `;
      document.body.appendChild(banner);
      document.getElementById('btn-exit-print-preview').onclick = () => togglePrintPreview();
    }
    banner.classList.remove('hidden');
  } else {
    if (banner) banner.classList.add('hidden');
  }
}
