import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function DeFiRiskScoring({ protocolData }) {
    const [riskScores, setRiskScores] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [timeframe, setTimeframe] = useState('7d');

    useEffect(() => {
        if (protocolData.length > 0) {
            calculateRiskScores();
        }
    }, [protocolData, timeframe]);

    const calculateRiskScores = async () => {
        setIsCalculating(true);
        try {
            const response = await InvokeLLM({
                prompt: `Calculate comprehensive DeFi risk scores for protocols:

Protocol Data: ${JSON.stringify(protocolData)}
Timeframe: ${timeframe}

Calculate risk scores across multiple dimensions:
1. Smart Contract Risk (code quality, audit status, complexity)
2. Liquidity Risk (pool depth, concentration, exit capacity)
3. Market Risk (volatility, correlation, external dependencies)
4. Governance Risk (centralization, voting power, admin keys)
5. Oracle Risk (feed reliability, manipulation potential)
6. Economic Risk (tokenomics, inflation, sustainability)
7. Operational Risk (team, development activity, community)
8. Regulatory Risk (compliance, legal framework)

Provide detailed risk scoring with explanations and trends.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overall_risk_score: { type: "number", minimum: 0, maximum: 100 },
                        risk_categories: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    category: { type: "string" },
                                    score: { type: "number" },
                                    trend: { type: "string" },
                                    weight: { type: "number" },
                                    description: { type: "string" }
                                }
                            }
                        },
                        protocol_scores: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    protocol: { type: "string" },
                                    overall_score: { type: "number" },
                                    risk_level: { type: "string" },
                                    top_risks: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        risk_alerts: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    protocol: { type: "string" },
                                    alert_type: { type: "string" },
                                    severity: { type: "string" },
                                    message: { type: "string" }
                                }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    category: { type: "string" },
                                    action: { type: "string" },
                                    priority: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setRiskScores(response);
        } catch (error) {
            console.error("Error calculating risk scores:", error);
        }
        setIsCalculating(false);
    };

    const getRiskColor = (score) => {
        if (score >= 80) return '#ef4444'; // red
        if (score >= 60) return '#f59e0b'; // amber
        if (score >= 40) return '#eab308'; // yellow
        return '#10b981'; // green
    };

    const getRiskLevelColor = (level) => ({
        Critical: 'bg-red-500 text-white',
        High: 'bg-orange-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-green-500 text-white'
    }[level] || 'bg-slate-500 text-white');

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
            case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
            default: return <Target className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Risk Score Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        DeFi Risk Scoring Engine
                    </CardTitle>
                    <div className="flex gap-3">
                        {['24h', '7d', '30d'].map((period) => (
                            <Button
                                key={period}
                                variant={timeframe === period ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTimeframe(period)}
                            >
                                {period}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={calculateRiskScores}
                        disabled={isCalculating}
                        className="w-full"
                    >
                        {isCalculating ? 'Calculating Risk Scores...' : 'Recalculate Risk Scores'}
                    </Button>
                </CardContent>
            </Card>

            {riskScores && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Overall Risk Score */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Overall Portfolio Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#e2e8f0"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={getRiskColor(riskScores.overall_risk_score)}
                                            strokeWidth="3"
                                            strokeDasharray={`${riskScores.overall_risk_score}, 100`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold" style={{ color: getRiskColor(riskScores.overall_risk_score) }}>
                                                {riskScores.overall_risk_score}
                                            </div>
                                            <div className="text-xs text-slate-600">Risk Score</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Categories Radar Chart */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Risk Categories Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={riskScores.risk_categories}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="category" />
                                        <PolarRadiusAxis domain={[0, 100]} />
                                        <Radar
                                            name="Risk Score"
                                            dataKey="score"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                {riskScores.risk_categories.map((category, i) => (
                                    <div key={i} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-semibold">{category.category}</h5>
                                            <div className="flex items-center gap-2">
                                                {getTrendIcon(category.trend)}
                                                <span className="font-bold" style={{ color: getRiskColor(category.score) }}>
                                                    {category.score}/100
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Weight: {category.weight}%</span>
                                            <span>Trend: {category.trend}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                                            <div 
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${category.score}%`,
                                                    backgroundColor: getRiskColor(category.score)
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Protocol Risk Comparison */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Protocol Risk Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskScores.protocol_scores}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="protocol" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="overall_score" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {riskScores.protocol_scores.map((protocol, i) => (
                                    <div key={i} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-semibold">{protocol.protocol}</h5>
                                            <Badge className={getRiskLevelColor(protocol.risk_level)}>
                                                {protocol.risk_level}
                                            </Badge>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-slate-600">Risk Score</span>
                                                <span className="font-bold" style={{ color: getRiskColor(protocol.overall_score) }}>
                                                    {protocol.overall_score}/100
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full transition-all duration-500"
                                                    style={{ 
                                                        width: `${protocol.overall_score}%`,
                                                        backgroundColor: getRiskColor(protocol.overall_score)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Top Risks:</p>
                                            <ul className="text-xs text-slate-500 space-y-1">
                                                {protocol.top_risks.map((risk, j) => (
                                                    <li key={j} className="flex items-start gap-1">
                                                        <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Alerts */}
                    {riskScores.risk_alerts.length > 0 && (
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    Active Risk Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {riskScores.risk_alerts.map((alert, i) => (
                                        <div key={i} className="p-4 border rounded-lg flex items-start gap-4">
                                            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="font-semibold">{alert.protocol}</h5>
                                                    <Badge className={getRiskLevelColor(alert.severity)}>
                                                        {alert.severity}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-1">
                                                    <strong>{alert.alert_type}:</strong> {alert.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recommendations */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Risk Mitigation Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {riskScores.recommendations.map((rec, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-semibold">{rec.category}</h5>
                                            <Badge className={getRiskLevelColor(rec.priority)}>
                                                {rec.priority} Priority
                                            </Badge>
                                        </div>
                                        <p className="text-slate-700">{rec.action}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}