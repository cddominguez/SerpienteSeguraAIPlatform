import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ThreatPredictionEngine({ threats, devices }) {
  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    generatePredictions();
  }, [threats, devices]);

  const generatePredictions = async () => {
    setIsAnalyzing(true);
    try {
      const context = {
        recent_threats: threats.slice(0, 10),
        device_vulnerabilities: devices.filter(d => d.status === 'at_risk'),
        network_activity: "high_unusual_patterns"
      };

      const response = await InvokeLLM({
        prompt: `Analyze cybersecurity data and predict potential threats in the next 24-48 hours. 
        Context: ${JSON.stringify(context)}
        
        Provide predictions with risk scores, attack vectors, and recommended preventive measures.`,
        response_json_schema: {
          type: "object",
          properties: {
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threat_type: { type: "string" },
                  probability: { type: "number" },
                  risk_score: { type: "number" },
                  timeline: { type: "string" },
                  attack_vector: { type: "string" },
                  prevention_measures: { type: "array", items: { type: "string" } }
                }
              }
            },
            overall_risk_score: { type: "number" }
          }
        }
      });

      setPredictions(response.predictions || []);
      setRiskScore(response.overall_risk_score || 0);
    } catch (error) {
      console.error("Error generating predictions:", error);
    }
    setIsAnalyzing(false);
  };

  const chartData = predictions.map((pred, index) => ({
    name: pred.threat_type,
    probability: pred.probability,
    risk: pred.risk_score
  }));

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Threat Prediction Engine
        </CardTitle>
        <Button 
          onClick={generatePredictions} 
          disabled={isAnalyzing}
          size="sm"
        >
          {isAnalyzing ? "Analyzing..." : "Refresh Predictions"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-slate-900">Overall Risk Score</h3>
            <p className="text-sm text-slate-600">Next 48 hours prediction</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${riskScore > 70 ? 'text-red-600' : riskScore > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {riskScore}%
            </div>
            <Badge variant={riskScore > 70 ? 'destructive' : riskScore > 40 ? 'secondary' : 'default'}>
              {riskScore > 70 ? 'High Risk' : riskScore > 40 ? 'Medium Risk' : 'Low Risk'}
            </Badge>
          </div>
        </div>

        {/* Prediction Chart */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Threat Probability Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="probability" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Predictions List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Predicted Threats</h3>
          {predictions.slice(0, 5).map((prediction, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-900">{prediction.threat_type}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">{prediction.probability}% probability</Badge>
                  <Badge variant={prediction.risk_score > 70 ? 'destructive' : 'secondary'}>
                    Risk: {prediction.risk_score}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Timeline:</strong> {prediction.timeline}
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Attack Vector:</strong> {prediction.attack_vector}
              </p>
              <div className="text-sm">
                <strong className="text-slate-700">Prevention Measures:</strong>
                <ul className="list-disc list-inside mt-1 text-slate-600">
                  {prediction.prevention_measures?.slice(0, 3).map((measure, i) => (
                    <li key={i}>{measure}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}