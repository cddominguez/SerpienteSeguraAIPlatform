import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LanguageProvider } from '@/components/utils/LanguageProvider';
import { FeatureFlagProvider } from '@/components/utils/FeatureFlagProvider';
import { DevSecOpsContextProvider } from '@/components/utils/ContextSharingService';
import AppSidebar from '@/components/AppSidebar';
import AICompanion from '@/components/ai/AICompanion';

// Import page components
import Dashboard from './Dashboard';
import ExecutiveDashboard from './ExecutiveDashboard';
import AISecurityCenter from './AISecurityCenter';
import ThreatHunting from './ThreatHunting';
import UserSecurity from './UserSecurity';
import DeviceManagement from './DeviceManagement';
import NetworkSecurity from './NetworkSecurity';
import ComplianceCenter from './ComplianceCenter';
import Web3Security from './Web3Security';
import DataSecurity from './DataSecurity';
import IncidentResponse from './IncidentResponse';
import DevSecOps from './DevSecOps';
import IoTSecurity from './IoTSecurity';
import QuantumSafety from './QuantumSafety';
import TrainingCenter from './TrainingCenter';
import Settings from './Settings';

export default function Pages() {
  return (
    <FeatureFlagProvider>
      <LanguageProvider>
        <DevSecOpsContextProvider>
          <Router>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                    <Route path="/ai-security-center" element={<AISecurityCenter />} />
                    <Route path="/threat-hunting" element={<ThreatHunting />} />
                    <Route path="/user-security" element={<UserSecurity />} />
                    <Route path="/device-management" element={<DeviceManagement />} />
                    <Route path="/network-security" element={<NetworkSecurity />} />
                    <Route path="/compliance-center" element={<ComplianceCenter />} />
                    <Route path="/web3-security" element={<Web3Security />} />
                    <Route path="/data-security" element={<DataSecurity />} />
                    <Route path="/incident-response" element={<IncidentResponse />} />
                    <Route path="/devsecops" element={<DevSecOps />} />
                    <Route path="/iot-security" element={<IoTSecurity />} />
                    <Route path="/quantum-safety" element={<QuantumSafety />} />
                    <Route path="/training-center" element={<TrainingCenter />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
                <AICompanion />
              </SidebarInset>
            </SidebarProvider>
          </Router>
        </DevSecOpsContextProvider>
      </LanguageProvider>
    </FeatureFlagProvider>
  );
}