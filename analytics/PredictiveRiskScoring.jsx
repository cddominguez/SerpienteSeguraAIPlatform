import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, Target, Brain } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

export default function PredictiveRiskScoring({ assets, threats }) {
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (assets.length > 0 && threats.length > 0) {
      generateRiskScores();
    }
  }, [assets, threats]);

  const generateRiskScores = async () => {
    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Perform predictive risk scoring analysis on assets and threats:

Assets: ${JSON.stringify(assets.slice(0, 10))}
Active Threats: ${JSON.stringify(threats.slice(0, 10))}

Analyze:
1. Asset vulnerability scores
2. Threat likelihood predictions
3. Business impact assessments
4. Risk correlation patterns
5. Predictive risk trends

Provide comprehensive risk scoring with predictive insights.`,
        response_json_schema: {
          type: "object",
          properties: {
            asset_risk_scores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  asset_id: { type: "string" },
                  asset_name: { type: "string" },
                  risk_score: { type: "number" },
                  vulnerability_score: { type: "number" },
                  business_impact: { type: "string" },
                  predicted_threats: { type: "array", items: { type: "string" } }
                }
              }
            },
            risk_categories: {
              type: "object",
              properties: {
                technical: { type: "number" },
                operational: { type: "number" },
                financial: { type: "number" },
                compliance: { type: "number" },
                reputational: { type: "number" }
              }
            },
            trend_prediction: {
              type: "object",
              properties: {
                next_7_days: { type: "string" },
                risk_trajectory: { type: "string" },
                confidence: { type: "number" }
              }
            },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      setRiskAnalysis(response);
    } catch (error) {
      console.error("Error generating risk scores:", error);
    }
    setIsAnalyzing(false);
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const getRiskBadgeColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  const getImpactColor = (impact) => ({
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-green-100 text-green-800'
  }[impact]);

  // Prepare radar chart data
  const radarData = riskAnalysis?.risk_categories ? [
    { category: 'Technical', value: riskAnalysis.risk_categories.technical },
    { category: 'Operational', value: riskAnalysis.risk_categories.operational },
    { category: 'Financial', value: riskAnalysis.risk_categories.financial },
    { category: 'Compliance', value: riskAnalysis.risk_categories.compliance },
    { category: 'Reputational', value: riskAnalysis.risk_categories.reputational }
  ] : [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          Predictive Risk Scoring
        </CardTitle>
        <Button onClick={generateRiskScores} disabled={isAnalyzing} size="sm">
          {isAnalyzing ? 'Analyzing...' : 'Update Scores'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {riskAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Risk Categories Radar */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Risk Category Analysis</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Risk Score" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Trend Prediction */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  AI Risk Prediction
                </h3>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="mb-3">
                    <span className="font-medium text-purple-900">Next 7 Days:</span>
                    <p className="text-purple-800 text-sm mt-1">{riskAnalysis.trend_prediction?.next_7_days}</p>
                  </div>
                  <div className="mb-3">
                    <span className="font-medium text-purple-900">Risk Trajectory:</span>
                    <p className="text-purple-800 text-sm mt-1">{riskAnalysis.trend_prediction?.risk_trajectory}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-900">AI Confidence:</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {riskAnalysis.trend_prediction?.confidence}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Risk Scores */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Asset Risk Assessment
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {riskAnalysis.asset_risk_scores?.map((asset, index) => (
                  <motion.div
                    key={asset.asset_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{asset.asset_name}</h4>
                        <p className="text-sm text-slate-600">ID: {asset.asset_id}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getRiskColor(asset.risk_score)}`}>
                          {asset.risk_score}
                        </div>
                        <Badge className={getRiskBadgeColor(asset.risk_score)}>
                          Risk Score
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-slate-700">Vulnerability Score:</span>
                        <div className="mt-1">
                          <Progress value={asset.vulnerability_score} className="h-2" />
                          <span className="text-xs text-slate-500">{asset.vulnerability_score}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700">Business Impact:</span>
                        <div className="mt-1">
                          <Badge className={getImpactColor(asset.business_impact)}>
                            {asset.business_impact}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {asset.predicted_threats && asset.predicted_threats.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Predicted Threats:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {asset.predicted_threats.slice(0, 3).map((threat, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {threat}
                            </Badge>
                          ))}
                          {asset.predicted_threats.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{asset.predicted_threats.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Risk Mitigation Recommendations
              </h3>
              <div className="space-y-2">
                {riskAnalysis.recommendations?.map((rec, index) => (
                  <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-3"></div>
            <p className="text-slate-600">Running predictive analysis...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}