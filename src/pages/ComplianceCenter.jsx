import React, { useState, useEffect } from 'react';
import { ComplianceFramework, SecurityControl, AuditLog, ComplianceProfile } from '@/api/entities';
import ComplianceOverview from '@/components/compliance/ComplianceOverview';
import FrameworkManager from '@/components/compliance/FrameworkManager';
import SecurityControls from '@/components/compliance/SecurityControls';
import AuditTrail from '@/components/compliance/AuditTrail';
import ComplianceReports from '@/components/compliance/ComplianceReports';
import ComplianceTrainingHub from '@/components/compliance/ComplianceTrainingHub';
import ExecutiveComplianceDashboard from '@/components/compliance/ExecutiveComplianceDashboard';
import AIRegulatoryIntelligence from '@/components/compliance/AIRegulatoryIntelligence';

export default function ComplianceCenter() {
  const [frameworks, setFrameworks] = useState([]);
  const [controls, setControls] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      const [frameworksData, controlsData, auditData, profileData] = await Promise.all([
        ComplianceFramework.list('-created_date', 20),
        SecurityControl.list('-created_date', 50),
        AuditLog.list('-created_date', 100),
        ComplianceProfile.list('-created_date', 1)
      ]);
      
      setFrameworks(frameworksData);
      setControls(controlsData);
      setAuditLogs(auditData);
      setProfile(profileData[0] || null);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Compliance Center
          </h1>
          <p className="text-slate-600">
            Comprehensive compliance management and reporting
          </p>
        </div>

        {/* Compliance Overview */}
        <ComplianceOverview
          frameworks={frameworks}
          controls={controls}
          auditLogs={auditLogs}
          isLoading={isLoading}
        />

        {/* Executive Dashboard */}
        <ExecutiveComplianceDashboard
          frameworks={frameworks}
          controls={controls}
          auditLogs={auditLogs}
        />

        {/* Framework Management */}
        <FrameworkManager
          frameworks={frameworks}
          isLoading={isLoading}
          refreshFrameworks={loadComplianceData}
        />

        {/* Security Controls */}
        <SecurityControls
          controls={controls}
          isLoading={isLoading}
          refreshData={loadComplianceData}
        />

        {/* AI Regulatory Intelligence */}
        <AIRegulatoryIntelligence />

        {/* Training Hub */}
        <ComplianceTrainingHub />

        {/* Audit Trail */}
        <AuditTrail
          auditLogs={auditLogs}
          isLoading={isLoading}
        />

        {/* Reports */}
        <ComplianceReports
          frameworks={frameworks}
          controls={controls}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}