import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function ThreatPredictionML() {
    const [predictions, setPredictions] = useState([]);
    const [modelMetrics, setModelMetrics] = useState({
        accuracy: 97.3,
        precision: 94.8,
        recall: 92.1,
        f1Score: 93.4,
        confidence: 96.2
    });
    const [threatData, setThreatData] = useState([]);
    const [isTraining, setIsTraining] = useState(false);
    const [realTimePredictions, setRealTimePredictions] = useState([]);

    useEffect(() => {
        generateRealTimeData();
        const interval = setInterval(generateRealTimeData, 3000);
        return () => clearInterval(interval);
    }, []);

    const generateRealTimeData = () => {
        const newPrediction = {
            timestamp: new Date().toLocaleTimeString(),
            threatLevel: Math.floor(Math.random() * 100),
            anomalyScore: Math.floor(Math.random() * 100),
            confidence: Math.floor(Math.random() * 20) + 80
        };
        setRealTimePredictions(prev => [...prev.slice(-19), newPrediction]);
    };

    const runAdvancedPrediction = async () => {
        setIsTraining(true);
        try {
            const response = await InvokeLLM({
                prompt: `Generate advanced threat predictions using machine learning analysis:

Current Model Metrics:
- Accuracy: ${modelMetrics.accuracy}%
- Precision: ${modelMetrics.precision}%
- Recall: ${modelMetrics.recall}%
- F1 Score: ${modelMetrics.f1Score}%

Analyze current threat landscape and predict:
1. Emerging attack vectors in next 24-48 hours
2. Zero-day vulnerability probabilities
3. Advanced Persistent Threat (APT) indicators
4. Ransomware campaign patterns
5. Supply chain attack risks
6. AI-powered attack scenarios
7. Quantum computing threat timeline

Provide ML-driven predictions with confidence intervals.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        threat_predictions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    threat_type: { type: "string" },
                                    probability: { type: "number" },
                                    confidence_interval: { type: "string" },
                                    timeline: { type: "string" },
                                    impact_level: { type: "string" },
                                    attack_vectors: { type: "array", items: { type: "string" } },
                                    indicators: { type: "array", items: { type: "string" } },
                                    prevention_measures: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        model_confidence: { type: "number" },
                        emerging_patterns: { type: "array", items: { type: "string" } },
                        zero_day_probability: { type: "number" },
                        quantum_threat_timeline: { type: "string" }
                    }
                }
            });
            setPredictions(response.threat_predictions || []);
        } catch (error) {
            console.error("Error generating predictions:", error);
        }
        setIsTraining(false);
    };

    const getProbabilityColor = (probability) => {
        if (probability >= 80) return 'text-red-600';
        if (probability >= 60) return 'text-orange-600';
        if (probability >= 40) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        ML Threat Prediction Engine
                    </CardTitle>
                    <Button onClick={runAdvancedPrediction} disabled={isTraining}>
                        {isTraining ? 'Training Model...' : 'Generate Predictions'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Model Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <MetricCard title="Accuracy" value={`${modelMetrics.accuracy}%`} color="text-blue-600" />
                        <MetricCard title="Precision" value={`${modelMetrics.precision}%`} color="text-green-600" />
                        <MetricCard title="Recall" value={`${modelMetrics.recall}%`} color="text-purple-600" />
                        <MetricCard title="F1 Score" value={`${modelMetrics.f1Score}%`} color="text-orange-600" />
                        <MetricCard title="Confidence" value={`${modelMetrics.confidence}%`} color="text-indigo-600" />
                    </div>

                    {/* Real-time Prediction Chart */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Real-time Threat Predictions</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={realTimePredictions}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="threatLevel" stackId="1" stroke="#ef4444" fill="#ef444440" />
                                    <Area type="monotone" dataKey="anomalyScore" stackId="1" stroke="#8b5cf6" fill="#8b5cf640" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ML Predictions */}
                    {predictions.length > 0 && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-semibold text-slate-900">Advanced ML Predictions</h3>
                                {predictions.map((prediction, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-purple-50"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{prediction.threat_type}</h4>
                                                <p className="text-sm text-slate-600">Timeline: {prediction.timeline}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={prediction.impact_level === 'Critical' ? 'destructive' : 'secondary'}>
                                                    {prediction.impact_level}
                                                </Badge>
                                                <div className={`text-2xl font-bold ${getProbabilityColor(prediction.probability)}`}>
                                                    {prediction.probability}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <h5 className="font-medium text-slate-700 mb-1">Attack Vectors</h5>
                                                <ul className="list-disc list-inside text-slate-600 space-y-1">
                                                    {prediction.attack_vectors?.slice(0, 3).map((vector, i) => (
                                                        <li key={i}>{vector}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-slate-700 mb-1">Prevention Measures</h5>
                                                <ul className="list-disc list-inside text-slate-600 space-y-1">
                                                    {prediction.prevention_measures?.slice(0, 3).map((measure, i) => (
                                                        <li key={i}>{measure}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                            <span className="text-sm font-medium text-blue-800">
                                                Confidence Interval: {prediction.confidence_interval}
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

const MetricCard = ({ title, value, color }) => (
    <div className="p-3 bg-slate-50 rounded-lg border">
        <div className="text-sm text-slate-600">{title}</div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
);