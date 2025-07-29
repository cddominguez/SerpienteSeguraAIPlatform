import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Zap, Scan, TrendingUp, Calendar } from 'lucide-react';

export default function QuantumThreatAssessment({ threats = [], isLoading = false, refreshData }) {
  const [assessment, setAssessment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Ensure threats is always an array
  const safeThreats = Array.isArray(threats) ? threats : [];

  const generateAssessment = async () => {
    setIsAnalyzing(true);
    try {
      const context = {
        total_algorithms: safeThreats.length,
        vulnerable_algorithms: safeThreats.filter(t => 
          t.quantum_vulnerability === 'immediate' || t.quantum_vulnerability === 'near_term'
        ).length,
        quantum_safe_algorithms: safeThreats.filter(t => t.quantum_vulnerability === 'quantum_safe').length,
        total_estimated_cost: safeThreats.reduce((sum, t) => sum + (t.estimated_migration_cost || 0), 0)
      };

      const response = await InvokeLLM({
        prompt: `Analyze the quantum threat landscape and provide a comprehensive security assessment based on current cryptographic infrastructure.
        
Data: ${JSON.stringify(context)}

Provide insights on quantum readiness, risk levels, and strategic recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
            key_vulnerabilities: { type: "array", items: { type: "string" } },
            immediate_actions: { type: "array", items: { type: "string" } },
            timeline_assessment: { type: "string" },
            business_impact: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAssessment(response);
    } catch (error) {
      console.error("Error generating assessment:", error);
      setAssessment({
        overall_risk_level: 'medium',
        key_vulnerabilities: ['Unable to analyze vulnerabilities at this time'],
        immediate_actions: ['Please try the assessment again'],
        timeline_assessment: 'Assessment temporarily unavailable',
        business_impact: 'Unable to calculate business impact',
        recommendations: ['Contact support if this issue persists']
      });
    }
    setIsAnalyzing(false);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Scan className="w-5 h-5 text-purple-600" />
              Quantum Threat Assessment
            </CardTitle>
            <CardDescription>
              AI-powered analysis of your organization's quantum computing vulnerabilities
            </CardDescription>
          </div>
          <Button onClick={generateAssessment} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Run Assessment'}
          </Button>
        </CardHeader>
        <CardContent>
          {assessment && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">Overall Risk Level</h3>
                    <p className="text-sm text-slate-600">Current quantum threat exposure</p>
                  </div>
                  <Badge className={getRiskColor(assessment.overall_risk_level)} variant="secondary">
                    {assessment.overall_risk_level?.toUpperCase() || 'UNKNOWN'}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Key Vulnerabilities
                  </h4>
                  <div className="space-y-2">
                    {assessment.key_vulnerabilities?.map((vulnerability, i) => (
                      <div key={i} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">{vulnerability}</p>
                      </div>
                    )) || <p className="text-sm text-slate-500">No vulnerabilities identified</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Immediate Actions
                  </h4>
                  <div className="space-y-2">
                    {assessment.immediate_actions?.map((action, i) => (
                      <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">{action}</p>
                      </div>
                    )) || <p className="text-sm text-slate-500">No immediate actions required</p>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline Assessment
                </h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700">{assessment.timeline_assessment || 'No timeline assessment available'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Business Impact
                </h4>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">{assessment.business_impact || 'No business impact assessment available'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Strategic Recommendations
                </h4>
                <div className="space-y-2">
                  {assessment.recommendations?.map((rec, i) => (
                    <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-800">{rec}</p>
                    </div>
                  )) || <p className="text-sm text-slate-500">No recommendations available</p>}
                </div>
              </div>
            </div>
          )}

          {!assessment && !isAnalyzing && (
            <div className="text-center py-12">
              <Scan className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready for Assessment?</h3>
              <p className="text-slate-600 mb-6">
                Generate a comprehensive quantum threat analysis for your organization
              </p>
              <Button onClick={generateAssessment} size="lg">
                Run Quantum Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}