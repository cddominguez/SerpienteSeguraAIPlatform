
import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AIDeviceInsights({ devices = [], alerts = [], isLoading }) {
  const [insights, setInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    try {
      const context = {
        total_devices: devices.length,
        device_types: devices.reduce((acc, d) => {
          acc[d.device_type] = (acc[d.device_type] || 0) + 1;
          return acc;
        }, {}),
        security_status: devices.reduce((acc, d) => {
          acc[d.status] = (acc[d.status] || 0) + 1;
          return acc;
        }, {}),
        critical_alerts: alerts.filter(a => a.severity === 'critical').length,
        threats_detected: devices.reduce((sum, d) => sum + d.threats_detected, 0)
      };

      const response = await InvokeLLM({
        prompt: `Analyze the device management data and provide security insights, risk assessment, and recommendations for improvement.
        
Data: ${JSON.stringify(context)}

Provide analysis on device security posture, identify patterns, and suggest specific actions to improve security.`,
        response_json_schema: {
          type: "object",
          properties: {
            security_score: { type: "number", minimum: 0, maximum: 100 },
            key_findings: { type: "array", items: { type: "string" } },
            risk_factors: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            threat_trends: { type: "string" }
          }
        }
      });

      setInsights(response);
    } catch (error) {
      console.error("Error generating insights:", error);
    }
    setIsAnalyzing(false);
  };

  const deviceTypeData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.device_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: device.device_type, value: 1 });
    }
    return acc;
  }, []);

  const securityStatusData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: device.status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Device Security Analysis
          </CardTitle>
          <Button onClick={generateInsights} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
          </Button>
        </CardHeader>
        <CardContent>
          {isAnalyzing && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}
          {insights && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">Overall Security Score</h3>
                    <p className="text-sm text-slate-600">AI-calculated security posture</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${insights.security_score > 80 ? 'text-emerald-600' : insights.security_score > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {insights.security_score}%
                    </div>
                    <Badge variant={insights.security_score > 80 ? 'default' : insights.security_score > 60 ? 'secondary' : 'destructive'}>
                      {insights.security_score > 80 ? 'Excellent' : insights.security_score > 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Key Findings
                  </h4>
                  <ul className="space-y-2">
                    {insights.key_findings.map((finding, i) => (
                      <li key={i} className="text-sm text-slate-700 p-3 bg-blue-50 rounded-lg">
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {insights.risk_factors.map((risk, i) => (
                      <li key={i} className="text-sm text-slate-700 p-3 bg-red-50 rounded-lg">
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {insights.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-slate-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Threat Analysis</h4>
                <p className="text-sm text-slate-700 p-4 bg-slate-50 rounded-lg">
                  {insights.threat_trends}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={securityStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
