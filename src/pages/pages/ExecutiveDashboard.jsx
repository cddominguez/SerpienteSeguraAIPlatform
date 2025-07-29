
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Briefcase, RefreshCw } from 'lucide-react';
import { ExecutiveSummary } from '@/api/entities';
import { RiskScenario } from '@/api/entities'; // Added import for RiskScenario

// Re-evaluate imports based on new JSX structure
// Previous: Threat, Device, ComplianceFramework, InvokeLLM
// New JSX only uses: RiskOverview, RiskTrendChart, IndustryBenchmark, ComplianceStatus, InvestmentBreakdown, RiskScenarioModeler
// So, Threat, Device, ComplianceFramework, InvokeLLM are no longer directly used in this file's logic or state derivation.
// However, the outline removed the state for them, and the generateRiskPrediction function, so they are implicitly removed.
// The outline does not list Tabs or TabsTrigger/TabsList anymore.

import RiskOverview from '../components/executive/RiskOverview';
import RiskTrendChart from '../components/executive/RiskTrendChart';
import IndustryBenchmark from '../components/executive/IndustryBenchmark';
import ComplianceStatus from '../components/executive/ComplianceStatus';
import InvestmentBreakdown from '../components/executive/InvestmentBreakdown';
import RiskScenarioModeler from '../components/executive/RiskScenarioModeler';

export default function ExecutiveDashboard() {
  const [summary, setSummary] = useState(null); // Changed from executiveData to summary
  const [scenarios, setScenarios] = useState([]); // Added scenarios state
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Removed: threats, devices, compliance, riskPrediction state variables as per outline's data loading and component props

  useEffect(() => {
    loadData(); // Renamed function call
    
    // Auto-refresh every 5 minutes for executive data
    const interval = setInterval(loadData, 300000); // Renamed function call
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => { // Renamed from loadExecutiveData
    setIsLoading(true);
    try {
      const [summaryData, scenarioData] = await Promise.all([
        ExecutiveSummary.list('-date', 1), // Fetching only the latest summary
        RiskScenario.list('-created_date') // Fetching risk scenarios
      ]);
      
      setSummary(summaryData[0] || null); // Take the first item or null if empty
      setScenarios(scenarioData || []); // Set scenarios
      
      // Removed: generateRiskPrediction call as riskPrediction state is removed
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading executive data:', error);
      setSummary(null);
      setScenarios([]);
      // Removed: setThreats, setDevices, setCompliance as these states are removed
    }
    setIsLoading(false);
  };

  // Removed: generateRiskPrediction function as it is no longer used

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Briefcase className="w-10 h-10 text-blue-600" />
              Executive Security Dashboard
            </h1>
            <p className="text-slate-600">Strategic cybersecurity insights with business impact analysis and investment ROI</p>
            <p className="text-xs text-slate-500 mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
          </div>
          <Button onClick={loadData} disabled={isLoading} variant="outline"> {/* Changed onClick to loadData */}
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </motion.div>

        {/* Replaced Tabs with new grid layout as per outline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <RiskOverview 
              summary={summary} 
              isLoading={isLoading} 
              // Removed: riskPrediction, threats, devices props as per outline
            />
            <RiskTrendChart 
              // Removed all props as per outline
            />
            <InvestmentBreakdown 
              summary={summary} 
              isLoading={isLoading} 
              // Removed: executiveData, riskPrediction props as per outline
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <RiskScenarioModeler 
              onNewScenario={loadData} // Added onNewScenario prop as per outline
              // Removed: riskPrediction prop as per outline
              // Removed: isLoading prop as per outline, RiskScenarioModeler gets only onNewScenario prop
            />
            <IndustryBenchmark 
              summary={summary} 
              isLoading={isLoading} 
              // Removed: riskPrediction, threats, devices props as per outline
            />
            <ComplianceStatus 
              summary={summary} 
              isLoading={isLoading} 
              // Removed: compliance, riskPrediction props as per outline
            />
          </div>
        </div>
      </div>
    </div>
  );
}
