import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crosshair, Zap, ShieldAlert, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AutomatedPenetrationTesting() {
    const [scanResults, setScanResults] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const startPenTest = async () => {
        setIsScanning(true);
        setScanResults(null);
        const response = await InvokeLLM({
            prompt: `Simulate a comprehensive penetration test against our external infrastructure. Target web applications, APIs, and network endpoints. Identify exploitable vulnerabilities and suggest remediation. Focus on OWASP Top 10, misconfigurations, and authentication bypass.`,
            response_json_schema: {
                type: "object",
                properties: {
                    summary: {
                        type: 'object',
                        properties: {
                            overall_risk: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
                            findings_count: { type: 'number' },
                            attack_vectors_tested: { type: 'number' }
                        }
                    },
                    findings: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                severity: { type: 'string' },
                                target: { type: 'string' },
                                description: { type: 'string' },
                                proof_of_concept: { type: 'string' },
                                remediation: { type: 'string' }
                            }
                        }
                    }
                }
            }
        });
        setScanResults(response);
        setIsScanning(false);
    };
    
    const getSeverityBadge = (severity) => {
        const colors = { Critical: 'bg-red-500 text-white', High: 'bg-orange-500 text-white', Medium: 'bg-yellow-500 text-black', Low: 'bg-blue-500 text-white' };
        return colors[severity] || 'bg-gray-500 text-white';
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Crosshair className="w-5 h-5 text-rose-600" />
                        Automated Penetration Testing
                    </CardTitle>
                    <CardDescription>Proactively identify vulnerabilities by simulating real-world attacks.</CardDescription>
                </div>
                <Button onClick={startPenTest} disabled={isScanning}>
                    <Zap className="w-4 h-4 mr-2" /> {isScanning ? 'Testing...' : 'Launch Pen Test'}
                </Button>
            </CardHeader>
            <CardContent>
                {!scanResults && !isScanning && (
                    <div className="text-center py-12">
                        <ShieldAlert className="mx-auto w-12 h-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium">Ready to test your defenses</h3>
                        <p className="text-slate-500 text-sm">Launch a simulated attack to find weak points.</p>
                    </div>
                )}
                {isScanning && <p className="text-center">Simulating attacks, please wait...</p>}
                {scanResults && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-slate-100 rounded-lg">
                                <p className="text-sm font-medium text-slate-600">Overall Risk</p>
                                <p className={`text-2xl font-bold ${getSeverityBadge(scanResults.summary.overall_risk).split(' ')[1]}`}>{scanResults.summary.overall_risk}</p>
                            </div>
                             <div className="p-4 bg-slate-100 rounded-lg">
                                <p className="text-sm font-medium text-slate-600">Findings</p>
                                <p className="text-2xl font-bold">{scanResults.summary.findings_count}</p>
                            </div>
                             <div className="p-4 bg-slate-100 rounded-lg">
                                <p className="text-sm font-medium text-slate-600">Attack Vectors</p>
                                <p className="text-2xl font-bold">{scanResults.summary.attack_vectors_tested}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold">High-Priority Findings</h3>
                            {scanResults.findings.slice(0, 3).map((finding, index) => (
                                <div key={index} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium">{finding.title}</h4>
                                        <Badge className={getSeverityBadge(finding.severity)}>{finding.severity}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">Target: {finding.target}</p>
                                    <p className="text-sm mb-2">{finding.description}</p>
                                    <h5 className="text-sm font-semibold">Remediation</h5>
                                    <p className="text-sm text-slate-600">{finding.remediation}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}