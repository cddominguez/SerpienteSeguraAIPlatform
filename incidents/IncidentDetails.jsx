import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Bot, Check, FileText } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import ReactMarkdown from 'react-markdown';
import { Incident } from '@/api/entities';

const AIRootCauseAnalysis = ({ incident }) => {
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const runAnalysis = async () => {
        setIsLoading(true);
        try {
            const response = await InvokeLLM({
                prompt: `Analyze the following cybersecurity incident and provide a root cause analysis. What happened, what was the likely attack vector, and what are the recommended immediate actions?
                
Incident Details:
Title: ${incident.title}
Summary: ${incident.summary}
Affected Systems: ${incident.affected_systems.join(', ')}
`,
                response_json_schema: {
                    type: 'object',
                    properties: {
                        root_cause: { type: 'string', description: 'Detailed analysis of the likely root cause.'},
                        attack_path: { type: 'string', description: 'Step-by-step description of the likely attack path in markdown.'},
                        recommendations: { type: 'array', items: { type: 'string'}, description: 'List of actionable recommendations.'}
                    }
                }
            });
            setAnalysis(response);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <Card className="bg-slate-50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600"/>
                    AI-Assisted Investigation
                </CardTitle>
                <Button onClick={runAnalysis} disabled={isLoading} size="sm">
                    {isLoading ? 'Analyzing...' : 'Run AI Analysis'}
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading && <Skeleton className="h-32 w-full"/>}
                {analysis && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1">Root Cause Analysis</h4>
                            <p className="text-sm text-slate-700">{analysis.root_cause}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Simulated Attack Path</h4>
                            <div className="prose prose-sm max-w-none p-3 bg-slate-200 rounded-lg">
                                <ReactMarkdown>{analysis.attack_path}</ReactMarkdown>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Recommended Actions</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                                {analysis.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function IncidentDetails({ incident, isLoading, refreshIncidents }) {

    if (isLoading) return <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl"><CardContent><Skeleton className="h-96 w-full" /></CardContent></Card>;
    if (!incident) return <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl"><CardContent><div className="flex items-center justify-center h-96"><p>Select an incident to view details.</p></div></CardContent></Card>;

    const handleUpdateStatus = async (newStatus) => {
        const updateData = { status: newStatus };
        if (newStatus === 'closed') {
            updateData.resolution_time = new Date().toISOString();
        }
        await Incident.update(incident.id, updateData);
        await refreshIncidents();
    };
    
    const getNextStatus = () => {
        const statuses = ["new", "investigating", "contained", "eradicating", "recovering", "closed"];
        const currentIndex = statuses.indexOf(incident.status);
        return statuses[currentIndex + 1];
    }
    const nextStatus = getNextStatus();

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{incident.title}</CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive">{incident.priority} Priority</Badge>
                            <Badge variant="secondary">{incident.status}</Badge>
                        </div>
                    </div>
                    {nextStatus && (
                        <Button onClick={() => handleUpdateStatus(nextStatus)}>
                           {nextStatus === 'closed' ? <Check className="w-4 h-4 mr-2"/> : <ArrowRight className="w-4 h-4 mr-2" />}
                           Move to: {nextStatus}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> Incident Summary</h3>
                    <p className="text-sm text-slate-600">{incident.summary}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Affected Systems</h3>
                    <div className="flex flex-wrap gap-2">
                        {incident.affected_systems.map(system => (
                            <Badge key={system} variant="outline">{system}</Badge>
                        ))}
                    </div>
                </div>
                
                <AIRootCauseAnalysis incident={incident} />

            </CardContent>
        </Card>
    );
}