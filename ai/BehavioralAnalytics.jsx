import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Brain, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BehavioralAnalytics() {
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runBehavioralAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze user and entity behavioral patterns to detect anomalies and security threats. Focus on identifying insider threats, compromised accounts, and unusual access patterns.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        user_risk_profiles: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    user_id: { type: "string" },
                                    risk_score: { type: "number" },
                                    anomalies: { type: "array", items: { type: "string" } },
                                    baseline_deviation: { type: "number" }
                                }
                            }
                        },
                        behavioral_insights: { type: "array", items: { type: "string" } },
                        threat_indicators: { type: "array", items: { type: "string" } },
                        recommendations: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setAnalysis(response);
        } catch (error) {
            console.error('Behavioral analysis failed:', error);
        }
        setIsAnalyzing(false);
    };

    const getRiskColor = (score) => {
        if (score > 80) return 'text-red-600';
        if (score > 60) return 'text-orange-600';
        if (score > 40) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getRiskBadge = (score) => {
        if (score > 80) return 'bg-red-100 text-red-800';
        if (score > 60) return 'bg-orange-100 text-orange-800';
        if (score > 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-600" />
                        Behavioral Analytics Engine
                    </CardTitle>
                    <CardDescription>Advanced user and entity behavior analysis for threat detection.</CardDescription>
                </div>
                <Button onClick={runBehavioralAnalysis} disabled={isAnalyzing}>
                    <Brain className="w-4 h-4 mr-2" /> {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
            </CardHeader>
            <CardContent>
                {!analysis && !isAnalyzing && (
                    <div className="text-center py-12">
                        <Users className="mx-auto w-12 h-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium">Ready for Behavioral Analysis</h3>
                        <p className="text-slate-500 text-sm">Click "Run Analysis" to analyze user behavior patterns.</p>
                    </div>
                )}
                
                {isAnalyzing && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-700">Analyzing behavioral patterns...</p>
                    </div>
                )}

                {analysis && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                User Risk Profiles
                            </h3>
                            <div className="grid gap-4">
                                {analysis.user_risk_profiles?.map((profile, i) => (
                                    <div key={i} className="p-4 border border-slate-200 rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium text-slate-900">{profile.user_id}</h4>
                                                <p className="text-sm text-slate-500">Baseline deviation: {profile.baseline_deviation}%</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${getRiskColor(profile.risk_score)}`}>
                                                    {profile.risk_score}
                                                </div>
                                                <Badge className={getRiskBadge(profile.risk_score)} variant="secondary">
                                                    {profile.risk_score > 80 ? 'High Risk' : 
                                                     profile.risk_score > 60 ? 'Medium Risk' : 
                                                     profile.risk_score > 40 ? 'Low Risk' : 'Normal'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Detected Anomalies:</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.anomalies?.map((anomaly, j) => (
                                                    <Badge key={j} variant="outline" className="text-xs">
                                                        {anomaly}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <Brain className="w-4 h-4" />
                                    Key Insights
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.behavioral_insights?.map((insight, i) => (
                                        <li key={i} className="text-sm text-slate-700 p-3 bg-blue-50 rounded-lg">
                                            {insight}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Threat Indicators
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.threat_indicators?.map((indicator, i) => (
                                        <li key={i} className="text-sm text-slate-700 p-3 bg-red-50 rounded-lg">
                                            {indicator}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3">Recommendations</h3>
                            <div className="space-y-2">
                                {analysis.recommendations?.map((rec, i) => (
                                    <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <p className="text-sm text-slate-800">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}