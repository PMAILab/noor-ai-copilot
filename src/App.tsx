/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Insights from './pages/Insights';
import Inbox from './pages/Inbox';
import Settings from './pages/Settings';
import MarketingPlan from './pages/MarketingPlan';
import SocialMedia from './pages/SocialMedia';
import Reports from './pages/Reports';
import Broadcasts from './pages/Broadcasts';
import CampaignBuilder from './pages/CampaignBuilder';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected Routes inside Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/new" element={<CampaignBuilder />} />
            <Route path="/marketing-plan" element={<MarketingPlan />} />
            <Route path="/social-media" element={<SocialMedia />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/broadcasts" element={<Broadcasts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
