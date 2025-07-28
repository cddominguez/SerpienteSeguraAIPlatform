
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Code, AlertTriangle, BookOpen, Settings, BarChart3, Brain } from "lucide-react";
import { ComplianceFramework } from "@/api/entities";
import { SecurityControl } from "@/api/entities";
import { AuditLog } from "@/api/entities";
import { DataInventory } from "@/api/entities";
import { ComplianceProfile } from "@/api/entities";
import { ComplianceTask } from "@/api/entities";

import ComplianceOverview from '../components/compliance/ComplianceOverview';
import FrameworkManager from '../components/compliance/FrameworkManager';
import SecurityControls from '../components/compliance/SecurityControls';
import AuditTrail from '../components/compliance/AuditTrail';
import ComplianceReports from '../components/compliance/ComplianceReports';
import DataGovernanceCenter from '../components/client-compliance/DataGovernanceCenter';
import AutomatedComplianceDashboard from '../components/client-compliance/AutomatedComplianceDashboard';
import ComplianceTrainingHub from '../components/compliance/ComplianceTrainingHub';
import ExecutiveComplianceDashboard from '../components/compliance/ExecutiveComplianceDashboard';
import AIRegulatoryIntelligence from '../components/compliance/AIRegulatoryIntelligence';

export default function ComplianceCenter() {
  const [frameworks, setFrameworks] = useState([]);
  const [controls, setControls] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dataInventory, setDataInventory] = useState([]);
  const [complianceProfile, setComplianceProfile] = useState(null);
  const [complianceTasks, setComplianceTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      const [frameworksData, controlsData, auditData, inventoryData, profileData, tasksData] = await Promise.all([
        ComplianceFramework.list("-created_date"),
        SecurityControl.list("-created_date"),
        AuditLog.list("-created_date", 100),
        DataInventory.list("-created_date"),
        ComplianceProfile.list(),
        ComplianceTask.list("-created_date")
      ]);
      setFrameworks(frameworksData || []);
      setControls(controlsData || []);
      setAuditLogs(auditData || []);
      setDataInventory(inventoryData || []);
      setComplianceTasks(tasksData || []);
      
      if (profileData && profileData.length > 0) {
        setComplianceProfile(profileData[0]);
      } else {
        // Create a default profile if none exists, to prevent errors
        setComplianceProfile({
            organization_name: "Default Corp",
            industry: "technology",
            applicable_frameworks: ["SOC2", "ISO 27001"],
            automation_level: 0,
        });
      }
    } catch (error) {
      console.error("Error loading compliance data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-emerald-600" />
            AI-Powered Compliance Center
          </h1>
          <p className="text-slate-600">Centralized compliance management with intelligent automation and continuous monitoring.</p>
        </motion.div>

        <ComplianceOverview 
          frameworks={frameworks} 
          controls={controls} 
          auditLogs={auditLogs} 
          isLoading={isLoading} 
        />
        
        <Tabs defaultValue="executive" className="w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm overflow-x-auto">
            <TabsList className="w-full min-w-max flex bg-transparent gap-1 p-0">
              <TabsTrigger 
                value="executive"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Executive</span>
                <span className="sm:hidden">Exec</span>
              </TabsTrigger>
              <TabsTrigger 
                value="intelligence"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">AI Intelligence</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="frameworks"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Frameworks</span>
                <span className="sm:hidden">Frame</span>
              </TabsTrigger>
              <TabsTrigger 
                value="controls"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Controls</span>
                <span className="sm:hidden">Ctrl</span>
              </TabsTrigger>
              <TabsTrigger 
                value="audit"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Audit Trail</span>
                <span className="sm:hidden">Audit</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
                <span className="sm:hidden">Rep</span>
              </TabsTrigger>
              <TabsTrigger 
                value="data-governance"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Data Gov</span>
                <span className="sm:hidden">Data</span>
              </TabsTrigger>
              <TabsTrigger 
                value="automation"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Automation</span>
                <span className="sm:hidden">Auto</span>
              </TabsTrigger>
              <TabsTrigger 
                value="training"
                className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Training</span>
                <span className="sm:hidden">Train</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="executive" className="mt-0">
              <ExecutiveComplianceDashboard 
                frameworks={frameworks}
                controls={controls}
                auditLogs={auditLogs}
              />
            </TabsContent>

            <TabsContent value="intelligence" className="mt-0">
              <AIRegulatoryIntelligence />
            </TabsContent>

            <TabsContent value="frameworks" className="mt-0">
              <FrameworkManager 
                frameworks={frameworks} 
                isLoading={isLoading} 
                refreshFrameworks={loadComplianceData} 
              />
            </TabsContent>

            <TabsContent value="controls" className="mt-0">
              <SecurityControls 
                controls={controls} 
                frameworks={frameworks}
                isLoading={isLoading} 
                refreshControls={loadComplianceData} 
              />
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <AuditTrail 
                auditLogs={auditLogs} 
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ComplianceReports 
                frameworks={frameworks}
                controls={controls}
                auditLogs={auditLogs}
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="data-governance" className="mt-0">
              <DataGovernanceCenter 
                  dataInventory={dataInventory}
                  profile={complianceProfile}
                  isLoading={isLoading}
                  refreshData={loadComplianceData}
              />
            </TabsContent>

            <TabsContent value="automation" className="mt-0">
              <AutomatedComplianceDashboard 
                profile={complianceProfile}
                tasks={complianceTasks}
                isLoading={isLoading}
                refreshData={loadComplianceData}
              />
            </TabsContent>

            <TabsContent value="training" className="mt-0">
              <ComplianceTrainingHub />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
