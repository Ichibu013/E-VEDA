import React, { useState, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import EmotionalTrendsChart from '../components/dashboard/EmotionalTrendsChart';
import PatientQuickInfo from '../components/dashboard/PatientQuickInfo';
import EmotionCalculator from '../components/dashboard/EmotionCalculator';
import AccuracyMetrics from '../components/dashboard/AccuracyMetrics';
import AIInsightBanner from '../components/dashboard/AIInsightBanner';
import { userService } from '../api/user';
import { aiService } from '../api/ai';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [completionData, setCompletionData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [trendsData, setTrendsData] = useState([]);
    const [insightData, setInsightData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [completion, profile, trends, insight] = await Promise.all([
                    userService.getCompletionStatus(),
                    userService.getProfile(),
                    aiService.getTrends(),
                    aiService.getInsights()
                ]);
                setCompletionData(completion);
                setProfileData(profile);
                setTrendsData(trends);
                setInsightData(insight);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-8xl mx-auto space-y-8 transition-opacity duration-500 ease-in-out opacity-100">
            {!isLoading && completionData && !completionData.isComplete && (
                <WelcomeBanner 
                    isLoading={isLoading} 
                    userName={completionData.user_name}
                    completionPercentage={completionData.completion_percentage}
                />
            )}
            {isLoading && <WelcomeBanner isLoading={true} />}

            {/* Main Data View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Span 8) */}
                <div className="lg:col-span-8 flex flex-col">
                    <EmotionalTrendsChart isLoading={isLoading} trendsData={trendsData} />
                </div>
                
                {/* Right Column (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <PatientQuickInfo 
                        isLoading={isLoading} 
                        data={profileData}
                    />
                    <EmotionCalculator isLoading={isLoading} />
                </div>
            </div>

            {/* Circular Progress Metrics */}
            <AccuracyMetrics isLoading={isLoading} />
            {/* AI Notification Footer */}
            <AIInsightBanner isLoading={isLoading} insightData={insightData} />
        </div>
    );
}

