import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Search, FileText, AlertTriangle, TrendingUp, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIRegulatoryIntelligence() {
    const [searchQuery, setSearchQuery] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [regulatoryUpdates, setRegulatoryUpdates] = useState([]);
    const [policyDrafts, setPolicyDrafts] = useState([]);

    const analyzeRegulation = async () => {
        if (!searchQuery.trim()) return;
        
        setIsAnalyzing(true);
        try {
            const response = await InvokeLLM({
                prompt: `Perform advanced NLP analysis on this regulatory query: "${searchQuery}"

Use the following AI/ML techniques:
1. Natural Language Processing (NLP) to extract key regulatory concepts
2. Text Classification to categorize compliance domains
3. Named Entity Recognition to identify deadlines, requirements, penalties
4. Sentiment Analysis to assess regulatory urgency
5. Summarization to provide executive-friendly insights

Provide comprehensive regulatory intelligence including gaps, requirements, and strategic implications.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        regulation_summary: { type: "string" },
                        compliance_domains: { type: "array", items: { type: "string" } },
                        key_requirements: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    requirement: { type: "string" },
                                    deadline: { type: "string" },
                                    penalty: { type: "string" },
                                    affected_industries: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        extracted_entities: {
                            type: "object",
                            properties: {
                                deadlines: { type: "array", items: { type: "string" } },
                                penalties: { type: "array", items: { type: "string" } },
                                jurisdictions: { type: "array", items: { type: "string" } }
                            }
                        },
                        gap_analysis: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    gap_area: { type: "string" },
                                    current_state: { type: "string" },
                                    required_state: { type: "string" },
                                    effort_level: { type: "string", enum: ["Low", "Medium", "High", "Critical"] }
                                }
                            }
                        },
                        urgency_score: { type: "number", minimum: 0, maximum: 100 },
                        strategic_implications: { type: "array", items: { type: "string" } },
                        automated_policy_recommendations: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setAnalysisResults(response);
        } catch (error) {
            console.error("Error analyzing regulation:", error);
        }
        setIsAnalyzing(false);
    };

    const generatePolicyDraft = async (requirement) => {
        try {
            const response = await InvokeLLM({
                prompt: `Using Natural Language Generation (NLG), create a comprehensive security policy draft for this requirement: "${requirement}"

The policy should include:
1. Policy statement and scope
2. Specific controls and procedures
3. Roles and responsibilities
4. Implementation guidelines
5. Compliance monitoring procedures

Use rule-based systems to ensure adherence to policy frameworks and best practices.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        policy_title: { type: "string" },
                        policy_statement: { type: "string" },
                        scope: { type: "string" },
                        controls: { type: "array", items: { type: "string" } },
                        procedures: { type: "array", items: { type: "string" } },
                        roles_responsibilities: { type: "object" },
                        implementation_steps: { type: "array", items: { type: "string" } },
                        monitoring_requirements: { type: "array", items: { type: "string" } },
                        review_schedule: { type: "string" }
                    }
                }
            });

            const newDraft = {
                id: Date.now(),
                requirement,
                policy: response,
                created: new Date().toISOString(),
                status: 'draft'
            };

            setPolicyDrafts(prev => [newDraft, ...prev]);
        } catch (error) {
            console.error("Error generating policy draft:", error);
        }
    };

    const monitorRegulatoryChanges = async () => {
        try {
            const response = await InvokeLLM({
                prompt: `Simulate continuous regulatory monitoring using AI/ML. Analyze recent regulatory documents, legal updates, and expert analyses for changes affecting:

1. Data Privacy (GDPR, CCPA, LGPD)
2. Cybersecurity (NIS2, NIST, ISO 27001)
3. Financial Services (PCI DSS, SOX)
4. Healthcare (HIPAA, FDA)
5. AI/ML Governance (EU AI Act, NIST AI Framework)

Use text classification and pattern recognition to identify relevant changes and assess their impact.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        regulatory_changes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    regulation: { type: "string" },
                                    change_description: { type: "string" },
                                    effective_date: { type: "string" },
                                    impact_assessment: { type: "string" },
                                    confidence_score: { type: "number" },
                                    action_required: { type: "string" }
                                }
                            }
                        },
                        trending_topics: { type: "array", items: { type: "string" } },
                        risk_alerts: { type: "array", items: { type: "string" } }
                    }
                }
            });

            setRegulatoryUpdates(response.regulatory_changes || []);
        } catch (error) {
            console.error("Error monitoring regulatory changes:", error);
        }
    };

    const getUrgencyBadge = (score) => {
        if (score >= 80) return 'bg-red-500 text-white';
        if (score >= 60) return 'bg-orange-500 text-white';
        if (score >= 40) return 'bg-amber-500 text-white';
        return 'bg-blue-500 text-white';
    };

    const getEffortBadge = (level) => {
        const styles = {
            'Critical': 'bg-red-500 text-white',
            'High': 'bg-orange-500 text-white',
            'Medium': 'bg-amber-500 text-white',
            'Low': 'bg-emerald-500 text-white'
        };
        return styles[level] || 'bg-slate-500 text-white';
    };

    return (
        <div className="space-y-8">
            {/* AI-Powered Regulatory Search */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        AI Regulatory Intelligence Engine
                    </CardTitle>
                    <CardDescription>
                        Advanced NLP analysis of regulatory documents with automated gap analysis and policy generation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter regulation name, requirement, or compliance question..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && analyzeRegulation()}
                            />
                        </div>
                        <Button onClick={analyzeRegulation} disabled={isAnalyzing}>
                            <Search className="w-4 h-4 mr-2" />
                            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                        </Button>
                        <Button variant="outline" onClick={monitorRegulatoryChanges}>
                            <Globe className="w-4 h-4 mr-2" />
                            Monitor Changes
                        </Button>
                    </div>

                    <AnimatePresence>
                        {analysisResults && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Regulation Summary */}
                                <div className="p-4 bg-white rounded-lg border border-indigo-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-slate-900">AI Analysis Summary</h3>
                                        <Badge className={getUrgencyBadge(analysisResults.urgency_score)}>
                                            Urgency: {analysisResults.urgency_score}/100
                                        </Badge>
                                    </div>
                                    <p className="text-slate-700 mb-3">{analysisResults.regulation_summary}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResults.compliance_domains?.map((domain, i) => (
                                            <Badge key={i} variant="outline" className="text-indigo-700">
                                                {domain}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Requirements */}
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Extracted Requirements
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {analysisResults.key_requirements?.map((req, i) => (
                                            <div key={i} className="p-4 bg-white rounded-lg border">
                                                <h5 className="font-medium text-slate-900 mb-2">{req.requirement}</h5>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    <p><strong>Deadline:</strong> {req.deadline}</p>
                                                    <p><strong>Penalty:</strong> {req.penalty}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {req.affected_industries?.map((industry, j) => (
                                                            <Badge key={j} variant="outline" className="text-xs">
                                                                {industry}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => generatePolicyDraft(req.requirement)}
                                                >
                                                    Generate Policy
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gap Analysis */}
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        Automated Gap Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        {analysisResults.gap_analysis?.map((gap, i) => (
                                            <div key={i} className="p-4 bg-white rounded-lg border border-orange-200">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-medium text-slate-900">{gap.gap_area}</h5>
                                                    <Badge className={getEffortBadge(gap.effort_level)}>
                                                        {gap.effort_level} Effort
                                                    </Badge>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <strong className="text-red-700">Current State:</strong>
                                                        <p className="text-slate-600">{gap.current_state}</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-emerald-700">Required State:</strong>
                                                        <p className="text-slate-600">{gap.required_state}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strategic Implications */}
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-purple-600" />
                                        Strategic Implications
                                    </h4>
                                    <div className="space-y-2">
                                        {analysisResults.strategic_implications?.map((implication, i) => (
                                            <div key={i} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                <p className="text-sm text-purple-800">{implication}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Regulatory Updates Monitor */}
            {regulatoryUpdates.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900">Live Regulatory Updates</CardTitle>
                        <CardDescription>AI-monitored changes in global regulatory landscape</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {regulatoryUpdates.map((update, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-slate-900">{update.regulation}</h4>
                                        <div className="flex gap-2">
                                            <Badge variant="outline">
                                                Confidence: {update.confidence_score}%
                                            </Badge>
                                            <Badge variant="secondary">
                                                {update.effective_date}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 mb-2">{update.change_description}</p>
                                    <p className="text-sm text-slate-600 mb-2">
                                        <strong>Impact:</strong> {update.impact_assessment}
                                    </p>
                                    <p className="text-sm text-emerald-700">
                                        <strong>Recommended Action:</strong> {update.action_required}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Generated Policy Drafts */}
            {policyDrafts.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900">AI-Generated Policy Drafts</CardTitle>
                        <CardDescription>Automatically generated policies using NLG and rule-based systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <div className="space-y-6">
                                {policyDrafts.map((draft) => (
                                    <motion.div
                                        key={draft.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 border border-slate-200 rounded-lg"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-slate-900">{draft.policy.policy_title}</h4>
                                            <Badge variant="outline">{draft.status}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">
                                            Generated for: {draft.requirement}
                                        </p>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <strong>Policy Statement:</strong>
                                                <p className="text-slate-700">{draft.policy.policy_statement}</p>
                                            </div>
                                            <div>
                                                <strong>Scope:</strong>
                                                <p className="text-slate-700">{draft.policy.scope}</p>
                                            </div>
                                            <div>
                                                <strong>Key Controls:</strong>
                                                <ul className="list-disc list-inside text-slate-700">
                                                    {draft.policy.controls?.slice(0, 3).map((control, i) => (
                                                        <li key={i}>{control}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button size="sm" variant="outline">Review</Button>
                                            <Button size="sm">Approve & Deploy</Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}