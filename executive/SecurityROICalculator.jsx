import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Calculator, Target, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function SecurityROICalculator({ riskPrediction, threats, devices, isLoading }) {
  const [roiCalculation, setRoiCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [investmentScenario, setInvestmentScenario] = useState({
    preventative_investment: 500000,
    detective_investment: 300000,
    responsive_investment: 200000,
    timeline_years: 3,
    industry_sector: 'technology'
  });

  const calculateROI = async () => {
    setIsCalculating(true);
    try {
      const context = {
        current_risk_score: riskPrediction?.business_risk_score || 50,
        active_threats: threats.filter(t => t.status === 'active').length,
        total_devices: devices.length,
        investment_scenario: investmentScenario,
        potential_losses: riskPrediction?.potential_financial_impact || 1000000
      };

      const response = await InvokeLLM({
        prompt: `As a cybersecurity investment analyst, calculate the ROI for proposed security investments:

Current Security Context: ${JSON.stringify(context)}
Investment Scenario: ${JSON.stringify(investmentScenario)}

Calculate comprehensive ROI analysis including:
1. Risk reduction estimates based on investment allocation
2. Prevented loss calculations (direct and indirect costs)
3. Multi-year ROI projections with compound benefits
4. Break-even analysis and payback period
5. Comparison with industry standards and best practices
6. Sensitivity analysis for different risk scenarios
7. Total Cost of Ownership (TCO) considerations

Provide quantitative financial models with realistic assumptions.`,
        response_json_schema: {
          type: "object",
          properties: {
            roi_summary: {
              type: "object",
              properties: {
                total_investment: { type: "number" },
                projected_savings: { type: "number" },
                net_roi_percentage: { type: "number" },
                payback_period_months: { type: "number" },
                npv: { type: "number" }
              }
            },
            yearly_projections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  year: { type: "number" },
                  investment: { type: "number" },
                  prevented_losses: { type: "number" },
                  operational_savings: { type: "number" },
                  cumulative_roi: { type: "number" },
                  risk_reduction_percent: { type: "number" }
                }
              }
            },
            investment_breakdown: {
              type: "object",
              properties: {
                preventative: {
                  type: "object",
                  properties: {
                    investment: { type: "number" },
                    expected_risk_reduction: { type: "number" },
                    roi_multiplier: { type: "number" }
                  }
                },
                detective: {
                  type: "object",
                  properties: {
                    investment: { type: "number" },
                    expected_risk_reduction: { type: "number" },
                    roi_multiplier: { type: "number" }
                  }
                },
                responsive: {
                  type: "object",
                  properties: {
                    investment: { type: "number" },
                    expected_risk_reduction: { type: "number" },
                    roi_multiplier: { type: "number" }
                  }
                }
              }
            },
            sensitivity_analysis: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scenario: { type: "string" },
                  risk_change: { type: "number" },
                  roi_impact: { type: "number" },
                  description: { type: "string" }
                }
              }
            },
            industry_comparison: {
              type: "object",
              properties: {
                average_security_spend_percentage: { type: "number" },
                recommended_spend_percentage: { type: "number" },
                peer_roi_average: { type: "number" },
                competitive_position: { type: "string" }
              }
            },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      setRoiCalculation(response);
    } catch (error) {
      console.error('Error calculating ROI:', error);
    }
    setIsCalculating(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field, value) => {
    setInvestmentScenario(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-green-600" />
          Security ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Investment Parameters</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="preventative">Preventative Security Investment</Label>
                <Input
                  id="preventative"
                  type="number"
                  value={investmentScenario.preventative_investment}
                  onChange={(e) => handleInputChange('preventative_investment', e.target.value)}
                  placeholder="500000"
                />
              </div>
              
              <div>
                <Label htmlFor="detective">Detective Security Investment</Label>
                <Input
                  id="detective"
                  type="number"
                  value={investmentScenario.detective_investment}
                  onChange={(e) => handleInputChange('detective_investment', e.target.value)}
                  placeholder="300000"
                />
              </div>
              
              <div>
                <Label htmlFor="responsive">Responsive Security Investment</Label>
                <Input
                  id="responsive"
                  type="number"
                  value={investmentScenario.responsive_investment}
                  onChange={(e) => handleInputChange('responsive_investment', e.target.value)}
                  placeholder="200000"
                />
              </div>
              
              <div>
                <Label htmlFor="timeline">Investment Timeline (Years)</Label>
                <Select 
                  value={investmentScenario.timeline_years.toString()} 
                  onValueChange={(value) => handleInputChange('timeline_years', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="2">2 Years</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="industry">Industry Sector</Label>
                <Select 
                  value={investmentScenario.industry_sector} 
                  onValueChange={(value) => setInvestmentScenario(prev => ({...prev, industry_sector: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={calculateROI} disabled={isCalculating} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              {isCalculating ? 'Calculating ROI...' : 'Calculate ROI'}
            </Button>
          </div>

          {roiCalculation && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">ROI Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-600">Net ROI</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {roiCalculation.roi_summary.net_roi_percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-600">Payback Period</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {roiCalculation.roi_summary.payback_period_months} months
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Total Investment</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(roiCalculation.roi_summary.total_investment)}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PieChart className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-slate-600">Projected Savings</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(roiCalculation.roi_summary.projected_savings)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {roiCalculation && (
          <Tabs defaultValue="projections" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projections">Year-by-Year</TabsTrigger>
              <TabsTrigger value="breakdown">Investment Mix</TabsTrigger>
              <TabsTrigger value="sensitivity">Scenarios</TabsTrigger>
              <TabsTrigger value="benchmark">Industry</TabsTrigger>
            </TabsList>

            <TabsContent value="projections" className="space-y-6">
              <div className="h-64">
                <h3 className="font-semibold mb-3">Multi-Year ROI Projection</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={roiCalculation.yearly_projections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cumulative_roi" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="risk_reduction_percent" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-left p-2">Investment</th>
                      <th className="text-left p-2">Prevented Losses</th>
                      <th className="text-left p-2">Operational Savings</th>
                      <th className="text-left p-2">Cumulative ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiCalculation.yearly_projections.map((projection, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2 font-medium">{projection.year}</td>
                        <td className="p-2">{formatCurrency(projection.investment)}</td>
                        <td className="p-2 text-green-600">{formatCurrency(projection.prevented_losses)}</td>
                        <td className="p-2 text-blue-600">{formatCurrency(projection.operational_savings)}</td>
                        <td className="p-2 font-medium">{projection.cumulative_roi.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-700 mb-3">Preventative</h4>
                  <div className="space-y-2 text-sm">
                    <div>Investment: {formatCurrency(roiCalculation.investment_breakdown.preventative.investment)}</div>
                    <div>Risk Reduction: {(roiCalculation.investment_breakdown.preventative.expected_risk_reduction * 100).toFixed(1)}%</div>
                    <div>ROI Multiplier: {roiCalculation.investment_breakdown.preventative.roi_multiplier.toFixed(2)}x</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-3">Detective</h4>
                  <div className="space-y-2 text-sm">
                    <div>Investment: {formatCurrency(roiCalculation.investment_breakdown.detective.investment)}</div>
                    <div>Risk Reduction: {(roiCalculation.investment_breakdown.detective.expected_risk_reduction * 100).toFixed(1)}%</div>
                    <div>ROI Multiplier: {roiCalculation.investment_breakdown.detective.roi_multiplier.toFixed(2)}x</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-purple-700 mb-3">Responsive</h4>
                  <div className="space-y-2 text-sm">
                    <div>Investment: {formatCurrency(roiCalculation.investment_breakdown.responsive.investment)}</div>
                    <div>Risk Reduction: {(roiCalculation.investment_breakdown.responsive.expected_risk_reduction * 100).toFixed(1)}%</div>
                    <div>ROI Multiplier: {roiCalculation.investment_breakdown.responsive.roi_multiplier.toFixed(2)}x</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sensitivity" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Sensitivity Analysis</h3>
                <div className="space-y-3">
                  {roiCalculation.sensitivity_analysis.map((scenario, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{scenario.scenario}</h4>
                        <span className={`text-sm font-medium ${scenario.roi_impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {scenario.roi_impact > 0 ? '+' : ''}{scenario.roi_impact.toFixed(1)}% ROI Impact
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{scenario.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benchmark" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Industry Comparison</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600">Average Security Spend</div>
                      <div className="text-lg font-semibold">{(roiCalculation.industry_comparison.average_security_spend_percentage * 100).toFixed(1)}% of Revenue</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600">Recommended Spend</div>
                      <div className="text-lg font-semibold">{(roiCalculation.industry_comparison.recommended_spend_percentage * 100).toFixed(1)}% of Revenue</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600">Peer ROI Average</div>
                      <div className="text-lg font-semibold">{roiCalculation.industry_comparison.peer_roi_average.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {roiCalculation.recommendations.map((rec, i) => (
                      <div key={i} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}