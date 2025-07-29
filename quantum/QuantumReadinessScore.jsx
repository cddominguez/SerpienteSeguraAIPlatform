import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, TrendingUp, Zap, CheckCircle, Clock } from 'lucide-react';

export default function QuantumReadinessScore({ threats = [], isLoading = false }) {
  // Ensure threats is always an array
  const safeThreats = Array.isArray(threats) ? threats : [];

  const calculateReadinessScore = () => {
    if (safeThreats.length === 0) return 0;
    
    const quantumSafe = safeThreats.filter(t => t.quantum_vulnerability === 'quantum_safe').length;
    const longTerm = safeThreats.filter(t => t.quantum_vulnerability === 'long_term').length;
    const nearTerm = safeThreats.filter(t => t.quantum_vulnerability === 'near_term').length;
    const immediate = safeThreats.filter(t => t.quantum_vulnerability === 'immediate').length;
    
    // Weighted scoring: quantum_safe = 100%, long_term = 70%, near_term = 30%, immediate = 0%
    const totalScore = (quantumSafe * 100) + (longTerm * 70) + (nearTerm * 30) + (immediate * 0);
    return Math.round(totalScore / safeThreats.length);
  };

  const readinessScore = calculateReadinessScore();
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { text: 'Excellent', variant: 'default', bg: 'bg-green-100' };
    if (score >= 60) return { text: 'Good', variant: 'secondary', bg: 'bg-yellow-100' };
    if (score >= 40) return { text: 'Needs Improvement', variant: 'secondary', bg: 'bg-orange-100' };
    return { text: 'Critical', variant: 'destructive', bg: 'bg-red-100' };
  };

  const scoreBadge = getScoreBadge(readinessScore);

  const stats = {
    totalAlgorithms: safeThreats.length,
    quantumSafe: safeThreats.filter(t => t.quantum_vulnerability === 'quantum_safe').length,
    atRisk: safeThreats.filter(t => t.quantum_vulnerability === 'immediate' || t.quantum_vulnerability === 'near_term').length,
    estimatedCost: safeThreats.reduce((sum, t) => sum + (t.estimated_migration_cost || 0), 0)
  };

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl ${scoreBadge.bg}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Zap className="w-8 h-8 text-purple-600" />
          Quantum Readiness Score
        </CardTitle>
        <CardDescription>
          Overall assessment of your organization's preparedness for quantum computing threats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(readinessScore)}`}>
            {isLoading ? '...' : readinessScore}
            {!isLoading && <span className="text-2xl">%</span>}
          </div>
          <Badge variant={scoreBadge.variant} className="text-lg px-4 py-1">
            {scoreBadge.text}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Quantum Readiness</span>
              <span className="text-sm font-medium text-slate-900">{readinessScore}%</span>
            </div>
            <Progress value={readinessScore} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <Shield className="w-6 h-6 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-slate-900">{stats.totalAlgorithms}</div>
            <div className="text-sm text-slate-600">Total Algorithms</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <CheckCircle className="w-6 h-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.quantumSafe}</div>
            <div className="text-sm text-slate-600">Quantum Safe</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <AlertTriangle className="w-6 h-6 mx-auto text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.atRisk}</div>
            <div className="text-sm text-slate-600">At Risk</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <TrendingUp className="w-6 h-6 mx-auto text-purple-600 mb-2" />
            <div className="text-xl font-bold text-slate-900">${stats.estimatedCost.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Migration Cost</div>
          </div>
        </div>

        {readinessScore < 60 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Immediate Action Required</h4>
                <p className="text-sm text-red-700 mb-3">
                  Your current quantum readiness score indicates significant vulnerability to quantum attacks. 
                  Consider prioritizing migration planning and implementation.
                </p>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Start Migration Planning
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}