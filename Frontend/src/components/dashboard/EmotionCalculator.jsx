import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

export default function EmotionCalculator({ isLoading }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Skeleton height={280} borderRadius={24} className="shadow-sm" />;
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex-1 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-headline text-on-surface">Emotion Calculator</h3>
        <span className="material-symbols-outlined text-primary" data-icon="calculate">calculate</span>
      </div>

      <div className="space-y-6 mt-auto">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-on-surface">Happy</span>
            <span className="text-secondary">92%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: animated ? "92%" : "0%" }} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-on-surface">Sad</span>
            <span className="text-red-500">52%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#A84B42] rounded-full transition-all duration-1000 ease-out" 
              style={{ width: animated ? "52%" : "0%" }} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-on-surface">Nervous</span>
            <span className="text-primary">38%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: animated ? "38%" : "0%" }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
