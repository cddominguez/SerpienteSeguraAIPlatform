import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompareArrows, Shield, Network, AlertTriangle, Activity } from "lucide-react";

import BridgeSecurityMonitor from "../components/bridge/BridgeSecurityMonitor";
import CrossChainValidator from "../components/bridge/CrossChainValidator";
import BridgeRiskAssessment from "../components/bridge/BridgeRiskAssessment";
import InteroperabilitySecurityScanner from "../components/bridge/InteroperabilitySecurityScanner";
import CrossChainIncidentResponse from "../components/bridge/CrossChainIncidentResponse";

export default function CrossChainSecurity() {
  const [bridgeData, setBridgeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate loading bridge data
    setTimeout(() => {
      setBridgeData([
        { id: 1, name: "Ethereum-Polygon", status: "secure", volume: "1000 ETH" },
        { id: 2, name: "BSC-Avalanche", status: "monitoring", volume: "500 BNB" }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Cross-Chain Security</h1>
          <p className="text-slate-600">Comprehensive security monitoring and validation for cross-chain bridges and interoperability protocols.</p>
        </motion.div>
        
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="monitor">
              <GitCompareArrows className="w-4 h-4 mr-2" /> Bridge Monitor
            </TabsTrigger>
            <TabsTrigger value="validator">
              <Shield className="w-4 h-4 mr-2" /> Transaction Validator
            </TabsTrigger>
            <TabsTrigger value="risk">
              <AlertTriangle className="w-4 h-4 mr-2" /> Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="scanner">
              <Network className="w-4 h-4 mr-2" /> Security Scanner
            </TabsTrigger>
            <TabsTrigger value="incident">
              <Activity className="w-4 h-4 mr-2" /> Incident Response
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="monitor" className="mt-6">
            <BridgeSecurityMonitor bridgeData={bridgeData} />
          </TabsContent>

          <TabsContent value="validator" className="mt-6">
            <CrossChainValidator />
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <BridgeRiskAssessment bridgeData={bridgeData} />
          </TabsContent>

          <TabsContent value="scanner" className="mt-6">
            <InteroperabilitySecurityScanner />
          </TabsContent>

          <TabsContent value="incident" className="mt-6">
            <CrossChainIncidentResponse />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}