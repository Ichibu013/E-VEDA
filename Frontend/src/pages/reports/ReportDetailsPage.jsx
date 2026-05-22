import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import ReportDetailsHeader from './components/details/ReportDetailsHeader';
import EmotionalFluctuations from './components/details/EmotionalFluctuations';
import BiometricAnalysis from './components/details/BiometricAnalysis';
import ReportDetailsFooter from './components/details/ReportDetailsFooter';
import { apiClient } from '../../api/config';

export default function ReportDetailsPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        // The API expects the ID as a query parameter (e.g., id=#EV-00020)
        // If the URL is /dashboard/reports/%23EV-00020, useParams will decode it to #EV-00020
        const data = await apiClient.get(`/report?id=${encodeURIComponent(id)}`);
        setReport(data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch report details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  return (
    <>
      <main id="report-content" className="max-w-8xl mx-auto w-full transition-opacity duration-500 ease-in-out opacity-100 bg-surface text-on-surface">
        {/* Header Section */}
        {isLoading ? (
          <Skeleton height={80} borderRadius={16} className="mb-8" />
        ) : report ? (
          <ReportDetailsHeader report={report} />
        ) : null}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
          
          {/* Core Insights Panel (Emotional Graph) */}
          {isLoading ? (
            <div className="md:col-span-8">
              <Skeleton height={350} borderRadius={24} />
            </div>
          ) : report ? (
            <EmotionalFluctuations report={report} />
          ) : null}

          {/* Biometric & Facial Analysis */}
          {isLoading ? (
            <div className="md:col-span-4">
              <Skeleton height={350} borderRadius={24} />
            </div>
          ) : report ? (
            <BiometricAnalysis report={report} />
          ) : null}

        </div>
        {/* Footer Actions */}
        <div className="mt-8" data-html2canvas-ignore="true">
          {isLoading ? (
            <Skeleton height={60} borderRadius={16} />
          ) : report ? (
            <ReportDetailsFooter report={report} />
          ) : null}
        </div>
      </main>

      
    </>
  );
}
