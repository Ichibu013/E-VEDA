import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import ReportDetailsHeader from './components/details/ReportDetailsHeader';
import EmotionalFluctuations from './components/details/EmotionalFluctuations';
import BiometricAnalysis from './components/details/BiometricAnalysis';
import ReportDetailsFooter from './components/details/ReportDetailsFooter';

export default function ReportDetailsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main className="max-w-7xl mx-auto w-full transition-opacity duration-500 ease-in-out opacity-100">
        {/* Header Section */}
        {isLoading ? (
          <Skeleton height={80} borderRadius={16} className="mb-8" />
        ) : (
          <ReportDetailsHeader />
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Core Insights Panel (Emotional Graph) */}
          {isLoading ? (
            <div className="md:col-span-8">
              <Skeleton height={350} borderRadius={24} />
            </div>
          ) : (
            <EmotionalFluctuations />
          )}

          {/* Biometric & Facial Analysis */}
          {isLoading ? (
            <div className="md:col-span-4">
              <Skeleton height={350} borderRadius={24} />
            </div>
          ) : (
            <BiometricAnalysis />
          )}

        </div>
        {/* Footer Actions */}
        <div className="mt-8">
          {isLoading ? (
            <Skeleton height={60} borderRadius={16} />
          ) : (
            <ReportDetailsFooter />
          )}
        </div>
      </main>

      
    </>
  );
}
