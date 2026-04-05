import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CHeader, CContainer } from '@coreui/react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    const logoutPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.promise(logoutPromise, {
      loading: 'Logging out...',
      success: 'Successfully logged out!',
      error: 'Failed to logout',
    });

    logoutPromise.then(() => {
      navigate('/login');
    });
  };

  return (
    <CHeader className="mb-0 border-b border-surface-container px-8 bg-surface-container-lowest shrink-0 h-16 flex items-center ">
      <CContainer fluid className="flex justify-between items-center px-4">
        
        {/* Left Side: Search Bar */}
        <div className="flex items-center bg-[#f1f5f9] rounded-xl px-4 py-2.5 w-full max-w-md border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all shadow-sm">
          <svg 
            className="w-5 h-5 text-slate-500 mr-2 shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search patient data..." 
            className="bg-transparent border-none outline-none w-full text-slate-700 text-sm placeholder:text-slate-500"
          />
        </div>

        {/* Right Side: Actions & Avatar */}
        <div className="flex items-center gap-4 lg:gap-5">
          <button className="text-slate-500 hover:text-primary transition-colors flex items-center justify-center outline-none">
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <button className="text-slate-500 hover:text-primary transition-colors flex items-center justify-center outline-none">
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button 
            onClick={toggleDrawer}
            className="rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mr-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img 
               src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" 
               alt="User Avatar" 
               className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          </button>
        </div>

      </CContainer>

      {/* User Information Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction='right'
        zIndex={9999}
        className='!w-80 border-l border-surface-container bg-surface-container-lowest !z-[99999]'
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-on-surface">Profile</h2>
            <button onClick={toggleDrawer} className="text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-8">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-md mb-4" alt="Doctor" />
            <h3 className="text-lg font-bold text-on-surface tracking-tight">Clinician Alex</h3>
            <p className="text-sm text-on-surface-variant font-medium">Head of Neurology</p>
            <span className="mt-3 px-4 py-1.5 bg-primary/10 text-primary font-bold text-[11px] uppercase tracking-wider rounded-full">Pro Account</span>
          </div>

          <div className="flex-1 space-y-2">
            <button onClick={() => { navigate('/dashboard/settings'); toggleDrawer(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm">
              <span className="material-symbols-outlined text-primary">settings</span>
              Account Settings
            </button>
          </div>

          <div className="pt-4 border-t border-surface-container">
            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors ${isLoggingOut ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isLoggingOut ? 'animate-spin' : ''}`}>
                {isLoggingOut ? 'progress_activity' : 'logout'}
              </span>
              {isLoggingOut ? 'Logging out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </Drawer>
    </CHeader>
  );
}
