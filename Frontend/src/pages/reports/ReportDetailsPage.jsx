import React from 'react';
import ReportDetailsHeader from './components/details/ReportDetailsHeader';
import EmotionalFluctuations from './components/details/EmotionalFluctuations';
import BiometricAnalysis from './components/details/BiometricAnalysis';
import ReportDetailsFooter from './components/details/ReportDetailsFooter';

export default function ReportDetailsPage() {
  return (
    <>
      <main className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <ReportDetailsHeader />

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Core Insights Panel (Emotional Graph) */}
          <EmotionalFluctuations />

          {/* Biometric & Facial Analysis */}
          <BiometricAnalysis />

        </div>
        {/* Footer Actions */}
        <div>
          <ReportDetailsFooter />
        </div>
      </main>

      
    </>
  );
}
