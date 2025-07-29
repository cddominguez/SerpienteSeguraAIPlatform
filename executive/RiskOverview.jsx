import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from 'framer-motion';
import { Activity, DollarSign, Percent, Shield } from 'lucide-react';

export default function RiskOverview({ riskPrediction, executiveData = [], isLoading }) {
  const latestSummary = executiveData[0] || {};
  
  const summaryData = {
    business_risk_score: riskPrediction?.business_risk_score ?? latestSummary.business_risk_score ?? 0,
    potential_financial_impact: riskPrediction?.potential_financial_impact ?? latestSummary.potential_financial_impact ?? 0,
    security_roi: latestSummary.security_roi ?? 0,
    industry_benchmark_score: latestSummary.industry_benchmark_score ?? 0,
  };

  const stats = [
    { 
      title: 'Business Risk Score', 
      value: summaryData.business_risk_score, 
      icon: Activity, 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      lowerIsBetter: true 
    },
    { 
      title: 'Potential Financial Impact', 
      value: summaryData.potential_financial_impact ? 
        `$${(summaryData.potential_financial_impact / 1000000).toFixed(2)}M` : 'N/A', 
      icon: DollarSign, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100' 
    },
    { 
      title: 'Security ROI', 
      value: summaryData.security_roi ? `${summaryData.security_roi}%` : 'N/A', 
      icon: Percent, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100' 
    },
    { 
      title: 'Industry Benchmark', 
      value: summaryData.industry_benchmark_score ? `${summaryData.industry_benchmark_score}%` : 'N/A', 
      icon: Shield, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{item.title}</CardTitle>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{item.value}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}