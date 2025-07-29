import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Siren, Zap, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutomatedIncidentResponse({ incidents }) {
    const [activeIncident, setActiveIncident] = useState({
        id: 'INC-2024-07-20-001',
        title: 'Suspected Ransomware Activity on DB-SERVER-03',
        status: 'investigating',
        severity: 'Critical',
        detected: new Date().toISOString(),
    });
    const [playbook, setPlaybook] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);

    const runAutomatedPlaybook = async () => {
        setIsExecuting(true);
        const response = await InvokeLLM({
            prompt: `For the incident "${activeIncident.title}", generate and execute an automated incident response playbook. Include steps for containment, eradication, and recovery.`,
            response_json_schema: {
                type: 'object',
                properties: {
                    playbook_name: { type: 'string' },
                    steps: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                phase: { type: 'string', enum: ['Containment', 'Eradication', 'Recovery', 'Post-Mortem'] },
                                action: { type: 'string' },
                                status: { type: 'string', enum: ['Completed', 'In Progress', 'Failed', 'Pending'] },
                                details: { type: 'string' }
                            }
                        }
                    },
                    summary_report: { type: 'string' }
                }
            }
        });

        setPlaybook(response);
        // Simulate execution
        for (let i = 0; i < response.steps.length; i++) {
            await new Promise(res => setTimeout(res, 700));
            setPlaybook(prev => {
                const newSteps = [...prev.steps];
                newSteps[i].status = 'Completed';
                if (i + 1 < newSteps.length) {
                    newSteps[i + 1].status = 'In Progress';
                }
                return { ...prev, steps: newSteps };
            });
        }
        setIsExecuting(false);
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Siren className="w-5 h-5 text-orange-600" />
                        Automated Incident Response (SOAR)
                    </CardTitle>
                    <CardDescription>AI-driven playbooks to detect, contain, and mitigate threats.</CardDescription>
                </div>
                 <Button onClick={runAutomatedPlaybook} disabled={isExecuting}>
                     <Zap className="w-4 h-4 mr-2"/> {isExecuting ? 'Executing Playbook...' : 'Execute Playbook'}
                 </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-bold text-red-900">{activeIncident.title}</h3>
                    <div className="flex gap-4 text-sm mt-2">
                        <Badge variant="destructive">{activeIncident.severity}</Badge>
                        <Badge variant="secondary">{activeIncident.status}</Badge>
                        <span>Detected: {new Date(activeIncident.detected).toLocaleTimeString()}</span>
                    </div>
                </div>

                <AnimatePresence>
                {playbook && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        <h3 className="font-semibold mb-2">{playbook.playbook_name}</h3>
                        <div className="space-y-3">
                        {playbook.steps.map((step, index) => (
                             <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{delay: index*0.1}} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}>
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    {index < playbook.steps.length - 1 && <div className="w-0.5 h-12 bg-slate-300" />}
                                </div>
                                <div>
                                    <p className="font-medium">{step.phase}: {step.action}</p>
                                    <p className="text-sm text-slate-600">{step.details}</p>
                                </div>
                             </motion.div>
                        ))}
                        </div>
                        {playbook.steps.every(s => s.status === 'Completed') && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-semibold text-green-900">Post-Mortem Summary</h4>
                                <p className="text-sm mt-2">{playbook.summary_report}</p>
                            </div>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}