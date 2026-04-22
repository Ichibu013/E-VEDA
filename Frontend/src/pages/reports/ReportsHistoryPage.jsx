import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { reportsService } from '../../api/reports';
import ReportsFilterBar from './components/ReportsFilterBar';
import ReportsTable from './components/ReportsTable';
import Pagination from './components/Pagination';

export default function ReportsHistoryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await reportsService.getReports(currentPage);
        setReports(response.data || []);
        setPagination(response.pagination || { current_page: 1, total_pages: 1 });
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [currentPage]);

  return (
    <div className="flex min-h-screen transition-opacity duration-500 ease-in-out opacity-100">
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        <section >
          <div className="mb-10">
            {isLoading ? (
              <Skeleton height={80} borderRadius={16} />
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
                  Reports History
                </h2>
                <p className="text-on-surface-variant font-body">
                  Review and manage clinical analysis reports across your patient database.
                </p>
              </>
            )}
          </div>

          {/* Filters Section */}
          <div className="mb-6">
            {isLoading ? <Skeleton height={60} borderRadius={16} /> : <ReportsFilterBar />}
          </div>

          {/* Table of Reports (CoreUI CTable) */}
          <div className="mb-6">
            {isLoading ? (
              <Skeleton height={400} borderRadius={24} />
            ) : (
              <ReportsTable reports={reports} />
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-end">
            {isLoading ? (
              <Skeleton height={40} borderRadius={16} width={200} />
            ) : (
              <Pagination 
                currentPage={currentPage} 
                totalPages={pagination.total_pages} 
                onPageChange={setCurrentPage} 
              />
            )}
          </div>
        </section>

      </main>

      {/* Floating Action Button */}
      {isLoading ? null : (
        <button 
          onClick={() => navigate('/dashboard/reports/new')}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 focus:outline-none"
        >
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            add
          </span>
        </button>
      )}
    </div>
  );
}
