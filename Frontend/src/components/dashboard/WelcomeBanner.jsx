import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function WelcomeBanner({ isLoading }) {
  const targetPercent = 85;
  const [currentPercent, setCurrentPercent] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCurrentPercent(targetPercent);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, targetPercent]);

  if (isLoading) {
    return <Skeleton height={200} borderRadius={24} className="shadow-sm" />;
  }

  return (
    <div className="w-full bg-primary text-white rounded-[24px] overflow-hidden relative shadow-md">
      {/* Optional gentle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 pointer-events-none"></div>

      <div className="relative z-10 px-8 py-10 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Content Area */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
            Hello, Srushti Shinde
          </h2>
          <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
            Your emotional intelligence metrics have improved by 12% this week.
            Keep up the consistent check-ins!
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
                alt="Specialist 1"
                className="w-8 h-8 rounded-full border-2 border-primary object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80"
                alt="Specialist 2"
                className="w-8 h-8 rounded-full border-2 border-primary object-cover"
              />
            </div>
            <span className="text-sm font-medium text-white/90">
              Joined by 2 specialists today
            </span>
          </div>
        </div>

        {/* Right Content Area: Daily Goal Progress */}
        <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-7 flex items-center gap-6 border border-white/10 shadow-inner">
          <div className="flex flex-col text-left">
            <span className="text-white/60 text-[11px] font-bold tracking-widest uppercase mb-1">
              Daily Goal
            </span>
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {targetPercent}% Complete
            </span>
          </div>

          <div className="relative flex items-center justify-center w-[72px] h-[72px]">
            <div className="absolute inset-0">
              <CircularProgressbar
                value={currentPercent}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: '#5eead4',
                  trailColor: 'rgba(0,0,0,0.2)',
                  pathTransitionDuration: 1,
                })}
              />
            </div>
            
            {/* Center Checkmark Icon */}
            <div className="relative w-8 h-8 rounded-full border-[2px] border-white flex items-center justify-center bg-transparent z-10">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
