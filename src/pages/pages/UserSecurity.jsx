
import React, { useState, useEffect } from "react";
import { UserActivity } from "@/api/entities";
import { UserRiskProfile } from "@/api/entities";
import { AccessPolicy } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Activity, Settings, Brain, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import UserSecurityOverview from "../components/user-security/UserSecurityOverview";
import UserActivityMonitor from "../components/user-security/UserActivityMonitor";
import AdaptiveMFADashboard from "../components/user-security/AdaptiveMFADashboard";
import BehaviorAnalytics from "../components/user-security/BehaviorAnalytics";
import AccessControlManager from "../components/user-security/AccessControlManager";
import ThreatIntelligence from "../components/user-security/ThreatIntelligence";

export default function UserSecurity() {
  const [userActivity, setUserActivity] = useState([]);
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [accessPolicies, setAccessPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserSecurityData();
  }, []);

  const loadUserSecurityData = async () => {
    setIsLoading(true);
    try {
      const [activityData, profilesData, policiesData] = await Promise.all([
        UserActivity.list("-created_date", 100),
        UserRiskProfile.list("-created_date"),
        AccessPolicy.list("-created_date")
      ]);
      setUserActivity(activityData || []);
      setRiskProfiles(profilesData || []);
      setAccessPolicies(policiesData || []);
    } catch (error) {
      console.error("Error loading user security data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-600" />
              User Security & Zero Trust
            </h1>
            <p className="text-slate-600">Advanced user behavior analytics, adaptive authentication, and zero trust access controls</p>
          </div>
        </motion.div>

        <UserSecurityOverview 
          activities={userActivity} 
          policies={accessPolicies}
          riskProfiles={riskProfiles} 
          isLoading={isLoading} 
        />
        
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" /> Activity
            </TabsTrigger>
            <TabsTrigger value="mfa">
              <Shield className="w-4 h-4 mr-2" /> Adaptive MFA
            </TabsTrigger>
            <TabsTrigger value="behavior">
              <Brain className="w-4 h-4 mr-2" /> Behavior Analytics
            </TabsTrigger>
            <TabsTrigger value="access">
              <Settings className="w-4 h-4 mr-2" /> Access Control
            </TabsTrigger>
            <TabsTrigger value="intel">
              <AlertTriangle className="w-4 h-4 mr-2" /> Threat Intel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <UserActivityMonitor 
              userActivity={userActivity} 
              isLoading={isLoading} 
              refreshData={loadUserSecurityData} 
            />
          </TabsContent>

          <TabsContent value="mfa" className="mt-6">
            <AdaptiveMFADashboard 
              activities={userActivity}
              riskProfiles={riskProfiles} 
              isLoading={isLoading} 
              refreshData={loadUserSecurityData} 
            />
          </TabsContent>

          <TabsContent value="behavior" className="mt-6">
            <BehaviorAnalytics 
              userActivity={userActivity} 
              riskProfiles={riskProfiles} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <AccessControlManager 
              policies={accessPolicies} 
              isLoading={isLoading} 
              refreshPolicies={loadUserSecurityData} 
            />
          </TabsContent>

          <TabsContent value="intel" className="mt-6">
            <ThreatIntelligence 
              userActivity={userActivity} 
              riskProfiles={riskProfiles} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
