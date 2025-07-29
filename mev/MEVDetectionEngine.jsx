import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, AlertTriangle, Shield, Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function MEVDetectionEngine({ mevData }) {
    const [detection, setDetection] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [realTimeAlerts, setRealTimeAlerts] = useState([]);

    const scanForMEV = async () => {
        setIsScanning(true);
        setDetection(null);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze current mempool and transaction patterns for MEV opportunities and threats:

Simulated Mempool Data:
- Large DEX swap: 500 ETH -> USDC on Uniswap
- Liquidation opportunity: $2M position on Compound
- Arbitrage spread: 0.5% between Uniswap and Sushiswap
- NFT mint: High gas fees, potential front-running target
- Flash loan transactions detected

Current MEV Data: ${JSON.stringify(mevData)}

Detect and analyze:
1. Sandwich attack opportunities and risks
2. Front-running vulnerabilities
3. Back-running profit potential
4. Flash loan arbitrage opportunities
5. Liquidation MEV extraction
6. Cross-DEX arbitrage spreads

Provide real-time threat assessment with profit estimates and risk levels.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        mev_opportunities: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string", enum: ["Sandwich Attack", "Front-running", "Back-running", "Arbitrage", "Liquidation"] },
                                    profit_estimate: { type: "string" },
                                    risk_level: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
                                    target_transaction: { type: "string" },
                                    gas_cost: { type: "string" },
                                    success_probability: { type: "number" },
                                    time_window: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        },
                        threat_analysis: {
                            type: "object",
                            properties: {
                                user_vulnerability: { type: "number" },
                                protocol_risk: { type: "number" },
                                network_congestion: { type: "number" },
                                gas_price_impact: { type: "string" }
                            }
                        },
                        protection_recommendations: {
                            type: "array",
                            items: { type: "string" }
                        },
                        market_impact: {
                            type: "object",
                            properties: {
                                volume_affected: { type: "string" },
                                slippage_increase: { type: "string" },
                                price_manipulation_risk: { type: "number" }
                            }
                        }
                    }
                }
            });
            setDetection(response);
            
            // Simulate real-time alerts
            if (response.mev_opportunities.length > 0) {
                const alerts = response.mev_opportunities
                    .filter(opp => opp.risk_level === "Critical" || opp.risk_level === "High")
                    .map(opp => ({
                        id: Date.now() + Math.random(),
                        type: opp.type,
                        message: `${opp.type} detected - ${opp.profit_estimate} potential profit`,
                        severity: opp.risk_level,
                        timestamp: new Date()
                    }));
                setRealTimeAlerts(alerts);
            }
        } catch (error) {
            console.error("Failed to detect MEV:", error);
        }
        setIsScanning(false);
    };

    const getRiskColor = (risk) => ({
        Critical: "bg-red-500 text-white",
        High: "bg-orange-500 text-white",
        Medium: "bg-yellow-500 text-white",
        Low: "bg-green-500 text-white"
    }[risk] || "bg-slate-500 text-white");

    const getMEVTypeIcon = (type) => ({
        "Sandwich Attack": Bot,
        "Front-running": Zap,
        "Back-running": TrendingUp,
        "Arbitrage": Shield,
        "Liquidation": AlertTriangle
    }[type] || Bot);

    // Simulate real-time MEV detection chart data
    const chartData = Array.from({ length: 20 }, (_, i) => ({
        time: `${i}:00`,
        opportunities: Math.floor(Math.random() * 10) + 1,
        profit: Math.floor(Math.random() * 5) + 0.5,
        threats: Math.floor(Math.random() * 3)
    }));

    return (
        <div className="space-y-6">
            {/* Real-time Alerts */}
            <AnimatePresence>
                {realTimeAlerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>MEV Alert:</strong> {alert.message} - 
                                <Badge className={getRiskColor(alert.severity)} variant="secondary">
                                    {alert.severity}
                                </Badge>
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                ))}
            </AnimatePresence>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-teal-600" />
                        Real-time MEV Detection Engine
                    </CardTitle>
                    <Button onClick={scanForMEV} disabled={isScanning} className="bg-teal-600 hover:bg-teal-700">
                        {isScanning ? 'Scanning Mempool...' : 'Scan for MEV'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* MEV Detection Chart */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Real-time MEV Activity</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="opportunities" stroke="#14b8a6" strokeWidth={2} name="Opportunities" />
                                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} name="Profit (ETH)" />
                                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Threats" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {detection && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* MEV Opportunities */}
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-500" />
                                    Detected MEV Opportunities ({detection.mev_opportunities?.length || 0})
                                </h3>
                                <div className="grid gap-4">
                                    {detection.mev_opportunities?.map((opportunity, i) => {
                                        const IconComponent = getMEVTypeIcon(opportunity.type);
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <IconComponent className="w-6 h-6 text-teal-600" />
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">{opportunity.type}</h4>
                                                            <p className="text-sm text-slate-600">{opportunity.description}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={getRiskColor(opportunity.risk_level)}>
                                                        {opportunity.risk_level}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="grid md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-slate-700">Profit Estimate:</span>
                                                        <p className="text-emerald-600 font-bold">{opportunity.profit_estimate}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-700">Gas Cost:</span>
                                                        <p className="text-orange-600">{opportunity.gas_cost}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-700">Success Rate:</span>
                                                        <p className="text-blue-600">{opportunity.success_probability}%</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-700">Time Window:</span>
                                                        <p className="text-purple-600">{opportunity.time_window}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 p-2 bg-slate-100 rounded text-xs font-mono">
                                                    <strong>Target:</strong> {opportunity.target_transaction}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Threat Analysis */}
                            {detection.threat_analysis && (
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Card className="p-4">
                                        <h4 className="font-semibold text-slate-900 mb-2">User Vulnerability</h4>
                                        <div className="text-2xl font-bold text-red-600">
                                            {detection.threat_analysis.user_vulnerability}%
                                        </div>
                                        <p className="text-sm text-slate-600">Risk of MEV extraction</p>
                                    </Card>
                                    <Card className="p-4">
                                        <h4 className="font-semibold text-slate-900 mb-2">Protocol Risk</h4>
                                        <div className="text-2xl font-bold text-orange-600">
                                            {detection.threat_analysis.protocol_risk}%
                                        </div>
                                        <p className="text-sm text-slate-600">Protocol manipulation risk</p>
                                    </Card>
                                    <Card className="p-4">
                                        <h4 className="font-semibold text-slate-900 mb-2">Network Congestion</h4>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {detection.threat_analysis.network_congestion}%
                                        </div>
                                        <p className="text-sm text-slate-600">Current network load</p>
                                    </Card>
                                </div>
                            )}

                            {/* Market Impact */}
                            {detection.market_impact && (
                                <Card className="p-4 bg-amber-50 border-amber-200">
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-amber-600" />
                                        Market Impact Analysis
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-amber-800">Volume Affected:</span>
                                            <p className="text-amber-900 font-bold">{detection.market_impact.volume_affected}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-amber-800">Slippage Increase:</span>
                                            <p className="text-amber-900 font-bold">{detection.market_impact.slippage_increase}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-amber-800">Price Manipulation Risk:</span>
                                            <p className="text-amber-900 font-bold">{detection.market_impact.price_manipulation_risk}%</p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Protection Recommendations */}
                            {detection.protection_recommendations && (
                                <Card className="p-4 bg-green-50 border-green-200">
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        Protection Recommendations
                                    </h3>
                                    <ul className="space-y-2">
                                        {detection.protection_recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-sm text-green-900">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}