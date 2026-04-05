import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilHome, cilFile, cilSettings, cilPlus } from '@coreui/icons'

// Import custom logo
import logoImage from '../assets/bg remove logo.png'

export const SidebarUnfoldableExample = () => {
  const location = useLocation()

  // Helper to dynamically style active tabs
  const getNavItemClass = (path) => {
    const isActive = location.pathname === path;
    // Overriding the default CoreUI active state to match E-VEDA design
    return isActive ? 'bg-primary/10 text-primary border-r-2 border-primary font-semibold rounded-r-md' : '';
  }

  return (
    <CSidebar 
      className="border-end flex flex-col rounded-b-xl top-0 h-screen shrink-0" 
      style={{ position: 'sticky' }}
      position="sticky"
      unfoldable
    >
      <CSidebarHeader className="border-bottom flex items-center justify-center p-0 h-16">
        <CSidebarBrand className="flex items-center justify-center w-full">
          <img src={logoImage} alt="E-VEDA Logo" className="h-10 w-auto object-contain" />
        </CSidebarBrand>
      </CSidebarHeader>
      
      <CSidebarNav>
        <CNavTitle>Dashboard</CNavTitle>
        <CNavItem href="/dashboard" className={getNavItemClass('/dashboard')}>
          <CIcon customClassName="nav-icon" icon={cilHome} /> Home
        </CNavItem>
        
        <CNavItem href="/dashboard/reports" className={getNavItemClass('/dashboard/reports')}>
          <CIcon customClassName="nav-icon" icon={cilFile} /> Reports
        </CNavItem>
        
        <CNavItem href="/dashboard/settings" className={getNavItemClass('/dashboard/settings')}>
          <CIcon customClassName="nav-icon" icon={cilSettings} /> Settings
        </CNavItem>

        <div className="mt-auto"></div>

<div className="py-4">
        <CNavItem href="/dashboard/reports/new" className="bg-primary text-white rounded-xl hover:bg-primary/80 transition-all shadow-md ">
          <CIcon customClassName="nav-icon text-white" icon={cilPlus} /> New Report
        </CNavItem>
</div>
      </CSidebarNav>
    </CSidebar>
  )
}
