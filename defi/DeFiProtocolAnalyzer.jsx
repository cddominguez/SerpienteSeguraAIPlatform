import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Banknote, TrendingUp, AlertTriangle, Shield, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeFiProtocolAnalyzer({ protocolData }) {
    const [protocolAddress, setProtocolAddress] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeProtocol = async () => {
        setIsAnalyzing(true);
        setAnalysisResults(null);
        
        try {
            const response = await InvokeLLM({
                prompt: `Perform comprehensive DeFi protocol security analysis:

Protocol Address: ${protocolAddress || '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'}
Protocol Data: ${JSON.stringify(protocolData)}

Analyze:
1. Smart contract security and audit status
2. Liquidity pool health and composition
3. Governance token distribution and voting power
4. Oracle dependencies and price feed security
5. Flash loan attack vectors
6. Economic exploit scenarios
7. Collateralization ratios and liquidation risks
8. Code upgrade mechanisms and admin keys
9. Treasury and token economics
10. Historical security incidents

Provide comprehensive risk assessment with actionable insights.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        protocol_info: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                tvl: { type: "string" },
                                token_symbol: { type: "string" },
                                category: { type: "string" },
                                audit_status: { type: "string" }
                            }
                        },
                        security_score: { type: "number", minimum: 0, maximum: 100 },
                        risk_factors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    category: { type: "string" },
                                    risk_level: { type: "string" },
                                    description: { type: "string" },
                                    impact: { type: "string" },
                                    likelihood: { type: "string" }
                                }
                            }
                        },
                        liquidity_analysis: {
                            type: "object",
                            properties: {
                                total_liquidity: { type: "string" },
                                pool_distribution: { type: "array", items: { type: "object" } },
                                concentration_risk: { type: "string" },
                                withdrawal_capacity: { type: "string" }
                            }
                        },
                        governance_analysis: {
                            type: "object",
                            properties: {
                                token_distribution: { type: "string" },
                                voting_power_concentration: { type: "number" },
                                admin_privileges: { type: "array", items: { type: "string" } },
                                timelock_status: { type: "boolean" }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    priority: { type: "string" },
                                    recommendation: { type: "string" },
                                    implementation_difficulty: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setAnalysisResults(response);
        } catch (error) {
            console.error("Error analyzing DeFi protocol:", error);
        }
        setIsAnalyzing(false);
    };

    const getRiskColor = (riskLevel) => ({
        Critical: 'bg-red-500 text-white',
        High: 'bg-orange-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-green-500 text-white'
    }[riskLevel] || 'bg-slate-500 text-white');

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        if (score >= 50) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-600" />
                        DeFi Protocol Security Analyzer
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Protocol Contract Address
                        </label>
                        <Input
                            placeholder="0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
                            value={protocolAddress}
                            onChange={(e) => setProtocolAddress(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <Button 
                        onClick={analyzeProtocol}
                        disabled={isAnalyzing}
                        className="w-full"
                    >
                        {isAnalyzing ? 'Analyzing Protocol...' : 'Analyze DeFi Protocol'}
                    </Button>
                </CardContent>
            </Card>

            <AnimatePresence>
                {analysisResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Protocol Overview */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Protocol Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Protocol</p>
                                        <p className="font-bold text-lg">{analysisResults.protocol_info.name}</p>
                                        <p className="text-sm text-slate-500">{analysisResults.protocol_info.category}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">TVL</p>
                                        <p className="font-bold text-lg text-green-600">{analysisResults.protocol_info.tvl}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Security Score</p>
                                        <p className={`font-bold text-2xl ${getScoreColor(analysisResults.security_score)}`}>
                                            {analysisResults.security_score}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Audit Status</p>
                                        <Badge className={analysisResults.protocol_info.audit_status === 'Audited' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}>
                                            {analysisResults.protocol_info.audit_status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Risk Factors */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    Risk Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analysisResults.risk_factors.map((risk, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-lg">{risk.category}</h5>
                                                <Badge className={getRiskColor(risk.risk_level)}>
                                                    {risk.risk_level}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 mb-3">{risk.description}</p>
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-slate-700">Impact: </span>
                                                    <span className="text-slate-600">{risk.impact}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">Likelihood: </span>
                                                    <span className="text-slate-600">{risk.likelihood}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Liquidity Analysis */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-blue-600" />
                                    Liquidity Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-600 font-medium">Total Liquidity</p>
                                            <p className="text-2xl font-bold text-blue-800">
                                                {analysisResults.liquidity_analysis.total_liquidity}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                            <p className="text-sm text-yellow-600 font-medium">Concentration Risk</p>
                                            <p className="text-lg font-bold text-yellow-800">
                                                {analysisResults.liquidity_analysis.concentration_risk}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-green-600 font-medium">Withdrawal Capacity</p>
                                        <p className="text-lg font-bold text-green-800">
                                            {analysisResults.liquidity_analysis.withdrawal_capacity}
                                        </p>
                                        <p className="text-sm text-green-600 mt-2">
                                            Maximum single withdrawal without significant slippage
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Governance Analysis */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                    Governance & Control Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Token Distribution</p>
                                            <p className="font-semibold">{analysisResults.governance_analysis.token_distribution}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Voting Power Concentration</p>
                                            <div className="flex items-center gap-3">
                                                <p className="font-semibold text-lg">{analysisResults.governance_analysis.voting_power_concentration}%</p>
                                                <Badge className={analysisResults.governance_analysis.voting_power_concentration > 50 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                                                    {analysisResults.governance_analysis.voting_power_concentration > 50 ? 'Centralized' : 'Decentralized'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 mb-1">Timelock Protection</p>
                                            <Badge className={analysisResults.governance_analysis.timelock_status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                                {analysisResults.governance_analysis.timelock_status ? 'Protected' : 'Not Protected'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-2">Admin Privileges</p>
                                        <div className="space-y-2">
                                            {analysisResults.governance_analysis.admin_privileges.map((privilege, i) => (
                                                <div key={i} className="p-2 bg-slate-100 rounded text-sm">
                                                    {privilege}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Security Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analysisResults.recommendations.map((rec, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge className={getRiskColor(rec.priority)}>
                                                    {rec.priority} Priority
                                                </Badge>
                                                <span className="text-sm text-slate-600">
                                                    {rec.implementation_difficulty} to implement
                                                </span>
                                            </div>
                                            <p className="text-slate-700">{rec.recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}