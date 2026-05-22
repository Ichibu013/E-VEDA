import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarUnfoldableExample } from '../components/SideBar';
import Header from '../components/Header';

// Import CoreUI CSS directly in the layout to ensure the sidebar gets its styles
import '@coreui/coreui/dist/css/coreui.min.css';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface w-full overflow-hidden">
      {/* Fixed CoreUI Sidebar */}
      <div>
        <SidebarUnfoldableExample />
      </div>
      
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* CoreUI Header */}
        <Header />
        
        {/* Scrollable Dashboard Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
