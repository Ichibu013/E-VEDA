import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

import DashboardLayout from './layouts/DashboardLayout';
import NewReportPage from './pages/reports/NewReportPage';
import ReportsHistoryPage from './pages/reports/ReportsHistoryPage';
import ReportDetailsPage from './pages/reports/ReportDetailsPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Layout handles the side-by-side view and animations */}
        <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Dashboard Layout with CoreUI Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsHistoryPage />} />
          <Route path="reports/new" element={<NewReportPage />} />
          <Route path="reports/:id" element={<ReportDetailsPage />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
