
import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, DollarSign, TrendingDown, Clock, Building, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function BusinessImpactPredictor({ riskPrediction, threats, devices, isLoading }) {
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('most_likely');

  const generateBusinessImpact = async () => {
    setIsAnalyzing(true);
    try {
      const context = {
        active_threats: threats.filter(t => t.status === 'active').length,
        critical_threats: threats.filter(t => t.severity === 'critical').length,
        compromised_devices: devices.filter(d => d.status === 'compromised').length,
        total_devices: devices.length,
        current_risk_score: riskPrediction?.business_risk_score || 0
      };

      const response = await InvokeLLM({
        prompt: `As a business impact analyst, predict the potential business consequences of current cybersecurity risks:

Security Context: ${JSON.stringify(context)}
Current Risk Prediction: ${JSON.stringify(riskPrediction)}

Provide detailed business impact analysis including:
1. Financial impact projections (revenue loss, recovery costs, regulatory fines)
2. Operational disruption scenarios (downtime, productivity loss)
3. Reputational damage assessment (customer loss, brand value impact)
4. Regulatory and legal implications
5. Recovery timeline estimates
6. Sector-specific impact analysis

Focus on quantifiable business metrics and realistic financial projections.`,
        response_json_schema: {
          type: "object",
          properties: {
            financial_impacts: {
              type: "object",
              properties: {
                immediate_costs: { type: "number" },
                recovery_costs: { type: "number" },
                regulatory_fines: { type: "number" },
                revenue_loss: { type: "number" },
                total_estimated_impact: { type: "number" }
              }
            },
            operational_impacts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  estimated_downtime_hours: { type: "number" },
                  productivity_loss_percent: { type: "number" },
                  affected_employees: { type: "number" }
                }
              }
            },
            reputational_impact: {
              type: "object",
              properties: {
                customer_churn_rate: { type: "number" },
                brand_value_loss: { type: "number" },
                recovery_timeline_months: { type: "number" },
                market_share_impact: { type: "number" }
              }
            },
            recovery_scenarios: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scenario: { type: "string" },
                  timeline_days: { type: "number" },
                  recovery_cost: { type: "number" },
                  success_probability: { type: "number" }
                }
              }
            },
            industry_specific_risks: { type: "array", items: { type: "string" } },
            mitigation_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  cost: { type: "number" },
                  impact_reduction: { type: "number" },
                  timeline: { type: "string" }
                }
              }
            }
          }
        }
      });

      setPrediction(response);
    } catch (error) {
      console.error('Error generating business impact prediction:', error);
    }
    setIsAnalyzing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-600" />
          Business Impact Predictor
        </CardTitle>
        <Button onClick={generateBusinessImpact} disabled={isAnalyzing || isLoading}>
          <Zap className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Generate Prediction'}
        </Button>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3">AI is analyzing business impact...</span>
          </div>
        )}

        {prediction && !isAnalyzing && (
          <Tabs defaultValue="financial" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="financial">Financial Impact</TabsTrigger>
              <TabsTrigger value="operational">Operations</TabsTrigger>
              <TabsTrigger value="reputation">Reputation</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
            </TabsList>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-slate-600">Total Impact</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(prediction.financial_impacts.total_estimated_impact)}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-slate-600">Revenue Loss</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(prediction.financial_impacts.revenue_loss)}
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-slate-600">Recovery Costs</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(prediction.financial_impacts.recovery_costs)}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Regulatory Fines</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(prediction.financial_impacts.regulatory_fines)}
                  </div>
                </div>
              </div>

              <div className="h-64">
                <h3 className="font-semibold mb-3">Financial Impact Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Immediate', value: prediction.financial_impacts.immediate_costs },
                    { name: 'Recovery', value: prediction.financial_impacts.recovery_costs },
                    { name: 'Fines', value: prediction.financial_impacts.regulatory_fines },
                    { name: 'Lost Revenue', value: prediction.financial_impacts.revenue_loss }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="operational" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Operational Impact Assessment</h3>
                {(prediction.operational_impacts ?? []).map((impact, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-slate-900">{impact.area}</h4>
                      <Badge className={getSeverityColor(impact.severity)}>
                        {impact.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Downtime:</span>
                        <div className="font-semibold">{impact.estimated_downtime_hours}h</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Productivity Loss:</span>
                        <div className="font-semibold">{impact.productivity_loss_percent}%</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Affected Staff:</span>
                        <div className="font-semibold">{impact.affected_employees}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reputation" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Customer Churn</span>
                  <div className="text-2xl font-bold text-red-600">
                    {(prediction.reputational_impact.customer_churn_rate * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Brand Value Loss</span>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(prediction.reputational_impact.brand_value_loss)}
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Recovery Time</span>
                  <div className="text-2xl font-bold text-yellow-600">
                    {prediction.reputational_impact.recovery_timeline_months}mo
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600">Market Share Impact</span>
                  <div className="text-2xl font-bold text-blue-600">
                    -{(prediction.reputational_impact.market_share_impact * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Industry-Specific Risk Factors</h3>
                <div className="grid gap-2">
                  {(prediction.industry_specific_risks ?? []).map((risk, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm">
                      {risk}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recovery" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Recovery Scenarios</h3>
                <div className="space-y-4">
                  {(prediction.recovery_scenarios ?? []).map((scenario, i) => (
                    <div key={i} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{scenario.scenario}</h4>
                        <Badge variant="outline">
                          {(scenario.success_probability * 100).toFixed(0)}% Success Rate
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Timeline:</span>
                          <div className="font-semibold">{scenario.timeline_days} days</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Cost:</span>
                          <div className="font-semibold">{formatCurrency(scenario.recovery_cost)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Mitigation Recommendations</h3>
                <div className="space-y-3">
                  {(prediction.mitigation_recommendations ?? []).map((rec, i) => (
                    <div key={i} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">{rec.action}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Investment:</span>
                          <div className="font-semibold">{formatCurrency(rec.cost)}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Risk Reduction:</span>
                          <div className="font-semibold">{(rec.impact_reduction * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Timeline:</span>
                          <div className="font-semibold">{rec.timeline}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!prediction && !isAnalyzing && (
          <div className="text-center py-8">
            <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Business Impact Analysis</h3>
            <p className="text-slate-500 mb-4">Generate comprehensive business impact predictions based on current security posture</p>
            <Button onClick={generateBusinessImpact}>
              Generate Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
