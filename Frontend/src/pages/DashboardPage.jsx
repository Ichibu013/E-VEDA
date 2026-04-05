import React from 'react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import EmotionalTrendsChart from '../components/dashboard/EmotionalTrendsChart';
import PatientQuickInfo from '../components/dashboard/PatientQuickInfo';
import EmotionCalculator from '../components/dashboard/EmotionCalculator';
import AccuracyMetrics from '../components/dashboard/AccuracyMetrics';
import AIInsightBanner from '../components/dashboard/AIInsightBanner';

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <WelcomeBanner />

            {/* Main Data View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Span 8) */}
                <div className="lg:col-span-8 flex flex-col">
                    <EmotionalTrendsChart />
                </div>
                
                {/* Right Column (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <PatientQuickInfo />
                    <EmotionCalculator />
                </div>
            </div>

            {/* Circular Progress Metrics */}
            <AccuracyMetrics />
            {/* AI Notification Footer */}
            <AIInsightBanner />
        </div>
    );
}
