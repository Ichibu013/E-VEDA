import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import PersonalProfile from './components/PersonalProfile';
import SecuritySettings from './components/SecuritySettings';
import WellnessPreferences from './components/WellnessPreferences';
import HealthPrivacy from './components/HealthPrivacy';
import { userService } from '../../api/user';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    nickname: '',
    age: '',
    gender: '', // Added for UI consistency
    height: '',
    weight: '',
    profile_picture: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfileData({
          ...profileData,
          ...data,
          // Ensure fields are strings for input handling
          age: data.age?.toString() || '',
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          gender: data.gender || ''
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const updatePromise = userService.updateProfile({
        name: profileData.name,
        nickname: profileData.nickname,
        age: parseInt(profileData.age) || 0,
        height: parseInt(profileData.height) || 0,
        weight: parseFloat(profileData.weight) || 0,
        gender: profileData.gender
      });
      
      toast.promise(updatePromise, {
        loading: 'Saving preferences...',
        success: 'Preferences saved successfully!',
        error: (err) => err.message || 'Failed to save preferences',
      });

      await updatePromise;
    } catch (error) {
      // toast.promise handles the UI
    } finally {
      setIsSaving(false);
    }
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
             <PersonalProfile 
               data={profileData} 
               onChange={handleProfileChange}
               isSaving={isSaving}
             />
            <SecuritySettings />
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
