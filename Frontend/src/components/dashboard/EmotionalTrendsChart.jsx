import React from 'react';
import { CChart } from '@coreui/react-chartjs';
import Skeleton from 'react-loading-skeleton';

export default function EmotionalTrendsChart({ isLoading, trendsData = [] }) {
  if (isLoading) {
    return <Skeleton height={350} borderRadius={24} className="shadow-sm" />;
  }

  // Configuration for each emotion with a premium palette
  const emotionConfig = {
    joy: { color: '#136ac1', bg: '#dbeafe', label: 'Joy' },
    anger: { color: '#ef4444', bg: '#fee2e2', label: 'Anger' },
    sadness: { color: '#8b5cf6', bg: '#ede9fe', label: 'Sadness' },
    fear: { color: '#f59e0b', bg: '#fef3c7', label: 'Fear' },
    surprise: { color: '#10b981', bg: '#d1fae5', label: 'Surprise' },
    disgust: { color: '#64748b', bg: '#f1f5f9', label: 'Disgust' },
  };

  // Process data to find the dominant emotion for each day
  const processedData = (trendsData || []).map(dayData => {
    const emotions = ['joy', 'anger', 'sadness', 'fear', 'surprise', 'disgust'];
    let dominantEmotion = 'joy';
    let maxValue = -1;

    emotions.forEach(emotion => {
      if (dayData[emotion] > maxValue) {
        maxValue = dayData[emotion];
        dominantEmotion = emotion;
      }
    });

    return {
      dayLabel: dayData.day.toUpperCase(),
      value: maxValue,
      config: emotionConfig[dominantEmotion]
    };
  });

  const dataMax = processedData.length > 0 ? Math.max(...processedData.map(d => d.value)) : 100;
  const displayMax = Math.max(dataMax * 1.2, 50); // Ensure at least 50 for scale, and 20% breathing room

  const data = {
    labels: processedData.length > 0 ? processedData.map(d => d.dayLabel) : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    datasets: [
      {
        label: 'Emotional Intensity',
        data: processedData.length > 0 ? processedData.map(d => d.value) : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: processedData.map(d => d.config.bg),
        borderColor: processedData.map(d => d.config.color),
        borderWidth: { top: 4, right: 0, bottom: 0, left: 0 },
        barPercentage: 0.5, // Slightly thinner bars to make them feel more distinct
        categoryPercentage: 0.8,
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 }, // More pronounced rounding
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        yAlign: 'bottom',
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            const emotionName = processedData[index]?.config.label || '';
            const val = context.parsed.y;
            return [`Dominant: ${emotionName}`, `Intensity: ${val}`];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '700'
          },
          color: '#64748b',
          padding: 10
        }
      },
      y: {
        display: false, 
        min: 0,
        max: displayMax, // Dynamic max to make heights more distinct
      },
    },
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col h-full">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-1">Emotional Trends</h2>
          <p className="text-sm font-medium text-on-surface-variant/80">Real-time sentiment analysis over the last 7 days</p>
        </div>
        
        {/* Legend - Detailed for every emotion */}
        <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          {Object.entries(emotionConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 px-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[250px]">
        <CChart
          type="bar"
          data={data}
          options={options}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
