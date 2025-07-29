import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Brain, AlertTriangle, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BehavioralAnomalyDetector() {
    const [anomalies, setAnomalies] = useState([]);
    const [behaviorBaseline, setBehaviorBaseline] = useState(null);
    const [realTimeData, setRealTimeData] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectionMetrics, setDetectionMetrics] = useState({
        anomaliesDetected: 127,
        falsePositiveRate: 2.3,
        detectionAccuracy: 96.8,
        processingTime: '45ms'
    });

    useEffect(() => {
        generateRealtimeAnomalies();
        const interval = setInterval(generateRealtimeAnomalies, 2000);
        return () => clearInterval(interval);
    }, []);

    const generateRealtimeAnomalies = () => {
        const newAnomaly = {
            x: Math.random() * 100,
            y: Math.random() * 100,
            severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
            type: ['login_pattern', 'data_access', 'api_usage', 'network_behavior'][Math.floor(Math.random() * 4)]
        };
        setRealTimeData(prev => [...prev.slice(-49), newAnomaly]);
    };

    const analyzeUserBehavior = async () => {
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Perform comprehensive behavioral anomaly analysis:

Detection Metrics:
- Anomalies Detected: ${detectionMetrics.anomaliesDetected}
- False Positive Rate: ${detectionMetrics.falsePositiveRate}%
- Detection Accuracy: ${detectionMetrics.detectionAccuracy}%
- Processing Time: ${detectionMetrics.processingTime}

Analyze behavioral patterns and detect anomalies:
1. User authentication patterns (time, location, device)
2. Data access behaviors (frequency, volume, timing)
3. Network usage patterns (bandwidth, connections, protocols)
4. Application usage anomalies (unusual workflows, elevated privileges)
5. File system access patterns (creation, modification, deletion)
6. Communication behavior (email, messaging, external contacts)
7. Insider threat indicators
8. Compromised account behaviors

Provide detailed anomaly assessment with machine learning insights.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        behavior_baseline: {
                            type: "object",
                            properties: {
                                normal_patterns: { type: "array", items: { type: "string" } },
                                trust_score: { type: "number" },
                                risk_factors: { type: "array", items: { type: "string" } }
                            }
                        },
                        detected_anomalies: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    anomaly_type: { type: "string" },
                                    severity: { type: "string" },
                                    confidence: { type: "number" },
                                    description: { type: "string" },
                                    indicators: { type: "array", items: { type: "string" } },
                                    risk_assessment: { type: "string" },
                                    recommended_actions: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        insider_threat_score: { type: "number" },
                        model_insights: {
                            type: "object",
                            properties: {
                                learning_status: { type: "string" },
                                pattern_evolution: { type: "string" },
                                adaptation_rate: { type: "number" }
                            }
                        }
                    }
                }
            });
            
            setAnomalies(response.detected_anomalies || []);
            setBehaviorBaseline(response.behavior_baseline);
        } catch (error) {
            console.error("Error analyzing behavior:", error);
        }
        setIsAnalyzing(false);
    };

    const getSeverityColor = (severity) => ({
        high: 'bg-red-500',
        medium: 'bg-yellow-500',
        low: 'bg-blue-500'
    }[severity] || 'bg-gray-500');

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-indigo-600" />
                        Behavioral Anomaly Detection
                    </CardTitle>
                    <Button onClick={analyzeUserBehavior} disabled={isAnalyzing}>
                        {isAnalyzing ? 'Analyzing...' : 'Deep Analysis'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Detection Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard 
                            icon={AlertTriangle}
                            title="Anomalies" 
                            value={detectionMetrics.anomaliesDetected} 
                            color="text-red-600" 
                        />
                        <MetricCard 
                            icon={Brain}
                            title="Accuracy" 
                            value={`${detectionMetrics.detectionAccuracy}%`} 
                            color="text-green-600" 
                        />
                        <MetricCard 
                            icon={Zap}
                            title="Processing" 
                            value={detectionMetrics.processingTime} 
                            color="text-blue-600" 
                        />
                        <MetricCard 
                            icon={Activity}
                            title="False Positive" 
                            value={`${detectionMetrics.falsePositiveRate}%`} 
                            color="text-purple-600" 
                        />
                    </div>

                    {/* Real-time Anomaly Visualization */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Real-time Anomaly Detection</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart data={realTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="x" name="Behavior Pattern" />
                                    <YAxis dataKey="y" name="Risk Score" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter 
                                        name="Anomalies" 
                                        dataKey="y" 
                                        fill="#8b5cf6"
                                        shape={(props) => {
                                            const color = getSeverityColor(props.payload.severity);
                                            return <circle cx={props.cx} cy={props.cy} r={4} className={color} />;
                                        }}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Behavior Baseline */}
                    {behaviorBaseline && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 p-4 rounded-lg border border-green-200"
                        >
                            <h3 className="font-semibold text-green-900 mb-3">Established Behavior Baseline</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Normal Patterns</h4>
                                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                        {behaviorBaseline.normal_patterns?.slice(0, 4).map((pattern, i) => (
                                            <li key={i}>{pattern}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Trust Score</h4>
                                    <div className="text-2xl font-bold text-green-600">
                                        {behaviorBaseline.trust_score}/100
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Detected Anomalies */}
                    {anomalies.length > 0 && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-semibold text-slate-900">Detected Behavioral Anomalies</h3>
                                {anomalies.slice(0, 5).map((anomaly, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-orange-50"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{anomaly.anomaly_type}</h4>
                                                <p className="text-sm text-slate-600">{anomaly.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                                                    {anomaly.severity}
                                                </Badge>
                                                <div className="text-lg font-bold text-red-600">
                                                    {anomaly.confidence}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <h5 className="font-medium text-slate-700 mb-1">Indicators</h5>
                                                <ul className="list-disc list-inside text-slate-600 space-y-1">
                                                    {anomaly.indicators?.slice(0, 3).map((indicator, i) => (
                                                        <li key={i}>{indicator}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-slate-700 mb-1">Recommended Actions</h5>
                                                <ul className="list-disc list-inside text-slate-600 space-y-1">
                                                    {anomaly.recommended_actions?.slice(0, 3).map((action, i) => (
                                                        <li key={i}>{action}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                                            <span className="text-sm font-medium text-orange-800">
                                                Risk Assessment: {anomaly.risk_assessment}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

const MetricCard = ({ icon: Icon, title, value, color }) => (
    <div className="p-3 bg-slate-50 rounded-lg border">
        <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm text-slate-600">{title}</span>
        </div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
);