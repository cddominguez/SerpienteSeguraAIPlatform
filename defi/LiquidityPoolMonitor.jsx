import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, AlertCircle, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function LiquidityPoolMonitor() {
    const [pools, setPools] = useState([]);
    const [selectedPool, setSelectedPool] = useState(null);
    const [poolAnalysis, setPoolAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [realTimeData, setRealTimeData] = useState([]);

    useEffect(() => {
        loadPools();
        generateRealTimeData();
        const interval = setInterval(generateRealTimeData, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadPools = () => {
        const mockPools = [
            {
                id: 'eth-usdc',
                name: 'ETH/USDC',
                protocol: 'Uniswap V3',
                tvl: '$125.4M',
                volume24h: '$45.2M',
                apy: '12.4%',
                utilization: 78,
                risk_score: 85
            },
            {
                id: 'wbtc-eth',
                name: 'WBTC/ETH',
                protocol: 'SushiSwap',
                tvl: '$67.8M',
                volume24h: '$23.1M',
                apy: '8.7%',
                utilization: 65,
                risk_score: 92
            },
            {
                id: 'dai-usdc',
                name: 'DAI/USDC',
                protocol: 'Curve',
                tvl: '$89.3M',
                volume24h: '$12.8M',
                apy: '3.2%',
                utilization: 45,
                risk_score: 96
            }
        ];
        setPools(mockPools);
        setSelectedPool(mockPools[0]);
    };

    const generateRealTimeData = () => {
        const newDataPoint = {
            time: new Date().toLocaleTimeString(),
            tvl: Math.floor(Math.random() * 10000000) + 120000000,
            volume: Math.floor(Math.random() * 5000000) + 40000000,
            utilization: Math.floor(Math.random() * 20) + 70
        };
        setRealTimeData(prev => [...prev.slice(-19), newDataPoint]);
    };

    const analyzePool = async (pool) => {
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze liquidity pool security and health:

Pool: ${pool.name}
Protocol: ${pool.protocol}
TVL: ${pool.tvl}
24h Volume: ${pool.volume24h}
APY: ${pool.apy}
Utilization: ${pool.utilization}%

Analyze:
1. Impermanent loss risk assessment
2. Liquidity concentration and whale impact
3. Price manipulation vulnerability
4. Smart contract security
5. Oracle dependency risks
6. Yield sustainability analysis
7. Exit liquidity scenarios
8. Historical volatility patterns

Provide comprehensive liquidity pool risk assessment.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        pool_health: {
                            type: "object",
                            properties: {
                                overall_score: { type: "number" },
                                liquidity_depth: { type: "string" },
                                price_stability: { type: "string" },
                                volume_consistency: { type: "string" }
                            }
                        },
                        risk_analysis: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    risk_type: { type: "string" },
                                    severity: { type: "string" },
                                    probability: { type: "number" },
                                    impact: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        },
                        impermanent_loss: {
                            type: "object",
                            properties: {
                                current_il: { type: "string" },
                                projected_il_24h: { type: "string" },
                                correlation_score: { type: "number" }
                            }
                        },
                        liquidity_metrics: {
                            type: "object",
                            properties: {
                                concentration_ratio: { type: "number" },
                                whale_impact_threshold: { type: "string" },
                                exit_capacity: { type: "string" }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                }
            });
            setPoolAnalysis(response);
        } catch (error) {
            console.error("Error analyzing pool:", error);
        }
        setIsAnalyzing(false);
    };

    const getRiskColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        if (score >= 50) return 'text-orange-600';
        return 'text-red-600';
    };

    const getSeverityColor = (severity) => ({
        Critical: 'bg-red-500 text-white',
        High: 'bg-orange-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-green-500 text-white'
    }[severity] || 'bg-slate-500 text-white');

    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

    return (
        <div className="space-y-6">
            {/* Pool Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                {pools.map((pool) => (
                    <motion.div
                        key={pool.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedPool(pool)}
                        className={`cursor-pointer ${selectedPool?.id === pool.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Droplets className="w-6 h-6 text-blue-600" />
                                    <Badge variant="outline">{pool.protocol}</Badge>
                                </div>
                                <CardTitle className="text-lg">{pool.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-slate-500">TVL</p>
                                        <p className="font-bold">{pool.tvl}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">24h Volume</p>
                                        <p className="font-bold">{pool.volume24h}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">APY</p>
                                        <p className="font-bold text-green-600">{pool.apy}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Risk Score</p>
                                        <p className={`font-bold text-lg ${getRiskColor(pool.risk_score)}`}>
                                            {pool.risk_score}%
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Utilization</p>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${pool.utilization}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">{pool.utilization}%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Real-time Monitoring */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Real-time Pool Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={realTimeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="tvl" stroke="#3b82f6" strokeWidth={2} name="TVL" />
                                <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} name="Volume" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Pool Analysis */}
            {selectedPool && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-slate-900">
                            Pool Analysis: {selectedPool.name}
                        </CardTitle>
                        <Button 
                            onClick={() => analyzePool(selectedPool)}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Deep Analysis'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {poolAnalysis ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {/* Pool Health Overview */}
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-sm text-slate-600">Overall Score</p>
                                        <p className={`text-2xl font-bold ${getRiskColor(poolAnalysis.pool_health.overall_score)}`}>
                                            {poolAnalysis.pool_health.overall_score}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-sm text-slate-600">Liquidity Depth</p>
                                        <p className="font-bold">{poolAnalysis.pool_health.liquidity_depth}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-sm text-slate-600">Price Stability</p>
                                        <p className="font-bold">{poolAnalysis.pool_health.price_stability}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-sm text-slate-600">Volume Consistency</p>
                                        <p className="font-bold">{poolAnalysis.pool_health.volume_consistency}</p>
                                    </div>
                                </div>

                                {/* Risk Analysis */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                        Risk Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        {poolAnalysis.risk_analysis.map((risk, i) => (
                                            <div key={i} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="font-semibold">{risk.risk_type}</h5>
                                                    <Badge className={getSeverityColor(risk.severity)}>
                                                        {risk.severity}
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-600 mb-2">{risk.description}</p>
                                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-slate-700">Probability: </span>
                                                        <span className="text-slate-600">{risk.probability}%</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-700">Impact: </span>
                                                        <span className="text-slate-600">{risk.impact}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Impermanent Loss Analysis */}
                                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-orange-800">Impermanent Loss Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-orange-600 font-medium">Current IL</p>
                                                <p className="text-2xl font-bold text-orange-800">
                                                    {poolAnalysis.impermanent_loss.current_il}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-orange-600 font-medium">24h Projection</p>
                                                <p className="text-xl font-bold text-orange-800">
                                                    {poolAnalysis.impermanent_loss.projected_il_24h}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-orange-600 font-medium">Asset Correlation</p>
                                                <p className="text-xl font-bold text-orange-800">
                                                    {poolAnalysis.impermanent_loss.correlation_score}%
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Liquidity Metrics */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-600 font-medium">Concentration Ratio</p>
                                        <p className="text-2xl font-bold text-blue-800">
                                            {poolAnalysis.liquidity_metrics.concentration_ratio}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-purple-600 font-medium">Whale Impact</p>
                                        <p className="text-lg font-bold text-purple-800">
                                            {poolAnalysis.liquidity_metrics.whale_impact_threshold}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-green-600 font-medium">Exit Capacity</p>
                                        <p className="text-lg font-bold text-green-800">
                                            {poolAnalysis.liquidity_metrics.exit_capacity}
                                        </p>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        Recommendations
                                    </h4>
                                    <ul className="space-y-2">
                                        {poolAnalysis.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                <span className="text-slate-700">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-8">
                                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600">Click "Deep Analysis" to perform comprehensive pool analysis</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}