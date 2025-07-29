import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Brain, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function FrameworkManager({ frameworks = [], isLoading = false, refreshFrameworks }) {
    const [gapAnalysis, setGapAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [regulatoryUpdates, setRegulatoryUpdates] = useState(null);
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

    const performGapAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze compliance frameworks and identify gaps: ${JSON.stringify(frameworks.slice(0, 5))}. 
                
Provide detailed gap analysis including:
1. Missing controls for each framework
2. Risk assessment of gaps
3. Priority recommendations for closing gaps
4. Resource requirements`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overall_compliance_score: { type: "number" },
                        critical_gaps: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    framework: { type: "string" },
                                    gap_description: { type: "string" },
                                    risk_level: { type: "string", enum: ["High", "Medium", "Low"] },
                                    remediation_effort: { type: "string" },
                                    timeline: { type: "string" }
                                }
                            }
                        },
                        recommendations: { type: "array", items: { type: "string" } },
                        next_steps: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setGapAnalysis(response);
        } catch (error) {
            console.error("Error performing gap analysis:", error);
        }
        setIsAnalyzing(false);
    };

    const checkRegulatoryUpdates = async () => {
        setIsCheckingUpdates(true);
        try {
            const response = await InvokeLLM({
                prompt: `Check for recent regulatory updates and changes that might affect current compliance frameworks. Focus on GDPR, HIPAA, PCI DSS, SOC 2, and emerging AI governance regulations.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        recent_updates: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    regulation: { type: "string" },
                                    update_description: { type: "string" },
                                    effective_date: { type: "string" },
                                    impact_level: { type: "string", enum: ["High", "Medium", "Low"] },
                                    action_required: { type: "string" }
                                }
                            }
                        },
                        emerging_regulations: { type: "array", items: { type: "string" } },
                        compliance_alerts: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setRegulatoryUpdates(response);
        } catch (error) {
            console.error("Error checking regulatory updates:", error);
        }
        setIsCheckingUpdates(false);
    };

    const getStatusBadge = (status) => {
        const styles = {
            'compliant': 'bg-emerald-500 text-white',
            'partial': 'bg-amber-500 text-white',
            'non_compliant': 'bg-red-500 text-white',
            'under_review': 'bg-blue-500 text-white'
        };
        return styles[status] || 'bg-slate-500 text-white';
    };

    const getRiskBadge = (level) => {
        const styles = {
            'High': 'bg-red-500 text-white',
            'Medium': 'bg-amber-500 text-white',
            'Low': 'bg-emerald-500 text-white'
        };
        return styles[level] || 'bg-slate-500 text-white';
    };

    return (
        <div className="space-y-8">
            {/* AI-Powered Regulatory Intelligence */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-indigo-600" />
                            AI Regulatory Intelligence
                        </CardTitle>
                        <CardDescription>Stay ahead of regulatory changes with AI-powered monitoring.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={performGapAnalysis} disabled={isAnalyzing}>
                            {isAnalyzing ? 'Analyzing...' : 'Gap Analysis'}
                        </Button>
                        <Button onClick={checkRegulatoryUpdates} disabled={isCheckingUpdates}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {isCheckingUpdates ? 'Checking...' : 'Check Updates'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {regulatoryUpdates && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-3">Recent Regulatory Updates</h3>
                                <div className="space-y-3">
                                    {regulatoryUpdates.recent_updates?.map((update, i) => (
                                        <div key={i} className="p-4 bg-white rounded-lg border border-indigo-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-slate-900">{update.regulation}</h4>
                                                <Badge className={getRiskBadge(update.impact_level)}>
                                                    {update.impact_level} Impact
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-700 mb-2">{update.update_description}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-600">
                                                <span>Effective: {update.effective_date}</span>
                                                <span>Action: {update.action_required}</span>
                                            </div>
                                        </div>
                                    )) || <p className="text-slate-500">No recent updates found.</p>}
                                </div>
                            </div>

                            {regulatoryUpdates.emerging_regulations?.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Emerging Regulations to Watch</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {regulatoryUpdates.emerging_regulations.map((reg, i) => (
                                            <Badge key={i} variant="outline" className="text-purple-700 border-purple-300">
                                                {reg}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {gapAnalysis && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-6">
                            <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                                <h3 className="font-semibold text-slate-900 mb-2">Overall Compliance Score</h3>
                                <div className="text-3xl font-bold text-emerald-600">{gapAnalysis.overall_compliance_score}%</div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    Critical Gaps Identified
                                </h3>
                                <div className="space-y-3">
                                    {gapAnalysis.critical_gaps?.map((gap, i) => (
                                        <div key={i} className="p-4 bg-white rounded-lg border border-red-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-slate-900">{gap.framework}</h4>
                                                <Badge className={getRiskBadge(gap.risk_level)}>
                                                    {gap.risk_level} Risk
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-700 mb-2">{gap.gap_description}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-600">
                                                <span>Effort: {gap.remediation_effort}</span>
                                                <span>Timeline: {gap.timeline}</span>
                                            </div>
                                        </div>
                                    )) || <p className="text-slate-500">No critical gaps identified.</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3">AI Recommendations</h4>
                                    <div className="space-y-2">
                                        {gapAnalysis.recommendations?.map((rec, i) => (
                                            <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-sm text-blue-800">{rec}</p>
                                            </div>
                                        )) || <p className="text-sm text-slate-500">No recommendations available.</p>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3">Next Steps</h4>
                                    <div className="space-y-2">
                                        {gapAnalysis.next_steps?.map((step, i) => (
                                            <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                                <p className="text-sm text-emerald-800">{step}</p>
                                            </div>
                                        )) || <p className="text-sm text-slate-500">No next steps available.</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Frameworks Table */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        Compliance Frameworks
                    </CardTitle>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Framework
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Framework</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Jurisdiction</TableHead>
                                <TableHead>Compliance Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Audit</TableHead>
                                <TableHead>Next Audit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {frameworks.map((framework) => (
                                <TableRow key={framework.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900">{framework.name}</p>
                                            <Badge variant="outline" className="mt-1 capitalize">
                                                {framework.implementation_priority}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{framework.type.replace('_', ' ')}</TableCell>
                                    <TableCell>{framework.jurisdiction}</TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{framework.compliance_score}%</span>
                                            </div>
                                            <Progress value={framework.compliance_score} className="h-2" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(framework.status)} variant="secondary">
                                            {framework.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {framework.last_audit ? 
                                            format(new Date(framework.last_audit), 'MMM d, yyyy') : 
                                            'Never'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {framework.next_audit ? 
                                            format(new Date(framework.next_audit), 'MMM d, yyyy') : 
                                            'Not scheduled'
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}