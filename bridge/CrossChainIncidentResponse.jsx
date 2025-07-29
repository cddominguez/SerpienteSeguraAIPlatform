import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, AlertTriangle, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CrossChainIncidentResponse() {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [responseActions, setResponseActions] = useState([]);
    const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
    const [newIncident, setNewIncident] = useState({
        title: '',
        description: '',
        severity: 'medium',
        affectedBridge: ''
    });

    useEffect(() => {
        loadIncidents();
    }, []);

    const loadIncidents = () => {
        const mockIncidents = [
            {
                id: 'INC-001',
                title: 'Unusual Transaction Volume on ETH-BSC Bridge',
                description: 'Detected 300% increase in transaction volume with suspicious patterns',
                severity: 'high',
                status: 'investigating',
                affectedBridge: 'Ethereum ↔ BSC',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                estimatedLoss: '$125,000'
            },
            {
                id: 'INC-002',
                title: 'Validator Node Offline - Polygon Bridge',
                description: 'Primary validator node went offline, backup systems activated',
                severity: 'medium',
                status: 'contained',
                affectedBridge: 'Ethereum ↔ Polygon',
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                estimatedLoss: '$0'
            },
            {
                id: 'INC-003',
                title: 'Oracle Price Feed Anomaly',
                description: 'Price oracle reporting values 15% above market rate',
                severity: 'critical',
                status: 'active',
                affectedBridge: 'BSC ↔ Avalanche',
                createdAt: new Date(Date.now() - 30 * 60 * 1000),
                estimatedLoss: '$50,000'
            }
        ];
        setIncidents(mockIncidents);
        setSelectedIncident(mockIncidents[0]);
    };

    const generateIncidentResponse = async (incident) => {
        setIsGeneratingResponse(true);
        try {
            const response = await InvokeLLM({
                prompt: `Generate automated incident response plan for cross-chain bridge security incident:

Incident Details:
- ID: ${incident.id}
- Title: ${incident.title}
- Description: ${incident.description}
- Severity: ${incident.severity}
- Affected Bridge: ${incident.affectedBridge}
- Estimated Loss: ${incident.estimatedLoss}

Generate comprehensive incident response including:
1. Immediate containment actions
2. Investigation procedures
3. Communication protocols
4. Recovery steps
5. Post-incident analysis
6. Prevention measures

Provide detailed, actionable response plan with timelines and priorities.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        immediate_actions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    action: { type: "string" },
                                    priority: { type: "string" },
                                    estimated_time: { type: "string" },
                                    responsible_team: { type: "string" },
                                    status: { type: "string" }
                                }
                            }
                        },
                        investigation_steps: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    step: { type: "string" },
                                    tools_required: { type: "array", items: { type: "string" } },
                                    timeline: { type: "string" }
                                }
                            }
                        },
                        communication_plan: {
                            type: "object",
                            properties: {
                                internal_notifications: { type: "array", items: { type: "string" } },
                                external_communications: { type: "array", items: { type: "string" } },
                                media_response: { type: "string" }
                            }
                        },
                        recovery_procedures: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    procedure: { type: "string" },
                                    dependencies: { type: "array", items: { type: "string" } },
                                    success_criteria: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setResponseActions(response);
        } catch (error) {
            console.error("Error generating incident response:", error);
        }
        setIsGeneratingResponse(false);
    };

    const getSeverityColor = (severity) => ({
        critical: 'bg-red-500 text-white',
        high: 'bg-orange-500 text-white',
        medium: 'bg-yellow-500 text-white',
        low: 'bg-blue-500 text-white'
    }[severity] || 'bg-slate-500 text-white');

    const getStatusColor = (status) => ({
        active: 'bg-red-100 text-red-800',
        investigating: 'bg-yellow-100 text-yellow-800',
        contained: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800'
    }[status] || 'bg-slate-100 text-slate-800');

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'High': return <Activity className="w-4 h-4 text-orange-500" />;
            case 'Medium': return <Clock className="w-4 h-4 text-yellow-500" />;
            default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Active Incidents Dashboard */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Cross-Chain Incident Response Center
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-red-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-red-600">
                                {incidents.filter(i => i.status === 'active').length}
                            </p>
                            <p className="text-sm text-red-800">Active Incidents</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {incidents.filter(i => i.status === 'investigating').length}
                            </p>
                            <p className="text-sm text-yellow-800">Under Investigation</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {incidents.filter(i => i.status === 'resolved').length}
                            </p>
                            <p className="text-sm text-green-800">Resolved Today</p>
                        </div>
                    </div>

                    {/* Incident List */}
                    <div className="space-y-3">
                        {incidents.map((incident) => (
                            <motion.div
                                key={incident.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedIncident(incident)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedIncident?.id === incident.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h5 className="font-semibold">{incident.title}</h5>
                                            <Badge className={getSeverityColor(incident.severity)}>
                                                {incident.severity}
                                            </Badge>
                                            <Badge className={getStatusColor(incident.status)}>
                                                {incident.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-1">{incident.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span>{incident.id}</span>
                                            <span>{incident.affectedBridge}</span>
                                            <span>{incident.createdAt.toLocaleString()}</span>
                                            <span className="font-medium text-red-600">{incident.estimatedLoss}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Incident Response Plan */}
            {selectedIncident && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-slate-900">
                            Response Plan: {selectedIncident.title}
                        </CardTitle>
                        <Button 
                            onClick={() => generateIncidentResponse(selectedIncident)}
                            disabled={isGeneratingResponse}
                        >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {isGeneratingResponse ? 'Generating...' : 'Generate Response Plan'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {responseActions.immediate_actions ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {/* Immediate Actions */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        Immediate Actions
                                    </h4>
                                    <div className="space-y-3">
                                        {responseActions.immediate_actions.map((action, i) => (
                                            <div key={i} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {getPriorityIcon(action.priority)}
                                                        <h5 className="font-semibold">{action.action}</h5>
                                                    </div>
                                                    <Badge className={getSeverityColor(action.priority.toLowerCase())}>
                                                        {action.priority}
                                                    </Badge>
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-600">Time: </span>
                                                        <span className="font-medium">{action.estimated_time}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600">Team: </span>
                                                        <span className="font-medium">{action.responsible_team}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600">Status: </span>
                                                        <Badge className={getStatusColor(action.status)}>
                                                            {action.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Investigation Steps */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">Investigation Procedures</h4>
                                    <div className="space-y-3">
                                        {responseActions.investigation_steps.map((step, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                                <h5 className="font-semibold mb-2">{step.step}</h5>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-slate-600 mb-1">Tools Required:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {step.tools_required.map((tool, j) => (
                                                                <Badge key={j} variant="outline">{tool}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-600">Timeline:</p>
                                                        <p className="font-medium">{step.timeline}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Communication Plan */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">Communication Plan</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-semibold mb-2">Internal Notifications</h5>
                                            <ul className="space-y-1">
                                                {responseActions.communication_plan.internal_notifications.map((notification, i) => (
                                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                                        {notification}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold mb-2">External Communications</h5>
                                            <ul className="space-y-1">
                                                {responseActions.communication_plan.external_communications.map((communication, i) => (
                                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                        {communication}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Media Response:</strong> {responseActions.communication_plan.media_response}
                                        </p>
                                    </div>
                                </div>

                                {/* Recovery Procedures */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">Recovery Procedures</h4>
                                    <div className="space-y-3">
                                        {responseActions.recovery_procedures.map((procedure, i) => (
                                            <div key={i} className="p-4 border rounded-lg">
                                                <h5 className="font-semibold mb-2">{procedure.procedure}</h5>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-slate-600 mb-1">Dependencies:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {procedure.dependencies.map((dep, j) => (
                                                                <Badge key={j} variant="outline">{dep}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-600">Success Criteria:</p>
                                                        <p className="text-sm text-slate-700">{procedure.success_criteria}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-8">
                                <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600">Click "Generate Response Plan" to create automated incident response procedures</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}