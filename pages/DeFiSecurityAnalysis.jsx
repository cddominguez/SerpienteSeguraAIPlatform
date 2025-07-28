import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, BarChart3, AlertTriangle, TrendingUp, Shield } from "lucide-react";

import DeFiProtocolAnalyzer from "../components/defi/DeFiProtocolAnalyzer";
import LiquidityPoolMonitor from "../components/defi/LiquidityPoolMonitor";
import DeFiRiskScoring from "../components/defi/DeFiRiskScoring";
import YieldFarmingSecurity from "../components/defi/YieldFarmingSecurity";
import DeFiGovernanceAnalysis from "../components/defi/DeFiGovernanceAnalysis";

export default function DeFiSecurityAnalysis() {
  const [protocolData, setProtocolData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate loading DeFi protocol data
    setTimeout(() => {
      setProtocolData([
        { id: 1, name: "Uniswap V3", tvl: "$2.1B", riskScore: 85 },
        { id: 2, name: "Compound", tvl: "$1.8B", riskScore: 92 }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">DeFi Security Analysis</h1>
          <p className="text-slate-600">Comprehensive risk assessment and security analysis for DeFi protocols, liquidity pools, and yield farming strategies.</p>
        </motion.div>
        
        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="analyzer">
              <Banknote className="w-4 h-4 mr-2" /> Protocol Analyzer
            </TabsTrigger>
            <TabsTrigger value="liquidity">
              <BarChart3 className="w-4 h-4 mr-2" /> Liquidity Monitor
            </TabsTrigger>
            <TabsTrigger value="risk">
              <AlertTriangle className="w-4 h-4 mr-2" /> Risk Scoring
            </TabsTrigger>
            <TabsTrigger value="yield">
              <TrendingUp className="w-4 h-4 mr-2" /> Yield Farming
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Shield className="w-4 h-4 mr-2" /> Governance Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyzer" className="mt-6">
            <DeFiProtocolAnalyzer protocolData={protocolData} />
          </TabsContent>

          <TabsContent value="liquidity" className="mt-6">
            <LiquidityPoolMonitor />
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <DeFiRiskScoring protocolData={protocolData} />
          </TabsContent>

          <TabsContent value="yield" className="mt-6">
            <YieldFarmingSecurity />
          </TabsContent>

          <TabsContent value="governance" className="mt-6">
            <DeFiGovernanceAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}