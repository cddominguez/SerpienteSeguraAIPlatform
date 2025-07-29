import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Shield, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DeFiRiskAssessor() {
  const [protocolAddress, setProtocolAddress] = useState('');
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runRiskAssessment = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setRiskAssessment({
        overallRisk: 'Medium',
        riskScore: 65,
        liquidityRisk: 45,
        smartContractRisk: 70,
        governanceRisk: 80,
        marketRisk: 55,
        recommendations: [
          'Monitor governance token concentration',
          'Implement additional smart contract audits',
          'Set up liquidity monitoring alerts'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const riskData = riskAssessment ? [
    { name: 'Liquidity Risk', value: riskAssessment.liquidityRisk, color: '#3b82f6' },
    { name: 'Smart Contract Risk', value: riskAssessment.smartContractRisk, color: '#ef4444' },
    { name: 'Governance Risk', value: riskAssessment.governanceRisk, color: '#f59e0b' },
    { name: 'Market Risk', value: riskAssessment.marketRisk, color: '#10b981' }
  ] : [];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            DeFi Protocol Risk Assessor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder="Enter protocol address (0x...)"
              value={protocolAddress}
              onChange={(e) => setProtocolAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={runRiskAssessment} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Assess Risk'}
            </Button>
          </div>

          {riskAssessment && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Risk Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall Risk</span>
                    <Badge variant="secondary">{riskAssessment.overallRisk}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{riskAssessment.riskScore}%</div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {riskAssessment.recommendations.map((rec, i) => (
                      <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}