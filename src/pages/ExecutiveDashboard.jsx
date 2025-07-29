import React, { useState, useEffect } from 'react';
import { ExecutiveSummary } from '@/api/entities';
import RiskOverview from '@/components/executive/RiskOverview';
import RiskTrendChart from '@/components/executive/RiskTrendChart';
import ComplianceStatus from '@/components/executive/ComplianceStatus';
import InvestmentBreakdown from '@/components/executive/InvestmentBreakdown';
import IndustryBenchmark from '@/components/executive/IndustryBenchmark';
import BusinessImpactPredictor from '@/components/executive/BusinessImpactPredictor';
import SecurityROICalculator from '@/components/executive/SecurityROICalculator';
import RiskScenarioModeler from '@/components/executive/RiskScenarioModeler';

export default function ExecutiveDashboard() {
  const [executiveData, setExecutiveData] = useState([]);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    setIsLoading(true);
    try {
      const data = await ExecutiveSummary.list('-date', 12);
      setExecutiveData(data);
      
      // Mock risk prediction data
      setRiskPrediction({
        business_risk_score: 65,
        potential_financial_impact: 2500000
      });
    } catch (error) {
      console.error('Error loading executive data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Executive Security Dashboard
          </h1>
          <p className="text-slate-600">
            Strategic security insights and business risk analysis
          </p>
        </div>

        {/* Risk Overview */}
        <RiskOverview 
          riskPrediction={riskPrediction} 
          executiveData={executiveData} 
          isLoading={isLoading} 
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RiskTrendChart executiveData={executiveData} isLoading={isLoading} />
          <ComplianceStatus summary={executiveData[0]} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InvestmentBreakdown summary={executiveData[0]} isLoading={isLoading} />
          <IndustryBenchmark 
            riskPrediction={riskPrediction} 
            executiveData={executiveData} 
            isLoading={isLoading} 
          />
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BusinessImpactPredictor 
            riskPrediction={riskPrediction}
            threats={[]}
            devices={[]}
            isLoading={isLoading}
          />
          <SecurityROICalculator 
            riskPrediction={riskPrediction}
            threats={[]}
            devices={[]}
            isLoading={isLoading}
          />
        </div>

        <RiskScenarioModeler onNewScenario={loadExecutiveData} />
      </div>
    </div>
  );
}