import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportsFilterBar from './components/ReportsFilterBar';
import ReportsTable from './components/ReportsTable';
import Pagination from './components/Pagination';
import InsightsSummary from './components/InsightsSummary';

export default function ReportsHistoryPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        <section >
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
              Reports History
            </h2>
            <p className="text-on-surface-variant font-body">
              Review and manage clinical analysis reports across your patient database.
            </p>
          </div>

          {/* Filters Section */}
          <ReportsFilterBar />

          {/* Table of Reports (CoreUI CTable) */}
          <ReportsTable />

          {/* Pagination */}
          {/* <Pagination /> */ /* Assuming you might conditionally render or just render at the bottom */}
          <Pagination />
        </section>

      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/dashboard/reports/new')}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 focus:outline-none"
      >
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
          add
        </span>
      </button>
    </div>
  );
}
