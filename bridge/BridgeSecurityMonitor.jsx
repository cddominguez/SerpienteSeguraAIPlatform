import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, Shield, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BridgeSecurityMonitor({ bridgeData }) {
    const [bridges, setBridges] = useState([]);
    const [selectedBridge, setSelectedBridge] = useState(null);
    const [securityAnalysis, setSecurityAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [realTimeData, setRealTimeData] = useState([]);

    useEffect(() => {
        loadBridgeData();
        generateRealTimeData();
        const interval = setInterval(generateRealTimeData, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadBridgeData = () => {
        const mockBridges = [
            {
                id: 'eth-polygon',
                name: 'Ethereum ↔ Polygon',
                status: 'secure',
                volume24h: '15.2M',
                transactions: 2847,
                tvl: '124.5M',
                securityScore: 95,
                validators: 12,
                lastUpdate: new Date()
            },
            {
                id: 'bsc-avalanche',
                name: 'BSC ↔ Avalanche',
                status: 'monitoring',
                volume24h: '8.7M',
                transactions: 1523,
                tvl: '67.3M',
                securityScore: 88,
                validators: 8,
                lastUpdate: new Date()
            },
            {
                id: 'eth-arbitrum',
                name: 'Ethereum ↔ Arbitrum',
                status: 'secure',
                volume24h: '22.1M',
                transactions: 3456,
                tvl: '189.7M',
                securityScore: 97,
                validators: 15,
                lastUpdate: new Date()
            }
        ];
        setBridges(mockBridges);
        setSelectedBridge(mockBridges[0]);
    };

    const generateRealTimeData = () => {
        const newDataPoint = {
            time: new Date().toLocaleTimeString(),
            volume: Math.floor(Math.random() * 1000000) + 500000,
            transactions: Math.floor(Math.random() * 100) + 50,
            securityScore: Math.floor(Math.random() * 10) + 90
        };
        setRealTimeData(prev => [...prev.slice(-19), newDataPoint]);
    };

    const analyzeBridgeSecurity = async (bridge) => {
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze cross-chain bridge security for: ${bridge.name}

Bridge Details:
- TVL: $${bridge.tvl}
- 24h Volume: $${bridge.volume24h}
- Validators: ${bridge.validators}
- Current Security Score: ${bridge.securityScore}

Analyze:
1. Bridge protocol security mechanisms
2. Validator network integrity
3. Smart contract vulnerabilities
4. Liquidity risks
5. Oracle dependencies
6. Multi-sig security
7. Slashing conditions
8. Emergency pause mechanisms

Provide comprehensive security assessment with recommendations.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        security_assessment: {
                            type: "object",
                            properties: {
                                overall_score: { type: "number" },
                                risk_level: { type: "string" },
                                validator_health: { type: "number" },
                                smart_contract_security: { type: "number" }
                            }
                        },
                        vulnerabilities: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string" },
                                    severity: { type: "string" },
                                    description: { type: "string" },
                                    mitigation: { type: "string" }
                                }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: { type: "string" }
                        },
                        security_metrics: {
                            type: "object",
                            properties: {
                                uptime: { type: "number" },
                                failed_transactions: { type: "number" },
                                avg_confirmation_time: { type: "number" }
                            }
                        }
                    }
                }
            });
            setSecurityAnalysis(response);
        } catch (error) {
            console.error("Error analyzing bridge security:", error);
        }
        setIsAnalyzing(false);
    };

    const getStatusColor = (status) => ({
        secure: 'bg-green-100 text-green-800',
        monitoring: 'bg-yellow-100 text-yellow-800',
        warning: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    }[status] || 'bg-slate-100 text-slate-800');

    const getSecurityScoreColor = (score) => {
        if (score >= 95) return 'text-green-600';
        if (score >= 85) return 'text-yellow-600';
        if (score >= 70) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Bridge Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {bridges.map((bridge) => (
                    <motion.div
                        key={bridge.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedBridge(bridge)}
                        className={`cursor-pointer ${selectedBridge?.id === bridge.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <GitCompareArrows className="w-6 h-6 text-blue-600" />
                                    <Badge className={getStatusColor(bridge.status)}>
                                        {bridge.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg">{bridge.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">TVL</p>
                                        <p className="font-bold">${bridge.tvl}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">24h Volume</p>
                                        <p className="font-bold">${bridge.volume24h}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Transactions</p>
                                        <p className="font-bold">{bridge.transactions.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Security Score</p>
                                        <p className={`font-bold text-xl ${getSecurityScoreColor(bridge.securityScore)}`}>
                                            {bridge.securityScore}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Real-time Analytics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        Real-time Bridge Analytics
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
                                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Security Analysis */}
            {selectedBridge && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            Security Analysis: {selectedBridge.name}
                        </CardTitle>
                        <Button 
                            onClick={() => analyzeBridgeSecurity(selectedBridge)}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Deep Analysis'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {securityAnalysis ? (
                            <div className="space-y-6">
                                {/* Security Metrics */}
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Overall Score</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {securityAnalysis.security_assessment.overall_score}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Validator Health</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {securityAnalysis.security_assessment.validator_health}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Contract Security</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {securityAnalysis.security_assessment.smart_contract_security}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Risk Level</p>
                                        <p className="text-lg font-bold text-orange-600">
                                            {securityAnalysis.security_assessment.risk_level}
                                        </p>
                                    </div>
                                </div>

                                {/* Vulnerabilities */}
                                {securityAnalysis.vulnerabilities.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                            Identified Vulnerabilities
                                        </h4>
                                        <div className="space-y-3">
                                            {securityAnalysis.vulnerabilities.map((vuln, i) => (
                                                <div key={i} className="p-4 border rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-semibold">{vuln.type}</h5>
                                                        <Badge className={vuln.severity === 'High' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}>
                                                            {vuln.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-slate-600 mb-2">{vuln.description}</p>
                                                    <p className="text-sm text-green-600 font-medium">
                                                        <strong>Mitigation:</strong> {vuln.mitigation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        Security Recommendations
                                    </h4>
                                    <ul className="space-y-2">
                                        {securityAnalysis.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                <span className="text-slate-700">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600">Click "Deep Analysis" to perform comprehensive security assessment</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}