import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { List, Brain, Zap } from 'lucide-react';

export default function AnomalyDetectionSystem() {
    const [anomalies, setAnomalies] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    const scanForAnomalies = async () => {
        setIsScanning(true);
        const response = await InvokeLLM({
            prompt: "Analyze simulated network traffic, user logs, and system calls to detect anomalies. Focus on identifying potential AI-driven threats like advanced bots, synthetic voice patterns, and polymorphic malware signatures.",
            response_json_schema: {
                type: 'object',
                properties: {
                    detected_anomalies: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                type: { type: 'string', enum: ['Advanced Bot', 'Synthetic Voice', 'AI-Generated Malware', 'DDoS Pattern'] },
                                severity: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
                                source_ip: { type: 'string' },
                                description: { type: 'string' },
                                confidence: { type: 'number' }
                            }
                        }
                    }
                }
            }
        });
        setAnomalies(response.detected_anomalies || []);
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
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Real-Time Anomaly Detection
                    </CardTitle>
                    <CardDescription>Detect advanced AI-driven threats across all vectors.</CardDescription>
                </div>
                <Button onClick={scanForAnomalies} disabled={isScanning}>
                    <Brain className="w-4 h-4 mr-2" /> {isScanning ? 'Scanning...' : 'Initiate Scan'}
                </Button>
            </CardHeader>
            <CardContent>
                {anomalies.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No anomalies detected. Run a scan to find threats.</p>
                ) : (
                    <div className="space-y-4">
                        {anomalies.map(anomaly => (
                            <div key={anomaly.id} className="p-4 border rounded-lg bg-slate-50 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800">{anomaly.type}</h4>
                                        <p className="text-sm text-slate-600">{anomaly.description}</p>
                                        <p className="text-xs text-slate-500">Source: {anomaly.source_ip}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={getSeverityBadge(anomaly.severity)}>{anomaly.severity}</Badge>
                                        <p className="text-xs mt-2 text-slate-500">Confidence: {anomaly.confidence}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}