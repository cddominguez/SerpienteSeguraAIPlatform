import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuantumThreatDetector() {
    const [threats, setThreats] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const scanQuantumThreats = async () => {
        setIsScanning(true);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze current cryptographic implementations for quantum computing vulnerabilities. Identify algorithms at risk and provide migration recommendations for quantum-safe alternatives.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        vulnerable_algorithms: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    algorithm: { type: "string" },
                                    current_usage: { type: "string" },
                                    vulnerability_level: { type: "string" },
                                    quantum_safe_replacement: { type: "string" },
                                    migration_priority: { type: "string" },
                                    estimated_cost: { type: "number" }
                                }
                            }
                        },
                        overall_quantum_readiness: { type: "number" },
                        migration_timeline: { type: "string" },
                        recommendations: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setThreats(response);
        } catch (error) {
            console.error('Quantum threat scan failed:', error);
        }
        setIsScanning(false);
    };

    const getVulnerabilityColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'critical': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-yellow-500 text-white';
            case 'low': return 'bg-green-500 text-white';
            default: return 'bg-slate-500 text-white';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Quantum Threat Assessment
                    </CardTitle>
                    <CardDescription>Evaluate cryptographic vulnerabilities against quantum computing attacks.</CardDescription>
                </div>
                <Button onClick={scanQuantumThreats} disabled={isScanning}>
                    <Shield className="w-4 h-4 mr-2" /> {isScanning ? 'Scanning...' : 'Scan Quantum Threats'}
                </Button>
            </CardHeader>
            <CardContent>
                {!threats && !isScanning && (
                    <div className="text-center py-12">
                        <Zap className="mx-auto w-12 h-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium">Quantum Readiness Assessment</h3>
                        <p className="text-slate-500 text-sm">Scan your cryptographic infrastructure for quantum vulnerabilities.</p>
                    </div>
                )}
                
                {isScanning && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-700">Analyzing quantum vulnerabilities...</p>
                    </div>
                )}

                {threats && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-600">Quantum Readiness</h4>
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-2xl font-bold text-slate-900">{threats.overall_quantum_readiness}%</span>
                                        <Badge variant={threats.overall_quantum_readiness > 70 ? 'default' : 'destructive'}>
                                            {threats.overall_quantum_readiness > 70 ? 'Good' : 'Needs Work'}
                                        </Badge>
                                    </div>
                                    <Progress value={threats.overall_quantum_readiness} className="h-2" />
                                </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-600">Migration Timeline</h4>
                                <div className="flex items-center mt-2">
                                    <Clock className="w-4 h-4 text-slate-500 mr-2" />
                                    <span className="font-semibold text-slate-900">{threats.migration_timeline}</span>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-600">Vulnerable Algorithms</h4>
                                <div className="flex items-center mt-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                                    <span className="font-semibold text-slate-900">{threats.vulnerable_algorithms?.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-4">Cryptographic Vulnerability Assessment</h3>
                            <div className="space-y-4">
                                {threats.vulnerable_algorithms?.map((alg, i) => (
                                    <div key={i} className="p-4 border border-slate-200 rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium text-slate-900">{alg.algorithm}</h4>
                                                <p className="text-sm text-slate-600">{alg.current_usage}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge className={getVulnerabilityColor(alg.vulnerability_level)}>
                                                    {alg.vulnerability_level} Risk
                                                </Badge>
                                                <Badge className={getPriorityColor(alg.migration_priority)} variant="secondary">
                                                    {alg.migration_priority} Priority
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-semibold text-slate-700">Recommended Replacement:</span>
                                                <p className="text-slate-600">{alg.quantum_safe_replacement}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="w-4 h-4 text-slate-500 mr-1" />
                                                <span className="font-semibold text-slate-700">Estimated Cost:</span>
                                                <span className="text-slate-600 ml-1">${alg.estimated_cost?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Migration Recommendations
                            </h3>
                            <div className="space-y-2">
                                {threats.recommendations?.map((rec, i) => (
                                    <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
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