import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, TrendingUp, Shield, Users, Lock, CheckCircle, X, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ExecutiveComplianceDashboard({ frameworks = [], controls = [], auditLogs = [] }) {
    const [executiveInsights, setExecutiveInsights] = useState(null);
    const [nonCompliantEntities, setNonCompliantEntities] = useState([
        { id: 1, type: 'user', name: 'john.doe@company.com', issue: 'MFA not enabled', framework: 'SOC2', risk: 'High', autoFixAvailable: true },
        { id: 2, type: 'device', name: 'LAPTOP-001', issue: 'Encryption disabled', framework: 'HIPAA', risk: 'Critical', autoFixAvailable: true },
        { id: 3, type: 'system', name: 'Database Server', issue: 'Audit logging disabled', framework: 'PCI DSS', risk: 'Medium', autoFixAvailable: false },
        { id: 4, type: 'user', name: 'sarah.smith@company.com', issue: 'Password policy violation', framework: 'GDPR', risk: 'High', autoFixAvailable: true }
    ]);
    const [autoEnforcementEnabled, setAutoEnforcementEnabled] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [enforcementActions, setEnforcementActions] = useState([]);

    const generateExecutiveReport = async () => {
        setIsGeneratingReport(true);
        try {
            const context = {
                total_frameworks: frameworks.length,
                compliant_frameworks: frameworks.filter(f => f.status === 'compliant').length,
                avg_compliance_score: frameworks.reduce((sum, f) => sum + f.compliance_score, 0) / frameworks.length || 0,
                critical_controls: controls.filter(c => c.risk_level === 'critical').length,
                non_compliant_entities: nonCompliantEntities.length,
                recent_incidents: auditLogs.filter(log => log.result === 'failure').length
            };

            const response = await InvokeLLM({
                prompt: `Generate an executive-level compliance report for C-suite leadership. Analyze the compliance posture and provide strategic recommendations.

Data: ${JSON.stringify(context)}

Provide:
1. Executive summary of compliance posture
2. Key risks and their business impact
3. Strategic recommendations for improvement
4. Resource allocation priorities
5. ROI projections for compliance investments`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        executive_summary: { type: "string" },
                        overall_risk_level: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
                        key_risks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    risk_description: { type: "string" },
                                    business_impact: { type: "string" },
                                    estimated_cost: { type: "string" },
                                    probability: { type: "string" }
                                }
                            }
                        },
                        strategic_recommendations: { type: "array", items: { type: "string" } },
                        investment_priorities: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    initiative: { type: "string" },
                                    cost: { type: "string" },
                                    timeline: { type: "string" },
                                    roi_projection: { type: "string" }
                                }
                            }
                        },
                        compliance_forecast: { type: "string" }
                    }
                }
            });
            setExecutiveInsights(response);
        } catch (error) {
            console.error("Error generating executive report:", error);
        }
        setIsGeneratingReport(false);
    };

    const autoFixNonCompliance = async (entityId) => {
        const entity = nonCompliantEntities.find(e => e.id === entityId);
        if (!entity) return;

        try {
            const response = await InvokeLLM({
                prompt: `Generate automated remediation steps for this compliance violation:
                Entity: ${entity.name} (${entity.type})
                Issue: ${entity.issue}
                Framework: ${entity.framework}
                
                Provide specific technical steps to automatically resolve this compliance issue.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        remediation_steps: { type: "array", items: { type: "string" } },
                        estimated_time: { type: "string" },
                        requires_approval: { type: "boolean" },
                        success_probability: { type: "number" }
                    }
                }
            });

            const action = {
                id: Date.now(),
                entityId,
                entityName: entity.name,
                action: 'auto_fix',
                status: 'in_progress',
                steps: response.remediation_steps,
                timestamp: new Date().toISOString()
            };

            setEnforcementActions(prev => [action, ...prev]);

            // Simulate fixing the issue
            setTimeout(() => {
                setNonCompliantEntities(prev => prev.filter(e => e.id !== entityId));
                setEnforcementActions(prev => 
                    prev.map(a => a.id === action.id ? {...a, status: 'completed'} : a)
                );
            }, 3000);

        } catch (error) {
            console.error("Error auto-fixing compliance:", error);
        }
    };

    const lockoutEntity = async (entityId) => {
        const entity = nonCompliantEntities.find(e => e.id === entityId);
        if (!entity) return;

        const action = {
            id: Date.now(),
            entityId,
            entityName: entity.name,
            action: 'lockout',
            status: 'completed',
            reason: `Compliance violation: ${entity.issue}`,
            timestamp: new Date().toISOString()
        };

        setEnforcementActions(prev => [action, ...prev]);
        setNonCompliantEntities(prev => 
            prev.map(e => e.id === entityId ? {...e, status: 'locked_out'} : e)
        );
    };

    // Mock data for charts
    const complianceByFramework = frameworks.map(f => ({
        name: f.name,
        score: f.compliance_score,
        status: f.status
    }));

    const riskDistribution = [
        { name: 'Low', value: 45, color: '#10b981' },
        { name: 'Medium', value: 30, color: '#f59e0b' },
        { name: 'High', value: 20, color: '#ef4444' },
        { name: 'Critical', value: 5, color: '#dc2626' }
    ];

    const complianceTrend = [
        { month: 'Jan', score: 78 },
        { month: 'Feb', score: 82 },
        { month: 'Mar', score: 85 },
        { month: 'Apr', score: 87 },
        { month: 'May', score: 90 },
        { month: 'Jun', score: 92 }
    ];

    return (
        <div className="space-y-8">
            {/* Executive Summary Header */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold mb-2">Executive Compliance Dashboard</CardTitle>
                            <CardDescription className="text-blue-100">
                                Real-time compliance posture for leadership oversight and strategic decision making
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold mb-1">
                                {frameworks.length > 0 ? Math.round(frameworks.reduce((sum, f) => sum + f.compliance_score, 0) / frameworks.length) : 0}%
                            </div>
                            <p className="text-blue-200">Overall Compliance</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Compliance Frameworks"
                    value={`${frameworks.filter(f => f.status === 'compliant').length}/${frameworks.length}`}
                    subtitle="Fully Compliant"
                    icon={Shield}
                    color="emerald"
                />
                <MetricCard
                    title="Non-Compliant Entities"
                    value={nonCompliantEntities.filter(e => e.status !== 'locked_out').length}
                    subtitle="Require Attention"
                    icon={AlertTriangle}
                    color="red"
                />
                <MetricCard
                    title="Auto-Fix Available"
                    value={nonCompliantEntities.filter(e => e.autoFixAvailable && e.status !== 'locked_out').length}
                    subtitle="Can be resolved automatically"
                    icon={CheckCircle}
                    color="blue"
                />
                <MetricCard
                    title="Risk Reduction"
                    value="+15%"
                    subtitle="This quarter"
                    icon={TrendingUp}
                    color="emerald"
                />
            </div>

            {/* Auto-Enforcement Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-600" />
                                Automated Compliance Enforcement
                            </CardTitle>
                            <CardDescription>AI-powered automatic remediation and lockout capabilities</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Auto-Enforcement</span>
                            <Switch
                                checked={autoEnforcementEnabled}
                                onCheckedChange={setAutoEnforcementEnabled}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {nonCompliantEntities.filter(e => e.status !== 'locked_out').map(entity => (
                            <motion.div
                                key={entity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className="capitalize">{entity.type}</Badge>
                                            <Badge className={
                                                entity.risk === 'Critical' ? 'bg-red-500 text-white' :
                                                entity.risk === 'High' ? 'bg-orange-500 text-white' :
                                                'bg-amber-500 text-white'
                                            }>
                                                {entity.risk} Risk
                                            </Badge>
                                            <Badge variant="outline">{entity.framework}</Badge>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 mb-1">{entity.name}</h4>
                                        <p className="text-sm text-slate-600">{entity.issue}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {entity.autoFixAvailable && (
                                            <Button
                                                size="sm"
                                                onClick={() => autoFixNonCompliance(entity.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Auto-Fix
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => lockoutEntity(entity.id)}
                                        >
                                            <Lock className="w-4 h-4 mr-1" />
                                            Lock Out
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Charts and Analytics */}
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Compliance by Framework</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={complianceByFramework}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="score" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Risk Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}%`}
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Compliance Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={complianceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Executive Insights */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        AI Executive Insights & Recommendations
                    </CardTitle>
                    <Button onClick={generateExecutiveReport} disabled={isGeneratingReport}>
                        {isGeneratingReport ? 'Generating...' : 'Generate Executive Report'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {executiveInsights && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <h3 className="font-semibold text-slate-900 mb-2">Executive Summary</h3>
                                <p className="text-slate-700">{executiveInsights.executive_summary}</p>
                                <div className="mt-3">
                                    <Badge className={
                                        executiveInsights.overall_risk_level === 'Critical' ? 'bg-red-500 text-white' :
                                        executiveInsights.overall_risk_level === 'High' ? 'bg-orange-500 text-white' :
                                        executiveInsights.overall_risk_level === 'Medium' ? 'bg-amber-500 text-white' :
                                        'bg-emerald-500 text-white'
                                    }>
                                        Overall Risk: {executiveInsights.overall_risk_level}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3">Key Business Risks</h4>
                                    <div className="space-y-3">
                                        {executiveInsights.key_risks?.map((risk, i) => (
                                            <div key={i} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                                <h5 className="font-medium text-red-900 mb-1">{risk.risk_description}</h5>
                                                <p className="text-sm text-red-700 mb-2">{risk.business_impact}</p>
                                                <div className="flex justify-between text-xs text-red-600">
                                                    <span>Probability: {risk.probability}</span>
                                                    <span>Est. Cost: {risk.estimated_cost}</span>
                                                </div>
                                            </div>
                                        )) || <p className="text-slate-500">No critical risks identified.</p>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3">Investment Priorities</h4>
                                    <div className="space-y-3">
                                        {executiveInsights.investment_priorities?.map((investment, i) => (
                                            <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                                <h5 className="font-medium text-emerald-900 mb-1">{investment.initiative}</h5>
                                                <div className="grid grid-cols-3 gap-2 text-xs text-emerald-700">
                                                    <span>Cost: {investment.cost}</span>
                                                    <span>Timeline: {investment.timeline}</span>
                                                    <span>ROI: {investment.roi_projection}</span>
                                                </div>
                                            </div>
                                        )) || <p className="text-slate-500">No investment recommendations available.</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 mb-3">Strategic Recommendations</h4>
                                <div className="space-y-2">
                                    {executiveInsights.strategic_recommendations?.map((rec, i) => (
                                        <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-800">{rec}</p>
                                        </div>
                                    )) || <p className="text-slate-500">No recommendations available.</p>}
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <h4 className="font-semibold text-purple-900 mb-2">Compliance Forecast</h4>
                                <p className="text-sm text-purple-800">{executiveInsights.compliance_forecast}</p>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Enforcement Actions */}
            {enforcementActions.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Recent Enforcement Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {enforcementActions.slice(0, 5).map(action => (
                                    <motion.div
                                        key={action.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-3 border border-slate-200 rounded-lg"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-medium text-slate-900">{action.entityName}</h5>
                                                <p className="text-sm text-slate-600">
                                                    Action: {action.action === 'auto_fix' ? 'Automatic Fix Applied' : 'Access Locked Out'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(action.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                                                {action.status}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
                <div className={`p-3 bg-${color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </CardContent>
    </Card>
);