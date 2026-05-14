import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgress = ({ percentage, color, text, icon }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center flex-1">
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        <div className="absolute inset-0">
          <CircularProgressbar
            value={currentPercentage}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: color,
              trailColor: '#f1f5f9',
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        <span className="relative z-10 text-sm font-extrabold text-on-surface">
          {percentage}%
        </span>
      </div>
      <span className="material-symbols-outlined mb-2" style={{ color }}>
        {icon}
      </span>
      <p className="text-sm font-bold text-on-surface">{text}</p>
    </div>
  );
};

export default function AccuracyMetrics({ isLoading }) {
  const metrics = [
    { id: 1, percentage: 92.2, color: '#136ac1', text: 'Face Accuracy', icon: 'face' },
    { id: 2, percentage: 86.1, color: '#156c4d', text: 'Voice Accuracy', icon: 'mic' },
    { id: 3, percentage: 93.4, color: '#6b5dd3', text: 'Gesture Accuracy', icon: 'waving_hand' },
    { id: 4, percentage: 91.1, color: '#4299e1', text: 'Eye Accuracy', icon: 'visibility' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={200} borderRadius={24} className="shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <CircularProgress
          key={metric.id}
          percentage={metric.percentage}
          color={metric.color}
          text={metric.text}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
