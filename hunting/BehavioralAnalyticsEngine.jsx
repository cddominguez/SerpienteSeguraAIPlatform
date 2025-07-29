import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertTriangle, Users, Activity, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { InvokeLLM } from "@/api/integrations";
import { motion } from 'framer-motion';

export default function BehavioralAnalyticsEngine({ 
  userActivity = [], 
  devices = [], 
  onAnomalyDetected 
}) {
  const [behaviorAnalysis, setBehaviorAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    if (userActivity.length > 0 || devices.length > 0) {
      analyzeBehavior();
    }
  }, [userActivity, devices, selectedTimeframe]);

  const analyzeBehavior = async () => {
    setIsAnalyzing(true);
    
    try {
      // Filter data based on timeframe
      const now = new Date();
      const timeframeMs = selectedTimeframe === '24h' ? 24 * 60 * 60 * 1000 : 
                         selectedTimeframe === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                         30 * 24 * 60 * 60 * 1000;
      
      const filteredActivity = userActivity.filter(a => 
        new Date(a.created_date) > new Date(now.getTime() - timeframeMs)
      );

      const context = {
        user_activities: filteredActivity.slice(0, 50),
        device_status: devices.map(d => ({
          name: d.name,
          status: d.status,
          trust_score: d.trust_score,
          threats_detected: d.threats_detected
        })),
        timeframe: selectedTimeframe,
        total_users: new Set(filteredActivity.map(a => a.user_email)).size,
        total_activities: filteredActivity.length
      };

      const analysis = await InvokeLLM({
        prompt: `As an advanced behavioral analytics engine, analyze the user and entity behavior data to identify anomalies, patterns, and security risks:

Security Context:
${JSON.stringify(context)}

Provide comprehensive behavioral analysis including:
1. User behavior anomalies with peer group comparison
2. Entity (device/application) behavior analysis
3. Seasonal and contextual baseline deviations
4. Risk scoring with confidence levels
5. Behavioral pattern clustering
6. Predictive risk indicators

Focus on identifying subtle behavioral changes that might indicate compromised accounts, insider threats, or advanced persistent threats.`,
        response_json_schema: {
          type: "object",
          properties: {
            user_anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user_email: { type: "string" },
                  anomaly_type: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  confidence: { type: "number", minimum: 0, maximum: 100 },
                  description: { type: "string" },
                  peer_group_deviation: { type: "number" },
                  risk_indicators: { type: "array", items: { type: "string" } }
                }
              }
            },
            entity_anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entity_name: { type: "string" },
                  entity_type: { type: "string", enum: ["device", "application", "network"] },
                  anomaly_description: { type: "string" },
                  baseline_deviation: { type: "number" },
                  severity: { type: "string", enum: ["low", "medium", "high", "critical"] }
                }
              }
            },
            behavior_clusters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  cluster_name: { type: "string" },
                  user_count: { type: "number" },
                  typical_behaviors: { type: "array", items: { type: "string" } },
                  risk_level: { type: "string", enum: ["low", "medium", "high"] }
                }
              }
            },
            risk_trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  time_period: { type: "string" },
                  overall_risk_score: { type: "number", minimum: 0, maximum: 100 },
                  trend_direction: { type: "string", enum: ["increasing", "decreasing", "stable"] }
                }
              }
            },
            predictive_indicators: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indicator: { type: "string" },
                  likelihood: { type: "number", minimum: 0, maximum: 100 },
                  potential_impact: { type: "string" },
                  recommended_action: { type: "string" }
                }
              }
            },
            insights_summary: { type: "string" }
          }
        }
      });

      setBehaviorAnalysis(analysis);
      
      // Trigger anomaly notifications for high/critical findings
      const criticalAnomalies = [
        ...(analysis.user_anomalies || []).filter(a => ['high', 'critical'].includes(a.severity)),
        ...(analysis.entity_anomalies || []).filter(a => ['high', 'critical'].includes(a.severity))
      ];
      
      if (criticalAnomalies.length > 0 && onAnomalyDetected) {
        onAnomalyDetected(criticalAnomalies);
      }

    } catch (error) {
      console.error('Behavioral analysis failed:', error);
      setBehaviorAnalysis({
        user_anomalies: [],
        entity_anomalies: [],
        behavior_clusters: [],
        risk_trends: [],
        predictive_indicators: [],
        insights_summary: "Unable to complete behavioral analysis at this time."
      });
    }
    
    setIsAnalyzing(false);
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
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Behavioral Analytics Engine
            </CardTitle>
            <CardDescription>
              Advanced user and entity behavior analysis with AI-powered anomaly detection
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button onClick={analyzeBehavior} disabled={isAnalyzing} size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-slate-500">Analyzing behavioral patterns...</p>
              </div>
            </div>
          )}

          {behaviorAnalysis && !isAnalyzing && (
            <Tabs defaultValue="anomalies" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                <TabsTrigger value="clusters">Behavior Clusters</TabsTrigger>
                <TabsTrigger value="trends">Risk Trends</TabsTrigger>
                <TabsTrigger value="predictive">Predictions</TabsTrigger>
              </TabsList>

              <TabsContent value="anomalies" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      User Behavior Anomalies
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {(behaviorAnalysis.user_anomalies || []).map((anomaly, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-slate-900">{anomaly.user_email}</h4>
                              <p className="text-sm text-slate-600">{anomaly.anomaly_type}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getSeverityColor(anomaly.severity)}>
                                {anomaly.severity}
                              </Badge>
                              <Badge variant="outline">
                                {anomaly.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{anomaly.description}</p>
                          <div className="text-xs text-slate-500">
                            Peer deviation: {anomaly.peer_group_deviation?.toFixed(2)}σ
                          </div>
                          {anomaly.risk_indicators && anomaly.risk_indicators.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-slate-600 mb-1">Risk Indicators:</p>
                              <div className="flex flex-wrap gap-1">
                                {anomaly.risk_indicators.slice(0, 3).map((indicator, j) => (
                                  <Badge key={j} variant="outline" className="text-xs">
                                    {indicator}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Entity Behavior Anomalies
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {(behaviorAnalysis.entity_anomalies || []).map((anomaly, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-slate-900">{anomaly.entity_name}</h4>
                              <p className="text-sm text-slate-600 capitalize">{anomaly.entity_type}</p>
                            </div>
                            <Badge className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">{anomaly.anomaly_description}</p>
                          <div className="text-xs text-slate-500 mt-2">
                            Baseline deviation: {anomaly.baseline_deviation?.toFixed(2)}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="clusters" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(behaviorAnalysis.behavior_clusters || []).map((cluster, i) => (
                    <Card key={i} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{cluster.cluster_name}</CardTitle>
                          <Badge variant={cluster.risk_level === 'high' ? 'destructive' : 'secondary'}>
                            {cluster.risk_level} risk
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{cluster.user_count} users</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Typical Behaviors:</p>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {(cluster.typical_behaviors || []).slice(0, 3).map((behavior, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                {behavior}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <div className="h-80">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Risk Trend Analysis
                  </h3>
                  {behaviorAnalysis.risk_trends && behaviorAnalysis.risk_trends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={behaviorAnalysis.risk_trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time_period" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="overall_risk_score" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          name="Risk Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      No trend data available for the selected timeframe
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="predictive" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Predictive Risk Indicators
                  </h3>
                  {(behaviorAnalysis.predictive_indicators || []).map((indicator, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-slate-900">{indicator.indicator}</h4>
                        <Badge variant="outline">
                          {indicator.likelihood}% likelihood
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Potential Impact:</span>
                          <p className="font-medium">{indicator.potential_impact}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Recommended Action:</span>
                          <p className="font-medium">{indicator.recommended_action}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {behaviorAnalysis && !isAnalyzing && behaviorAnalysis.insights_summary && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">AI Insights Summary</h3>
              <p className="text-sm text-purple-800">{behaviorAnalysis.insights_summary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}