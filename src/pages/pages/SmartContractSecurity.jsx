import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Shield, AlertTriangle, FileCode, Zap } from "lucide-react";

import SmartContractAnalyzer from "../components/web3/SmartContractAnalyzer";
import ContractVulnerabilityScanner from "../components/web3/ContractVulnerabilityScanner";
import ContractAuditReports from "../components/web3/ContractAuditReports";
import ContractMonitoring from "../components/web3/ContractMonitoring";
import ContractDeploymentSecurity from "../components/web3/ContractDeploymentSecurity";

export default function SmartContractSecurity() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate loading contract data
    setTimeout(() => {
      setContracts([
        { id: 1, name: "TokenContract", address: "0x1234...", status: "audited" },
        { id: 2, name: "DEXContract", address: "0x5678...", status: "pending" }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Smart Contract Security</h1>
          <p className="text-slate-600">AI-powered smart contract analysis, vulnerability detection, and continuous monitoring.</p>
        </motion.div>
        
        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="analyzer">
              <Code className="w-4 h-4 mr-2" /> AI Analyzer
            </TabsTrigger>
            <TabsTrigger value="scanner">
              <AlertTriangle className="w-4 h-4 mr-2" /> Vulnerability Scanner
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <Shield className="w-4 h-4 mr-2" /> Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="deployment">
              <Zap className="w-4 h-4 mr-2" /> Secure Deployment
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileCode className="w-4 h-4 mr-2" /> Audit Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyzer" className="mt-6">
            <SmartContractAnalyzer contracts={contracts} />
          </TabsContent>

          <TabsContent value="scanner" className="mt-6">
            <ContractVulnerabilityScanner contracts={contracts} />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <ContractMonitoring contracts={contracts} />
          </TabsContent>

          <TabsContent value="deployment" className="mt-6">
            <ContractDeploymentSecurity contracts={contracts} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ContractAuditReports contracts={contracts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}