import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import { toast } from 'sonner';

export default function SecuritySettings() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordSave = () => {
    setIsSaving(true);
    const savePromise = new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.promise(savePromise, {
      loading: 'Updating password...',
      success: 'Password updated successfully!',
      error: 'Failed to update password',
    });

    savePromise.then(() => {
      setIsSaving(false);
      setIsPasswordModalOpen(false);
    });
  };

  return (
    <>
      <section className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-tertiary-container/10">
          <span className="material-symbols-outlined text-tertiary">security</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Security</h2>
      </div>
      <div className="space-y-4">
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full flex items-center justify-between p-5 rounded-xl bg-surface hover:bg-surface-container-high transition-colors group"
        >
          <span className="font-semibold text-on-surface">Change Password</span>
          <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
        <button className="w-full flex items-center justify-between p-5 rounded-xl bg-surface hover:bg-surface-container-high transition-colors group">
          <span className="font-semibold text-on-surface">Setup 2FA</span>
          <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
        <div className="pt-6">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Last login: 2 hours ago from Mumbai, IN
          </p>
        </div>
      </div>
    </section>

      {/* Change Password Modal */}
      <CModal 
        alignment="center" 
        visible={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
        className="backdrop-blur-sm"
      >
        <CModalHeader className="border-b border-surface-variant/30">
          <CModalTitle className="font-bold text-on-surface text-xl">Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            />
          </div>
        </CModalBody>
        <CModalFooter className="border-t border-surface-variant/30 p-4">
          <button 
            onClick={() => setIsPasswordModalOpen(false)}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl font-bold text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handlePasswordSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl bg-primary text-white font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {isSaving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </CModalFooter>
      </CModal>
    </>
  );
}
