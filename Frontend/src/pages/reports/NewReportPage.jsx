import React, { useRef } from 'react';
import FacialRecognitionFeed from './components/FacialRecognitionFeed';
import VoiceRecognitionFeed from './components/VoiceRecognitionFeed';
import EmotionalStateMetrics from './components/EmotionalStateMetrics';
import DoctorAnalysis from './components/DoctorAnalysis';
import Recommendations from './components/Recommendations';

export default function NewReportPage() {
  const fileInputRef = useRef(null);

  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1  mx-auto max-w-screen-2xl">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight font-headline">
              New Analysis
            </h1>
            <p className="text-on-surface-variant font-body mt-2 text-lg">
              Patient: <span className="font-semibold text-primary">Srushti Deshpande</span> • Case #EV-9921
            </p>
          </div>
          <div className="flex gap-3 mb-3">
            {/* Hidden Input for Media Files */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/*,audio/*" 
              multiple 
              onChange={(e) => {
                if (e.target.files.length) {
                  // For actual implementation, this would handle the file upload array
                  console.log("Media files selected:", e.target.files);
                }
              }}
            />
            <button 
              onClick={handleAddMediaClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/20 font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              Add Media
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/20 font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[20px]">print</span>
              Print
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/20 font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[20px]">share</span>
              Share
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dim transition-all shadow-md">
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Report
            </button>
          </div>
        </header>

        {/* Recording Hub & Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Recording Hub (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <FacialRecognitionFeed />
            <VoiceRecognitionFeed />
          </div>

          {/* Right: Metrics & Analysis (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <EmotionalStateMetrics />
            <DoctorAnalysis />
          </div>

        </div>

        {/* Full-Width Recommendations */}
        <Recommendations />

        {/* Footer Spacer */}
        <div className="h-16" />
      </main>
    </div>
  );
}
