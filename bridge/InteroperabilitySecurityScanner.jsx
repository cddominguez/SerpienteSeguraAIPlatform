import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Scan, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteroperabilitySecurityScanner() {
    const [scanResults, setScanResults] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanType, setScanType] = useState('comprehensive');

    const performSecurityScan = async () => {
        setIsScanning(true);
        setScanResults(null);
        
        try {
            const response = await InvokeLLM({
                prompt: `Perform ${scanType} interoperability security scan across blockchain networks:

Scan Type: ${scanType}

Analyze security across multiple dimensions:
1. Cross-chain communication protocols
2. Bridge smart contract security
3. Consensus mechanism integrity
4. Oracle network reliability
5. Validator network decentralization
6. Message passing security
7. Asset locking mechanisms
8. Emergency pause functionality
9. Governance attack vectors
10. Slashing condition effectiveness

Provide comprehensive security assessment with recommendations.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        scan_summary: {
                            type: "object",
                            properties: {
                                total_protocols_scanned: { type: "number" },
                                vulnerabilities_found: { type: "number" },
                                critical_issues: { type: "number" },
                                overall_security_score: { type: "number" }
                            }
                        },
                        protocol_results: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    protocol_name: { type: "string" },
                                    security_score: { type: "number" },
                                    status: { type: "string" },
                                    vulnerabilities: { type: "array", items: { type: "string" } },
                                    strengths: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        security_findings: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    category: { type: "string" },
                                    severity: { type: "string" },
                                    description: { type: "string" },
                                    affected_protocols: { type: "array", items: { type: "string" } },
                                    remediation: { type: "string" }
                                }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    priority: { type: "string" },
                                    action: { type: "string" },
                                    impact: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setScanResults(response);
        } catch (error) {
            console.error("Error performing security scan:", error);
        }
        setIsScanning(false);
    };

    const getSeverityColor = (severity) => ({
        Critical: 'bg-red-500 text-white',
        High: 'bg-orange-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-blue-500 text-white',
        Info: 'bg-slate-500 text-white'
    }[severity] || 'bg-slate-500 text-white');

    const getStatusColor = (status) => ({
        Secure: 'bg-green-100 text-green-800',
        Warning: 'bg-yellow-100 text-yellow-800',
        Critical: 'bg-red-100 text-red-800',
        Unknown: 'bg-slate-100 text-slate-800'
    }[status] || 'bg-slate-100 text-slate-800');

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        if (score >= 50) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Scanner Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Network className="w-5 h-5 text-purple-600" />
                        Interoperability Security Scanner
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Scan Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Scan Type
                        </label>
                        <div className="flex gap-3">
                            {['comprehensive', 'quick', 'deep'].map((type) => (
                                <Button
                                    key={type}
                                    variant={scanType === type ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setScanType(type)}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button 
                        onClick={performSecurityScan}
                        disabled={isScanning}
                        className="w-full"
                    >
                        <Scan className="w-4 h-4 mr-2" />
                        {isScanning ? 'Scanning...' : `Start ${scanType} Security Scan`}
                    </Button>
                </CardContent>
            </Card>

            {/* Scan Results */}
            <AnimatePresence>
                {scanResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Scan Summary */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Scan Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {scanResults.scan_summary.total_protocols_scanned}
                                        </p>
                                        <p className="text-sm text-slate-600">Protocols Scanned</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-orange-600">
                                            {scanResults.scan_summary.vulnerabilities_found}
                                        </p>
                                        <p className="text-sm text-slate-600">Vulnerabilities</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-red-600">
                                            {scanResults.scan_summary.critical_issues}
                                        </p>
                                        <p className="text-sm text-slate-600">Critical Issues</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <p className={`text-2xl font-bold ${getScoreColor(scanResults.scan_summary.overall_security_score)}`}>
                                            {scanResults.scan_summary.overall_security_score}%
                                        </p>
                                        <p className="text-sm text-slate-600">Security Score</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Protocol Results */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Protocol Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {scanResults.protocol_results.map((protocol, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-lg">{protocol.protocol_name}</h5>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={getStatusColor(protocol.status)}>
                                                        {protocol.status}
                                                    </Badge>
                                                    <span className={`font-bold text-xl ${getScoreColor(protocol.security_score)}`}>
                                                        {protocol.security_score}%
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Vulnerabilities */}
                                                {protocol.vulnerabilities.length > 0 && (
                                                    <div>
                                                        <h6 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Vulnerabilities
                                                        </h6>
                                                        <ul className="space-y-1">
                                                            {protocol.vulnerabilities.map((vuln, j) => (
                                                                <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                    {vuln}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Strengths */}
                                                {protocol.strengths.length > 0 && (
                                                    <div>
                                                        <h6 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Strengths
                                                        </h6>
                                                        <ul className="space-y-1">
                                                            {protocol.strengths.map((strength, j) => (
                                                                <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                    {strength}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Findings */}
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Security Findings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {scanResults.security_findings.map((finding, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold">{finding.category}</h5>
                                                <Badge className={getSeverityColor(finding.severity)}>
                                                    {finding.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600 mb-3">{finding.description}</p>
                                            
                                            {finding.affected_protocols.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-slate-700 mb-1">Affected Protocols:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {finding.affected_protocols.map((protocol, j) => (
                                                            <Badge key={j} variant="outline">{protocol}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Remediation:</strong> {finding.remediation}
                                                </p>
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
                                    <Info className="w-5 h-5 text-blue-600" />
                                    Security Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {scanResults.recommendations.map((rec, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge className={getSeverityColor(rec.priority)}>
                                                    {rec.priority} Priority
                                                </Badge>
                                                <span className="text-sm text-slate-600">{rec.impact}</span>
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