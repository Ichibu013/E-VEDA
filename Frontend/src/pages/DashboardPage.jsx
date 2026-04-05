import React from 'react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <WelcomeBanner />
            
            <div className="rounded-2xl border-2 border-dashed border-surface-container-highest bg-transparent p-16 text-center">
                <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">analytics</span>
                <h3 className="text-xl font-bold text-on-surface mb-1">Blank Canvas</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto">
                    Your CoreUI sidebar layout is ready. You can build your new modules here.
                </p>
            </div>
        </div>
    );
}
