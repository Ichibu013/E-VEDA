import React, { useState, useEffect } from 'react';

export default function ReportDetailsHeader() {
  const [offset, setOffset] = useState(213.6); // Full circumference (2 * pi * r=34)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(25.6); // Target offset for 88/100
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
          <span className="hover:text-primary cursor-pointer">Sessions</span>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="font-medium text-primary">Session Summary</span>
        </nav>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Srushti Shinde
        </h1>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">
              calendar_today
            </span>
            <span className="text-sm font-medium">Oct 24, 2023</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span className="text-sm font-medium">10:30 AM - 11:15 AM</span>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-low p-1 rounded-3xl flex items-center gap-4 pr-8">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              className="text-surface-container-highest"
              cx={40}
              cy={40}
              fill="transparent"
              r={34}
              stroke="currentColor"
              strokeWidth={6}
            />
            <circle
              className="text-primary transition-all duration-[1500ms] ease-out"
              cx={40}
              cy={40}
              fill="transparent"
              r={34}
              stroke="currentColor"
              strokeDasharray="213.6"
              strokeDashoffset={offset}
              strokeWidth={6}
            />
          </svg>
          <span className="absolute text-2xl font-black text-on-surface">
            88
          </span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-70">
            Wellness Index
          </p>
          <p className="text-lg font-bold text-secondary">Optimal State</p>
        </div>
      </div>
    </div>
  );
}
