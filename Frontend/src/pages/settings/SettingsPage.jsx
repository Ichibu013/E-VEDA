import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import PersonalProfile from './components/PersonalProfile';
import SecuritySettings from './components/SecuritySettings';
import WellnessPreferences from './components/WellnessPreferences';
import HealthPrivacy from './components/HealthPrivacy';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    
    const savePromise = new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.promise(savePromise, {
      loading: 'Saving preferences...',
      success: 'Preferences saved successfully!',
      error: 'Failed to save preferences',
    });

    savePromise.then(() => {
      setIsSaving(false);
    });
  };

  return (
    <div className="w-full transition-opacity duration-500 ease-in-out opacity-100">
      <header className="mb-12">
        {isLoading ? (
          <Skeleton height={100} borderRadius={16} />
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
              Account Settings
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-lg font-body leading-relaxed">
              Manage your personal health profile, security preferences, and data
              privacy to ensure your digital sanctuary remains yours.
            </p>
          </>
        )}
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {isLoading ? (
          <>
            <div className="md:col-span-8"><Skeleton height={400} borderRadius={24} /></div>
            <div className="md:col-span-4"><Skeleton height={400} borderRadius={24} /></div>
            <div className="md:col-span-4"><Skeleton height={400} borderRadius={24} /></div>
            <div className="md:col-span-8"><Skeleton height={400} borderRadius={24} /></div>
          </>
        ) : (
          <>
            <PersonalProfile />
            <SecuritySettings />
            <WellnessPreferences />
            <HealthPrivacy />
          </>
        )}
      </div>

      <div className="mt-16 flex flex-col sm:flex-row justify-end gap-4 border-t border-surface-variant pt-10">
        {isLoading ? (
          <Skeleton height={60} width={350} borderRadius={16} />
        ) : (
          <>
            <button 
              onClick={() => toast('Are you sure you want to discard changes?', {
                action: {
                  label: 'Discard',
                  onClick: () => toast.error('Changes discarded')
                },
                cancel: {
                  label: 'Cancel',
                  onClick: () => {}
                }
              })}
              className="px-10 py-4 rounded-xl border border-outline-variant font-bold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Discard changes
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-10 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-xl shadow-primary/25 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  Saving...
                </span>
              ) : 'Save All Preferences'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
