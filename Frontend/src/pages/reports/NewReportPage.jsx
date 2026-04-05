import React, { useRef, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'sonner';
import FacialRecognitionFeed from './components/FacialRecognitionFeed';
import VoiceRecognitionFeed from './components/VoiceRecognitionFeed';
import EmotionalStateMetrics from './components/EmotionalStateMetrics';
import DoctorAnalysis from './components/DoctorAnalysis';
import Recommendations from './components/Recommendations';

export default function NewReportPage() {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: 'Generating print layout...',
      success: 'Ready to print!',
      error: 'Failed to generate layout'
    });
    promise.then(() => setIsPrinting(false));
  };

  const handleShare = () => {
    if (isSharing) return;
    setIsSharing(true);
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(promise, {
      loading: 'Generating secure link...',
      success: 'Link copied to clipboard!',
      error: 'Failed to generate link'
    });
    promise.then(() => setIsSharing(false));
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: 'Saving analysis data...',
      success: 'Report saved successfully!',
      error: 'Failed to save report'
    });
    promise.then(() => setIsSaving(false));
  };

  return (
    <div className="flex min-h-screen transition-opacity duration-500 ease-in-out opacity-100">
      <main className="flex-1  mx-auto max-w-screen-2xl">
        {/* Header Section */}
        {isLoading ? (
          <Skeleton height={100} borderRadius={16} className="mb-10" />
        ) : (
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
                    toast.success(`${e.target.files.length} media file(s) added successfully!`);
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
              <button 
                onClick={handlePrint}
                disabled={isPrinting}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/20 font-semibold text-on-surface transition-colors ${isPrinting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-high'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isPrinting ? 'animate-bounce' : ''}`}>{isPrinting ? 'hourglass_empty' : 'print'}</span>
                Print
              </button>
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/20 font-semibold text-on-surface transition-colors ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-high'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isSharing ? 'animate-spin' : ''}`}>{isSharing ? 'progress_activity' : 'share'}</span>
                Share
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold transition-all shadow-md ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dim hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'progress_activity' : 'save'}</span>
                {isSaving ? 'Saving...' : 'Save Report'}
              </button>
            </div>
          </header>
        )}

        {/* Recording Hub & Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Recording Hub (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {isLoading ? (
              <>
                <Skeleton height={400} borderRadius={24} />
                <Skeleton height={200} borderRadius={24} />
              </>
            ) : (
              <>
                <FacialRecognitionFeed />
                <VoiceRecognitionFeed />
              </>
            )}
          </div>

          {/* Right: Metrics & Analysis (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {isLoading ? (
              <>
                <Skeleton height={250} borderRadius={24} />
                <Skeleton height={350} borderRadius={24} />
              </>
            ) : (
              <>
                <EmotionalStateMetrics />
                <DoctorAnalysis />
              </>
            )}
          </div>

        </div>

        {/* Full-Width Recommendations */}
        {isLoading ? (
          <div className="mt-8">
            <Skeleton height={150} borderRadius={24} />
          </div>
        ) : (
          <div className="mt-8">
            <Recommendations />
          </div>
        )}

        {/* Footer Spacer */}
        <div className="h-16" />
      </main>
    </div>
  );
}
