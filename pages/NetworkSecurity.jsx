
import React, { useState, useEffect } from "react";
import { FirewallRule } from "@/api/entities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Wifi, ShieldCheck, Eye, FileText, Globe, Crosshair } from "lucide-react";

import NetworkStats from "../components/network/NetworkStats";
import RealtimeTrafficChart from "../components/network/RealtimeTrafficChart";
import IDSLog from "../components/network/IDSLog";
import FirewallManager from "../components/network/FirewallManager";
import AutomatedPenetrationTesting from "../components/offensive/AutomatedPenetrationTesting";

import RealTimeVisitorMonitor from "../components/network/RealTimeVisitorMonitor";
import VisitorAuditTrail from "../components/network/VisitorAuditTrail";
import ThreatIntelligencePanel from "../components/network/ThreatIntelligencePanel";

export default function NetworkSecurity() {
  const [firewallRules, setFirewallRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFirewallRules();
  }, []);

  const loadFirewallRules = async () => {
    setIsLoading(true);
    const rules = await FirewallRule.list();
    setFirewallRules(rules);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Network Security</h1>
          <p className="text-slate-600">Unified network defense, monitoring, and real-time visitor analysis</p>
        </motion.div>

        <NetworkStats rules={firewallRules} />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="overview">
              <ShieldCheck className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="visitors">
              <Eye className="w-4 h-4 mr-2" /> Visitors
            </TabsTrigger>
            <TabsTrigger value="audit">
              <FileText className="w-4 h-4 mr-2" /> Audit Trail
            </TabsTrigger>
            <TabsTrigger value="threat-intel">
              <Globe className="w-4 h-4 mr-2" /> Threat Intel
            </TabsTrigger>
            <TabsTrigger value="firewall">
              <Wifi className="w-4 h-4 mr-2" /> Firewall
            </TabsTrigger>
            <TabsTrigger value="offensive">
              <Crosshair className="w-4 h-4 mr-2" /> Offensive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RealtimeTrafficChart />
              </div>
              <div>
                <IDSLog />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visitors" className="mt-6">
            <RealTimeVisitorMonitor />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <VisitorAuditTrail />
          </TabsContent>

          <TabsContent value="threat-intel" className="mt-6">
            <ThreatIntelligencePanel />
          </TabsContent>

          <TabsContent value="firewall" className="mt-6">
            <FirewallManager 
              initialRules={firewallRules} 
              isLoading={isLoading}
              refreshRules={loadFirewallRules}
            />
          </TabsContent>
          
          <TabsContent value="offensive" className="mt-6">
            <AutomatedPenetrationTesting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
