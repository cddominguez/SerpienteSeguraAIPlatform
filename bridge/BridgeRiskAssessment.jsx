import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp, Shield, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function BridgeRiskAssessment({ bridgeData }) {
    const [riskAssessment, setRiskAssessment] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

    useEffect(() => {
        if (bridgeData.length > 0) {
            performRiskAssessment();
        }
    }, [bridgeData, selectedTimeframe]);

    const performRiskAssessment = async () => {
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Perform comprehensive risk assessment for cross-chain bridges:

Bridge Data: ${JSON.stringify(bridgeData)}
Timeframe: ${selectedTimeframe}

Analyze risks across multiple dimensions:
1. Liquidity Risk - Insufficient funds for withdrawals
2. Smart Contract Risk - Code vulnerabilities and exploits
3. Validator Risk - Centralization and collusion
4. Oracle Risk - Price manipulation and data feeds
5. Operational Risk - Key management and governance
6. Market Risk - Token volatility and slippage
7. Regulatory Risk - Compliance and legal issues
8. Technical Risk - Network downtime and congestion

Provide risk scores, trends, and mitigation strategies.`,
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
                                    trend: { type: "string", enum: ["increasing", "stable", "decreasing"] },
                                    impact: { type: "string", enum: ["low", "medium", "high", "critical"] },
                                    probability: { type: "number" }
                                }
                            }
                        },
                        risk_events: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    event: { type: "string" },
                                    bridge: { type: "string" },
                                    severity: { type: "string" },
                                    impact_value: { type: "string" },
                                    timestamp: { type: "string" }
                                }
                            }
                        },
                        mitigation_strategies: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    risk_type: { type: "string" },
                                    strategy: { type: "string" },
                                    effectiveness: { type: "number" },
                                    implementation_cost: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setRiskAssessment(response);
        } catch (error) {
            console.error("Error performing risk assessment:", error);
        }
        setIsAnalyzing(false);
    };

    const getRiskColor = (score) => {
        if (score >= 80) return '#ef4444'; // red
        if (score >= 60) return '#f59e0b'; // amber
        if (score >= 40) return '#eab308'; // yellow
        return '#10b981'; // green
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
            case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
            default: return <Target className="w-4 h-4 text-blue-500" />;
        }
    };

    const getImpactColor = (impact) => ({
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    }[impact] || 'bg-slate-100 text-slate-800');

    const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6'];

    return (
        <div className="space-y-6">
            {/* Risk Assessment Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Bridge Risk Assessment
                    </CardTitle>
                    <div className="flex gap-3">
                        {['24h', '7d', '30d'].map((timeframe) => (
                            <Button
                                key={timeframe}
                                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTimeframe(timeframe)}
                            >
                                {timeframe}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={performRiskAssessment}
                        disabled={isAnalyzing}
                        className="w-full"
                    >
                        {isAnalyzing ? 'Analyzing Risks...' : 'Refresh Risk Assessment'}
                    </Button>
                </CardContent>
            </Card>

            {riskAssessment && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Overall Risk Score */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Overall Risk Score</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <div className="text-center">
                                <div className="relative w-32 h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { value: riskAssessment.overall_risk_score, fill: getRiskColor(riskAssessment.overall_risk_score) },
                                                    { value: 100 - riskAssessment.overall_risk_score, fill: '#e2e8f0' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                startAngle={90}
                                                endAngle={450}
                                                dataKey="value"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold" style={{ color: getRiskColor(riskAssessment.overall_risk_score) }}>
                                            {riskAssessment.overall_risk_score}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-slate-600">Risk Score</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Categories */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Risk Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={riskAssessment.risk_categories}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="score" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                {riskAssessment.risk_categories.map((category, i) => (
                                    <div key={i} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-semibold">{category.category}</h5>
                                            <div className="flex items-center gap-2">
                                                {getTrendIcon(category.trend)}
                                                <Badge className={getImpactColor(category.impact)}>
                                                    {category.impact}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Risk Score</span>
                                            <span className="font-bold" style={{ color: getRiskColor(category.score) }}>
                                                {category.score}/100
                                            </span>
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

                    {/* Recent Risk Events */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Risk Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {riskAssessment.risk_events.map((event, i) => (
                                    <div key={i} className="p-4 border rounded-lg flex items-center justify-between">
                                        <div>
                                            <h5 className="font-semibold">{event.event}</h5>
                                            <p className="text-sm text-slate-600">{event.bridge}</p>
                                            <p className="text-xs text-slate-500">{event.timestamp}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={getImpactColor(event.severity.toLowerCase())}>
                                                {event.severity}
                                            </Badge>
                                            <p className="text-sm font-medium mt-1">{event.impact_value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mitigation Strategies */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                Mitigation Strategies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {riskAssessment.mitigation_strategies.map((strategy, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-semibold">{strategy.risk_type}</h5>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-600">
                                                    Effectiveness: {strategy.effectiveness}%
                                                </span>
                                                <Badge variant="outline">{strategy.implementation_cost}</Badge>
                                            </div>
                                        </div>
                                        <p className="text-slate-700">{strategy.strategy}</p>
                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${strategy.effectiveness}%` }}
                                            />
                                        </div>
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