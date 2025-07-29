
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Zap, ShieldCheck, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { useDevSecOpsContext } from '../utils/ContextSharingService';

export default function AIPredictionPanel({ threats = [], events = [] }) {
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Removed 'anomalies' state as it's no longer part of the updated prediction schema.
  
  const { sharedContext, updateContext } = useDevSecOpsContext();

  useEffect(() => {
    // We run predictions if we have data and are not already analyzing.
    if (threats.length > 0 && events.length > 0 && !isAnalyzing) {
      generatePredictions();
    }
  }, [threats, events, sharedContext]);

  const generatePredictions = async () => {
    setIsAnalyzing(true);
    
    const consolidatedContext = sharedContext;
    
    try {
      const response = await InvokeLLM({
        prompt: `As an AI security analyst with access to cross-module context, analyze threat patterns and provide predictive insights:

Recent Threats: ${JSON.stringify(threats.slice(0, 20))}
Recent Events: ${JSON.stringify(events.slice(0, 50))}
Cross-Module Context: ${JSON.stringify(consolidatedContext)}

Using all available data, provide:
1.  **Predictive Threat Forecast**: Identify the top 3 most likely threat types for the next 24-48 hours.
2.  **Asset Breach Likelihood**: For the top 2 at-risk asset types (e.g., 'Web Servers', 'User Endpoints'), provide a breach likelihood score (0-100%).
3.  **Time-to-Impact Estimation**: For the highest probability threat, estimate the time-to-impact if no action is taken.
4.  **Risk Trend Analysis**: Generate data points for a risk trend chart.
5.  **Proactive Recommendations**: Suggest 3 concrete, proactive measures to mitigate the predicted threats.`,
        response_json_schema: {
          type: "object",
          properties: {
            threat_forecast: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threat_type: { type: "string" },
                  probability: { type: "number", "description": "Probability from 0.0 to 1.0" }
                }
              }
            },
            asset_risk: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  asset_type: { type: "string" },
                  breach_likelihood: { type: "number", "description": "Percentage from 0 to 100" }
                }
              }
            },
            time_to_impact: {
              type: "object",
              properties: {
                  threat_type: { type: "string" },
                  estimated_hours: { type: "number" }
              }
            },
            risk_trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  time: { type: "string" },
                  risk_score: { type: "number" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setPredictions(response);
      // Removed setAnomalies as it's no longer part of the response schema.
      
      // Update shared context with AI insights
      updateContext('UPDATE_AI_INSIGHTS', response);
      
    } catch (error) {
      console.error('AI prediction failed:', error);
      // Provide fallback data to prevent UI errors
      setPredictions({
        threat_forecast: [], // Updated property name
        asset_risk: [], // Added for new schema
        time_to_impact: null, // Added for new schema
        risk_trends: [],
        recommendations: ["Unable to generate predictions at this time"]
      });
    }
    setIsAnalyzing(false);
  };

  const getPredictionColor = (probability) => {
    if (probability > 0.8) return 'text-red-600';
    if (probability > 0.5) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Threat Predictions
          </CardTitle>
          <Button onClick={generatePredictions} disabled={isAnalyzing} size="sm">
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {isAnalyzing && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3">AI is analyzing threat patterns...</span>
            </div>
          )}
          
          {predictions && !isAnalyzing && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {predictions.threat_forecast?.map((prediction, i) => ( // Changed from threat_predictions to threat_forecast
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 border rounded-lg text-center"
                  >
                    <h4 className="font-semibold text-sm capitalize">{prediction.threat_type.replace("_", " ")}</h4>
                    <p className={`text-2xl font-bold ${getPredictionColor(prediction.probability)}`}>
                      {Math.round(prediction.probability * 100)}%
                    </p>
                    <p className="text-xs text-slate-500">Likelihood (24h)</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 {predictions.asset_risk?.map((asset, i) => (
                    <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-700"/>{asset.asset_type}</span>
                            <Badge variant="outline" className="border-amber-300 text-amber-700 font-bold">
                                {asset.breach_likelihood}%
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-600 text-right">Breach Likelihood</p>
                    </div>
                 ))}
                 {predictions.time_to_impact && (
                     <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-red-700"/>{predictions.time_to_impact.threat_type}</span>
                            <Badge variant="outline" className="border-red-300 text-red-700 font-bold">
                                ~{predictions.time_to_impact.estimated_hours} Hours
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-600 text-right">Est. Time-to-Impact</p>
                    </div>
                 )}
              </div>

              {predictions.risk_trends && predictions.risk_trends.length > 0 && (
                <div className="h-64">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Risk Trend Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictions.risk_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="risk_score" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Removed Anomalies section as per updated prompt and schema */}

              {predictions.recommendations && predictions.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">AI Recommendations</h3>
                  <ul className="space-y-1">
                    {predictions.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
