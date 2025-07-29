import React from 'react';
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Bot, GitCompareArrows, Banknote } from 'lucide-react';
import SmartContractAnalyzer from "../components/web3/SmartContractAnalyzer";
import MEVProtectionDashboard from "../components/web3/MEVProtectionDashboard";
import BridgeMonitor from "../components/web3/BridgeMonitor";
import DeFiRiskAssessor from "../components/web3/DeFiRiskAssessor";

export default function Web3Security() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Web3 Security</h1>
          <p className="text-slate-600">AI-powered protection for decentralized assets, smart contracts, and cross-chain operations.</p>
        </motion.div>
        
        <Tabs defaultValue="smart-contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="smart-contracts">
              <Code className="w-4 h-4 mr-2" />
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="mev-protection">
              <Bot className="w-4 h-4 mr-2" />
              MEV Protection
            </TabsTrigger>
            <TabsTrigger value="bridge-security">
              <GitCompareArrows className="w-4 h-4 mr-2" />
              Bridge Security
            </TabsTrigger>
            <TabsTrigger value="defi-risk">
              <Banknote className="w-4 h-4 mr-2" />
              DeFi Risk
            </TabsTrigger>
          </TabsList>
          <TabsContent value="smart-contracts" className="mt-6">
            <SmartContractAnalyzer />
          </TabsContent>
          <TabsContent value="mev-protection" className="mt-6">
            <MEVProtectionDashboard />
          </TabsContent>
          <TabsContent value="bridge-security" className="mt-6">
            <BridgeMonitor />
          </TabsContent>
          <TabsContent value="defi-risk" className="mt-6">
            <DeFiRiskAssessor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}