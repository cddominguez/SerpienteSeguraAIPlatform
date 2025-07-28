import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Shield, Zap, BarChart3, Eye } from "lucide-react";

import MEVDetectionEngine from "../components/mev/MEVDetectionEngine";
import MempoolAnalyzer from "../components/mev/MempoolAnalyzer";
import MEVProtectionStrategies from "../components/mev/MEVProtectionStrategies";
import FlashLoanMonitor from "../components/mev/FlashLoanMonitor";
import MEVAnalytics from "../components/mev/MEVAnalytics";

export default function MEVProtection() {
  const [mevData, setMevData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate loading MEV data
    setTimeout(() => {
      setMevData([
        { id: 1, type: "sandwich_attack", profit: "1.2 ETH", blocked: true },
        { id: 2, type: "front_running", profit: "0.8 ETH", blocked: false }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">MEV Protection Suite</h1>
          <p className="text-slate-600">Advanced MEV detection, prevention, and protection strategies for DeFi operations.</p>
        </motion.div>
        
        <Tabs defaultValue="detection" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="detection">
              <Bot className="w-4 h-4 mr-2" /> MEV Detection
            </TabsTrigger>
            <TabsTrigger value="mempool">
              <Eye className="w-4 h-4 mr-2" /> Mempool Monitor
            </TabsTrigger>
            <TabsTrigger value="protection">
              <Shield className="w-4 h-4 mr-2" /> Protection Strategies
            </TabsTrigger>
            <TabsTrigger value="flashloan">
              <Zap className="w-4 h-4 mr-2" /> Flash Loan Monitor
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" /> MEV Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detection" className="mt-6">
            <MEVDetectionEngine mevData={mevData} />
          </TabsContent>

          <TabsContent value="mempool" className="mt-6">
            <MempoolAnalyzer />
          </TabsContent>

          <TabsContent value="protection" className="mt-6">
            <MEVProtectionStrategies />
          </TabsContent>

          <TabsContent value="flashloan" className="mt-6">
            <FlashLoanMonitor />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <MEVAnalytics mevData={mevData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}