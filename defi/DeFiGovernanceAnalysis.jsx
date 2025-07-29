import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Vote, Users, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DeFiGovernanceAnalysis() {
    const [tokenAddress, setTokenAddress] = useState('');
    const [governanceAnalysis, setGovernanceAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeGovernance = async () => {
        setIsAnalyzing(true);
        setGovernanceAnalysis(null);
        
        try {
            const response = await InvokeLLM({
                prompt: `Analyze DeFi protocol governance security and decentralization:

Token Address: ${tokenAddress || '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'}

Perform comprehensive governance analysis:
1. Token distribution and concentration analysis
2. Voting power distribution among holders
3. Governance proposal history and participation
4. Multi-signature wallet security
5. Admin key and privileged role analysis
6. Timelock and delay mechanism assessment
7. Quorum and voting threshold analysis
8. Delegate system and proxy voting
9. Governance attack vector assessment
10. Decentralization score calculation

Provide detailed governance security assessment with actionable insights.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        protocol_info: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                token_symbol: { type: "string" },
                                total_supply: { type: "string" },
                                market_cap: { type: "string" }
                            }
                        },
                        decentralization_score: { type: "number", minimum: 0, maximum: 100 },
                        token_distribution: {
                            type: "object",
                            properties: {
                                gini_coefficient: { type: "number" },
                                top_10_holders_percentage: { type: "number" },
                                whales_count: { type: "number" },
                                distribution_assessment: { type: "string" }
                            }
                        },
                        voting_analysis: {
                            type: "object",
                            properties: {
                                average_participation: { type: "number" },
                                quorum_threshold: { type: "number" },
                                passing_threshold: { type: "number" },
                                active_voters: { type: "number" }
                            }
                        },
                        governance_risks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    risk_type: { type: "string" },
                                    severity: { type: "string" },
                                    description: { type: "string" },
                                    likelihood: { type: "number" },
                                    impact: { type: "string" }
                                }
                            }
                        },
                        admin_controls: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    control_type: { type: "string" },
                                    holders: { type: "array", items: { type: "string" } },
                                    timelock_protected: { type: "boolean" },
                                    risk_level: { type: "string" }
                                }
                            }
                        },
                        proposal_history: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    proposal_id: { type: "string" },
                                    title: { type: "string" },
                                    status: { type: "string" },
                                    participation_rate: { type: "number" },
                                    outcome: { type: "string" }
                                }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    category: { type: "string" },
                                    recommendation: { type: "string" },
                                    priority: { type: "string" },
                                    implementation_difficulty: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setGovernanceAnalysis(response);
        } catch (error) {
            console.error("Error analyzing governance:", error);
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
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6'];

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        DeFi Governance Security Analyzer
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Governance Token Address
                        </label>
                        <Input
                            placeholder="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <Button 
                        onClick={analyzeGovernance}
                        disabled={isAnalyzing}
                        className="w-full"
                    >
                        {isAnalyzing ? 'Analyzing Governance...' : 'Analyze Governance Security'}
                    </Button>
                </CardContent>
            </Card>

            <AnimatePresence>
                {governanceAnalysis && (
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
                                        <p className="font-bold text-lg">{governanceAnalysis.protocol_info.name}</p>
                                        <p className="text-sm text-slate-500">{governanceAnalysis.protocol_info.token_symbol}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Total Supply</p>
                                        <p className="font-bold">{governanceAnalysis.protocol_info.total_supply}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Market Cap</p>
                                        <p className="font-bold text-green-600">{governanceAnalysis.protocol_info.market_cap}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Decentralization Score</p>
                                        <p className={`font-bold text-2xl ${getScoreColor(governanceAnalysis.decentralization_score)}`}>
                                            {governanceAnalysis.decentralization_score}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Token Distribution Analysis */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    Token Distribution Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-600 font-medium">Gini Coefficient</p>
                                            <p className="text-2xl font-bold text-blue-800">
                                                {governanceAnalysis.token_distribution.gini_coefficient}
                                            </p>
                                            <p className="text-xs text-blue-600">0 = Perfect equality, 1 = Perfect inequality</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-600 font-medium">Top 10 Holders</p>
                                            <p className="text-2xl font-bold text-orange-800">
                                                {governanceAnalysis.token_distribution.top_10_holders_percentage}%
                                            </p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-purple-600 font-medium">Whale Count</p>
                                            <p className="text-2xl font-bold text-purple-800">
                                                {governanceAnalysis.token_distribution.whales_count}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <h5 className="font-semibold mb-2">Distribution Assessment</h5>
                                        <p className="text-slate-700">
                                            {governanceAnalysis.token_distribution.distribution_assessment}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Voting Analysis */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Vote className="w-5 h-5 text-green-600" />
                                    Voting Participation Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg text-center">
                                        <p className="text-sm text-green-600 font-medium">Avg Participation</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {governanceAnalysis.voting_analysis.average_participation}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                                        <p className="text-sm text-blue-600 font-medium">Quorum Threshold</p>
                                        <p className="text-2xl font-bold text-blue-800">
                                            {governanceAnalysis.voting_analysis.quorum_threshold}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg text-center">
                                        <p className="text-sm text-yellow-600 font-medium">Passing Threshold</p>
                                        <p className="text-2xl font-bold text-yellow-800">
                                            {governanceAnalysis.voting_analysis.passing_threshold}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                                        <p className="text-sm text-purple-600 font-medium">Active Voters</p>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {governanceAnalysis.voting_analysis.active_voters}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Controls */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Key className="w-5 h-5 text-red-600" />
                                    Administrative Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {governanceAnalysis.admin_controls.map((control, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-lg">{control.control_type}</h5>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getSeverityColor(control.risk_level)}>
                                                        {control.risk_level}
                                                    </Badge>
                                                    <Badge className={control.timelock_protected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                                        {control.timelock_protected ? 'Timelock Protected' : 'No Timelock'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600 mb-2">Control Holders:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {control.holders.map((holder, j) => (
                                                        <Badge key={j} variant="outline" className="font-mono text-xs">
                                                            {holder}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Governance Risks */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-orange-600" />
                                    Governance Risk Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {governanceAnalysis.governance_risks.map((risk, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-lg">{risk.risk_type}</h5>
                                                <Badge className={getSeverityColor(risk.severity)}>
                                                    {risk.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 mb-3">{risk.description}</p>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 mb-1">Likelihood:</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${risk.likelihood}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">{risk.likelihood}%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">Impact:</p>
                                                    <p className="text-slate-600">{risk.impact}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Proposals */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Recent Governance Proposals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {governanceAnalysis.proposal_history.map((proposal, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold">{proposal.title}</h5>
                                                <Badge className={proposal.status === 'Passed' ? 'bg-green-500 text-white' : proposal.status === 'Failed' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}>
                                                    {proposal.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>Proposal #{proposal.proposal_id}</span>
                                                <span>Participation: {proposal.participation_rate}%</span>
                                                <span>{proposal.outcome}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Governance Security Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {governanceAnalysis.recommendations.map((rec, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold">{rec.category}</h5>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getSeverityColor(rec.priority)}>
                                                        {rec.priority} Priority
                                                    </Badge>
                                                    <span className="text-sm text-slate-600">{rec.implementation_difficulty}</span>
                                                </div>
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