import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportDetailsFooter() {
  const navigate = useNavigate();

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
          <button className="px-6 py-2.5 rounded-xl bg-on-surface text-surface-container-lowest font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xl shadow-on-surface/10">
            <span className="material-symbols-outlined text-lg">
              picture_as_pdf
            </span>
            Print PDF
          </button>
        </div>
      </div>
    </footer>
  );
}
