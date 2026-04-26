import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

export default function ReportDetailsFooter({ report }) {
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    
    const element = document.getElementById('report-content');
    if (!element) {
      setIsPrinting(false);
      toast.error('Report content not found');
      return;
    }

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `report_${report?.report_id || 'details'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const printPromise = html2pdf().set(opt).from(element).save();
    
    toast.promise(printPromise, {
      loading: 'Generating PDF...',
      success: 'PDF generated successfully!',
      error: 'Failed to generate PDF',
    });

    printPromise.finally(() => {
      setIsPrinting(false);
    });
  };

  return (
    <footer className="sticky bottom-[-2rem] w-[calc(100%+4rem)] -ml-8 -mb-8 mt-12 bg-slate-50/90 backdrop-blur-md border-t border-surface-variant/30 py-4 px-8 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <button 
          onClick={() => navigate('/dashboard/reports')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          Return to History
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrint}
            disabled={isPrinting}
            className={`px-6 py-2.5 rounded-xl bg-on-surface text-surface-container-lowest font-bold text-sm transition-all flex items-center gap-2 shadow-xl shadow-on-surface/10 ${isPrinting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
          >
            <span className={`material-symbols-outlined text-lg ${isPrinting ? 'animate-bounce' : ''}`}>
              {isPrinting ? 'hourglass_empty' : 'picture_as_pdf'}
            </span>
            {isPrinting ? 'Processing...' : 'Print PDF'}
          </button>
        </div>
      </div>
    </footer>
  );
}
