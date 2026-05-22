import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import { CHeader, CContainer, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { userService } from '../api/user';
import { User, Plus, ChevronDown, Menu, Home, FileText, Settings } from 'lucide-react';
import { removeCookie } from '../utils/cookies';

// Helper to strip localhost so Vite can proxy the MinIO request
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  return url.replace('http://localhost:9000', '');
};

export default function Header() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNavigationDrawerOpen, setIsNavigationDrawerOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', profile_picture_url: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getNameAndPicture();
        // Defensive mapping to support different API response formats
        setUserData({
          user_name: data.user_name || '',
          profile_picture_url: data.profile_picture_url || ''
        });
      } catch (error) {
        console.error('Failed to fetch user data for header:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const toggleNavigationDrawer = () => {
    setIsNavigationDrawerOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    const logoutPromise = new Promise((resolve) => {
      // Clear the session authentication token cookie
      removeCookie('auth_token');
      setTimeout(resolve, 500);
    });
    
    toast.promise(logoutPromise, {
      loading: 'Logging out...',
      success: 'Successfully logged out!',
      error: 'Failed to logout',
    });

    logoutPromise.then(() => {
      // Prevent back navigation to the dashboard and trigger a full page reload to clear cache
      window.location.replace('/login');
    });
  };

  // Header component implementation

  return (
    <CHeader className="mb-0 border-b border-surface-container px-4 lg:px-8 bg-surface-container-lowest shrink-0 h-16 flex items-center ">
      <CContainer fluid className="flex justify-between items-center px-0 lg:px-4">
        
        {/* Mobile Navigation Drawer Toggle */}
        <button 
          onClick={toggleNavigationDrawer}
          className="!flex lg:!hidden !flex-row !items-center !gap-2 !text-slate-700 !px-4 !py-2.5 !rounded-xl !text-sm !font-bold !transition-all !duration-200 !outline-none !cursor-pointer"
        >
          <Menu size={32} />
        </button>

        {/* Left Side: Search Bar */}
        <div className="hidden lg:flex items-center bg-[#f1f5f9] rounded-xl px-4 py-2.5 w-full max-w-md border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all shadow-sm">
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
        <div className="flex items-center gap-4 lg:gap-5 ml-auto">
          <button 
            onClick={toggleDrawer}
            disabled={isLoading}
            className="rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:mr-4 mr-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {isLoading ? (
              <div className="w-9 h-9 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-[20px] text-primary">progress_activity</span>
              </div>
            ) : userData.profile_picture_url ? (
              <img 
                 src={getProxiedImageUrl(userData.profile_picture_url)} 
                 alt={userData.user_name || "User"} 
                 className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500">
                <User size={18} />
              </div>
            )}
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="material-symbols-outlined animate-spin text-[40px] text-primary mb-4">progress_activity</span>
                <p className="text-sm text-on-surface-variant animate-pulse">Loading identity...</p>
              </div>
            ) : (
              <>
                {userData.profile_picture_url ? (
                  <img 
                    src={getProxiedImageUrl(userData.profile_picture_url)} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-md mb-4" 
                    alt={userData.user_name || "User"} 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-200 shadow-md mb-4 text-slate-500">
                    <User size={48} />
                  </div>
                )}
                <h3 className="text-xl font-bold text-on-surface tracking-tight">{userData.user_name || "Clinician Alex"}</h3>
              </>
            )}
          </div>

          <div className="flex-1">
            {/* Main content area (currently empty, spacing maintained by flex-1) */}
          </div>

          <div className="pt-4 space-y-2">
            <button 
              onClick={() => { navigate('/dashboard/settings'); toggleDrawer(); }} 
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-primary">settings</span>
              Account Settings
            </button>
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

      {/* Navigation Mobile Drawer */}
      <Drawer
        open={isNavigationDrawerOpen}
        onClose={toggleNavigationDrawer}
        direction='left'
        zIndex={9999}
        className='!w-80 border-r border-surface-container bg-surface-container-lowest !z-[99999]'
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-on-surface">Menu</h2>
            <button onClick={toggleNavigationDrawer} className="text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex-1 space-y-2">
            <button 
              onClick={() => { navigate('/dashboard'); toggleNavigationDrawer(); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
            >
              <Home size={18} className="text-primary" />
              <span className="font-bold">Home</span>
            </button>
            <button 
              onClick={() => { navigate('/dashboard/reports'); toggleNavigationDrawer(); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
            >
              <FileText size={18} className="text-primary" />
              <span className="font-bold">Reports</span>
            </button>
            <button 
              onClick={() => { navigate('/dashboard/settings'); toggleNavigationDrawer(); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
            >
              <Settings size={18} className="text-primary" />
              <span className="font-bold">Settings</span>
            </button>
          </div>

          <div className="pt-4 pb-8 mt-auto">
            <button 
              onClick={() => { navigate('/dashboard/reports/new'); toggleNavigationDrawer(); }}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dim text-white p-3 rounded-xl text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 outline-none"
            >
              <Plus size={16} />
              <span>New Report</span>
            </button>
          </div>
        </div>
      </Drawer>
    </CHeader>
  );
}