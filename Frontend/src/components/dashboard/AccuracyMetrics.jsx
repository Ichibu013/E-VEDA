import React from 'react';

const CircularProgress = ({ percentage, colorClass, text, icon }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center flex-1">
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={colorClass}
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-on-surface">
          {percentage}%
        </span>
      </div>
      <span className={`material-symbols-outlined mb-2 ${colorClass}`}>
        {icon}
      </span>
      <p className="text-sm font-bold text-on-surface">{text}</p>
    </div>
  );
};

export default function AccuracyMetrics() {
  const metrics = [
    { id: 1, percentage: 90, colorClass: 'text-[#136ac1]', text: 'Face Accuracy', icon: 'face' },
    { id: 2, percentage: 80, colorClass: 'text-[#156c4d]', text: 'Voice Accuracy', icon: 'mic' },
    { id: 3, percentage: 70, colorClass: 'text-[#6b5dd3]', text: 'Gesture Accuracy', icon: 'waving_hand' },
    { id: 4, percentage: 85, colorClass: 'text-[#4299e1]', text: 'Eye Accuracy', icon: 'visibility' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <CircularProgress
          key={metric.id}
          percentage={metric.percentage}
          colorClass={metric.colorClass}
          text={metric.text}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
