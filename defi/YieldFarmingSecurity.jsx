import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, AlertTriangle, Coins, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function YieldFarmingSecurity() {
    const [farmAddress, setFarmAddress] = useState('');
    const [securityAnalysis, setSecurityAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeFarm = async () => {
        setIsAnalyzing(true);
        setSecurityAnalysis(null);
        
        try {
            const response = await InvokeLLM({
                prompt: `Analyze yield farming security for farm contract:

Farm Address: ${farmAddress || '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'}

Perform comprehensive yield farming security analysis:
1. Smart contract audit status and vulnerabilities
2. Reward tokenomics and sustainability
3. Impermanent loss calculation and projections
4. Liquidity provider token security
5. Flash loan attack vectors
6. Governance and admin key risks
7. Oracle dependency and price manipulation
8. Exit strategy and liquidity risks
9. APY sustainability analysis
10. Historical performance and risk patterns

Provide detailed security assessment with risk scores and recommendations.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        farm_info: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                protocol: { type: "string" },
                                tvl: { type: "string" },
                                apy: { type: "string" },
                                reward_token: { type: "string" }
                            }
                        },
                        security_score: { type: "number", minimum: 0, maximum: 100 },
                        risk_assessment: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    risk_category: { type: "string" },
                                    severity: { type: "string" },
                                    probability: { type: "number" },
                                    description: { type: "string" },
                                    mitigation: { type: "string" }
                                }
                            }
                        },
                        yield_analysis: {
                            type: "object",
                            properties: {
                                sustainability_score: { type: "number" },
                                projected_apy_6m: { type: "string" },
                                reward_inflation_rate: { type: "string" },
                                exit_penalty: { type: "string" }
                            }
                        },
                        impermanent_loss: {
                            type: "object", 
                            properties: {
                                current_il: { type: "string" },
                                worst_case_il: { type: "string" },
                                breakeven_time: { type: "string" }
                            }
                        },
                        smart_contract_risks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    vulnerability: { type: "string" },
                                    severity: { type: "string" },
                                    exploitability: { type: "string" },
                                    impact: { type: "string" }
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
                                    priority: { type: "string" },
                                    timeframe: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setSecurityAnalysis(response);
        } catch (error) {
            console.error("Error analyzing yield farm:", error);
        }
        setIsAnalyzing(false);
    };

    const getSeverityColor = (severity) => ({
        Critical: 'bg-red-500 text-white',
        High: 'bg-orange-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-green-500 text-white'
    }[severity] || 'bg-slate-500 text-white');

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
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Yield Farming Security Analyzer
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Yield Farm Contract Address
                        </label>
                        <Input
                            placeholder="0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
                            value={farmAddress}
                            onChange={(e) => setFarmAddress(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <Button 
                        onClick={analyzeFarm}
                        disabled={isAnalyzing}
                        className="w-full"
                    >
                        {isAnalyzing ? 'Analyzing Yield Farm...' : 'Analyze Yield Farm Security'}
                    </Button>
                </CardContent>
            </Card>

            <AnimatePresence>
                {securityAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Farm Overview */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-amber-600" />
                                    Farm Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Farm</p>
                                        <p className="font-bold">{securityAnalysis.farm_info.name}</p>
                                        <p className="text-sm text-slate-500">{securityAnalysis.farm_info.protocol}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">TVL</p>
                                        <p className="font-bold text-green-600">{securityAnalysis.farm_info.tvl}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">APY</p>
                                        <p className="font-bold text-blue-600">{securityAnalysis.farm_info.apy}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Reward Token</p>
                                        <p className="font-bold">{securityAnalysis.farm_info.reward_token}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Security Score</p>
                                        <p className={`font-bold text-2xl ${getScoreColor(securityAnalysis.security_score)}`}>
                                            {securityAnalysis.security_score}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Yield Analysis */}
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Yield Sustainability Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-green-600 font-medium">Sustainability Score</p>
                                        <p className={`text-3xl font-bold ${getScoreColor(securityAnalysis.yield_analysis.sustainability_score)}`}>
                                            {securityAnalysis.yield_analysis.sustainability_score}%
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-green-600 font-medium">6M APY Projection</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {securityAnalysis.yield_analysis.projected_apy_6m}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-green-600 font-medium">Reward Inflation</p>
                                        <p className="text-xl font-bold text-orange-600">
                                            {securityAnalysis.yield_analysis.reward_inflation_rate}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-green-600 font-medium">Exit Penalty</p>
                                        <p className="text-xl font-bold text-red-600">
                                            {securityAnalysis.yield_analysis.exit_penalty}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Impermanent Loss Analysis */}
                        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-orange-800">Impermanent Loss Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-orange-600 font-medium">Current IL</p>
                                        <p className="text-2xl font-bold text-orange-800">
                                            {securityAnalysis.impermanent_loss.current_il}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-orange-600 font-medium">Worst Case IL</p>
                                        <p className="text-2xl font-bold text-red-800">
                                            {securityAnalysis.impermanent_loss.worst_case_il}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-orange-600 font-medium">Breakeven Time</p>
                                        <p className="text-xl font-bold text-green-800">
                                            {securityAnalysis.impermanent_loss.breakeven_time}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Risk Assessment */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    Risk Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {securityAnalysis.risk_assessment.map((risk, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-lg">{risk.risk_category}</h5>
                                                <Badge className={getSeverityColor(risk.severity)}>
                                                    {risk.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 mb-3">{risk.description}</p>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 mb-1">Probability:</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${risk.probability}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">{risk.probability}%</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Mitigation:</strong> {risk.mitigation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Smart Contract Risks */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    Smart Contract Vulnerabilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {securityAnalysis.smart_contract_risks.map((risk, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold">{risk.vulnerability}</h5>
                                                <Badge className={getSeverityColor(risk.severity)}>
                                                    {risk.severity}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-slate-700">Exploitability: </span>
                                                    <span className="text-slate-600">{risk.exploitability}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">Impact: </span>
                                                    <span className="text-slate-600">{risk.impact}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-600" />
                                    Security Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {securityAnalysis.recommendations.map((rec, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold">{rec.category}</h5>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getSeverityColor(rec.priority)}>
                                                        {rec.priority}
                                                    </Badge>
                                                    <span className="text-sm text-slate-600">{rec.timeframe}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-700">{rec.action}</p>
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