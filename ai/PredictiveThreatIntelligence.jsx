import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Globe, Shield, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictiveThreatIntelligence() {
    const [predictions, setPredictions] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const getPredictions = async () => {
        setIsAnalyzing(true);
        const response = await InvokeLLM({
            prompt: "Analyze global threat intelligence feeds, dark web chatter, and vulnerability disclosures to predict the most likely cyber attack vectors and targeted industries for the next quarter. Provide actionable intelligence.",
            response_json_schema: {
                type: "object",
                properties: {
                    emerging_threats: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                threat_type: { type: "string" },
                                target_sectors: { type: "array", items: { type: "string" } },
                                likelihood: { type: "string", enum: ["High", "Medium", "Low"] },
                                description: { type: "string" }
                            }
                        }
                    },
                    vulnerability_watchlist: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                cve: { type: "string" },
                                product: { type: "string" },
                                reason: { type: "string" }
                            }
                        }
                    },
                    proactive_defense_recommendations: { type: "array", items: { type: "string" } }
                }
            }
        });
        setPredictions(response);
        setIsAnalyzing(false);
    };

    const getLikelihoodBadge = (likelihood) => {
        const colors = { High: 'bg-red-500 text-white', Medium: 'bg-orange-500 text-white', Low: 'bg-yellow-500 text-black' };
        return colors[likelihood] || 'bg-gray-500 text-white';
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Predictive Threat Intelligence
                    </CardTitle>
                    <CardDescription>Anticipate future threats with AI-powered forecasting.</CardDescription>
                </div>
                <Button onClick={getPredictions} disabled={isAnalyzing}>
                    <Brain className="w-4 h-4 mr-2" /> {isAnalyzing ? 'Analyzing...' : 'Generate Forecast'}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {!predictions && <p className="text-slate-500 text-center py-8">Click "Generate Forecast" to get the latest predictive intelligence.</p>}
                {predictions && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Emerging Threats (Next Quarter)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {predictions.emerging_threats.map((threat, i) => (
                                    <div key={i} className="p-4 border rounded-lg bg-slate-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">{threat.threat_type}</h4>
                                            <Badge className={getLikelihoodBadge(threat.likelihood)}>{threat.likelihood}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{threat.description}</p>
                                        <div className="text-xs">
                                            <span className="font-semibold">Target Sectors:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {threat.target_sectors.map(sector => <Badge key={sector} variant="secondary">{sector}</Badge>)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Vulnerability Watchlist</h3>
                            <div className="space-y-2">
                                {predictions.vulnerability_watchlist.map((vuln, i) => (
                                    <div key={i} className="p-3 border rounded-lg text-sm flex justify-between items-center">
                                        <div>
                                            <span className="font-mono text-indigo-600">{vuln.cve}</span> in <span className="font-semibold">{vuln.product}</span>
                                            <p className="text-xs text-slate-500">{vuln.reason}</p>
                                        </div>
                                        <Button size="sm" variant="outline">View Details</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-green-600" /> Proactive Defense Recommendations</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                                {predictions.proactive_defense_recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}