import React, { useState, useEffect } from "react";
import { ComplianceProfile } from "@/api/entities";
import { ComplianceTask } from "@/api/entities";
import { DataInventory } from "@/api/entities";
import { ConsentRecord } from "@/api/entities";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Database, FileCheck, Settings, BarChart3 } from "lucide-react";

import ComplianceOnboarding from "../components/client-compliance/ComplianceOnboarding";
import AutomatedComplianceDashboard from "../components/client-compliance/AutomatedComplianceDashboard";
import DataGovernanceCenter from "../components/client-compliance/DataGovernanceCenter";
import ConsentManagement from "../components/client-compliance/ConsentManagement";
import ComplianceAutomation from "../components/client-compliance/ComplianceAutomation";
import RiskAssessmentSuite from "../components/client-compliance/RiskAssessmentSuite";

export default function ClientCompliance() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dataInventory, setDataInventory] = useState([]);
  const [consents, setConsents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [profileData, tasksData, inventoryData, consentsData] = await Promise.all([
      ComplianceProfile.list(),
      ComplianceTask.list("-due_date"),
      DataInventory.list("-created_date"),
      ConsentRecord.list("-consent_date")
    ]);
    
    setProfile(profileData[0] || null);
    setTasks(tasksData);
    setDataInventory(inventoryData);
    setConsents(consentsData);
    setIsLoading(false);
  };

  if (!profile) {
    return <ComplianceOnboarding onComplete={loadData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Compliance Management</h1>
          <p className="text-slate-600">AI-powered compliance automation for {profile.organization_name}</p>
        </motion.div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="data-governance">
              <Database className="w-4 h-4 mr-2" /> Data Governance
            </TabsTrigger>
            <TabsTrigger value="consent">
              <Users className="w-4 h-4 mr-2" /> Consent Mgmt
            </TabsTrigger>
            <TabsTrigger value="automation">
              <Settings className="w-4 h-4 mr-2" /> Automation
            </TabsTrigger>
            <TabsTrigger value="risk-assessment">
              <Shield className="w-4 h-4 mr-2" /> Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileCheck className="w-4 h-4 mr-2" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <AutomatedComplianceDashboard 
              profile={profile} 
              tasks={tasks} 
              isLoading={isLoading} 
              refreshData={loadData}
            />
          </TabsContent>

          <TabsContent value="data-governance" className="mt-6">
            <DataGovernanceCenter 
              dataInventory={dataInventory} 
              profile={profile}
              isLoading={isLoading} 
              refreshData={loadData}
            />
          </TabsContent>

          <TabsContent value="consent" className="mt-6">
            <ConsentManagement 
              consents={consents} 
              profile={profile}
              isLoading={isLoading} 
              refreshData={loadData}
            />
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <ComplianceAutomation 
              tasks={tasks} 
              profile={profile}
              isLoading={isLoading} 
              refreshData={loadData}
            />
          </TabsContent>

          <TabsContent value="risk-assessment" className="mt-6">
            <RiskAssessmentSuite 
              profile={profile} 
              dataInventory={dataInventory}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="text-center py-16">
              <FileCheck className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">Automated Compliance Reports</h2>
              <p className="text-slate-500 max-w-2xl mx-auto mt-2">
                AI-generated compliance reports for all applicable frameworks are automatically prepared and available for download.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}