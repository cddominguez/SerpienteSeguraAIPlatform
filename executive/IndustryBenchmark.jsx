import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function IndustryBenchmark({ riskPrediction, executiveData = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Industry Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const latestSummary = executiveData[0] || {};
  const data = [
    { 
      name: 'Your Organization', 
      score: riskPrediction?.business_risk_score ?? latestSummary.business_risk_score ?? 0 
    },
    { 
      name: 'Industry Average', 
      score: latestSummary.industry_benchmark_score ?? 75 
    },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Industry Benchmark
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}