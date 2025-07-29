import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, ScanLine, BrainCircuit, ListOrdered, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DataClassificationEngine() {
    const [classificationData, setClassificationData] = useState([
        { name: 'Confidential', value: 400, color: '#ef4444' },
        { name: 'Restricted', value: 300, color: '#f59e0b' },
        { name: 'Internal', value: 500, color: '#3b82f6' },
        { name: 'Public', value: 800, color: '#10b981' },
    ]);
    const [rules, setRules] = useState([
        { id: 1, name: "PII Detection", pattern: "/\\b\\d{3}-\\d{2}-\\d{4}\\b/g", class: "Confidential", active: true },
        { id: 2, name: "Financial Data", pattern: "credit card, account number", class: "Restricted", active: true },
        { id: 3, name: "Project Keywords", pattern: "Project Serpent, Alpha", class: "Internal", active: false }
    ]);
    const [isScanning, setIsScanning] = useState(false);
    const [suggestedRules, setSuggestedRules] = useState(null);

    const startScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 3000);
    };

    const getSuggestedRules = async () => {
        const response = await InvokeLLM({
            prompt: `Based on data classifications (Confidential, Restricted, Internal, Public) and existing rules for PII and financial data, suggest 3 new, innovative classification rules. Consider unstructured data, images, or code comments as potential sources.`,
            response_json_schema: {
                type: "object",
                properties: {
                    rules: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                pattern: { type: "string" },
                                class: { type: "string" },
                                rationale: { type: "string" }
                            }
                        }
                    }
                }
            }
        });
        setSuggestedRules(response.rules);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileCheck className="text-green-600"/> Data Classification Overview</CardTitle>
                    <CardDescription>Real-time view of classified data distribution.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={classificationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                    {classificationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListOrdered className="text-blue-600"/> Classification Rules</CardTitle>
                    <CardDescription>Manage and deploy rules to classify data automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 mb-4">
                        {rules.map(rule => (
                            <div key={rule.id} className="flex justify-between items-center p-2 rounded-md bg-slate-50">
                                <div>
                                    <span className="font-semibold">{rule.name}</span>
                                    <Badge variant="secondary" className="ml-2">{rule.class}</Badge>
                                </div>
                                <Badge variant={rule.active ? 'default' : 'outline'}>{rule.active ? "Active" : "Inactive"}</Badge>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={startScan} disabled={isScanning} className="w-full">
                            <ScanLine className="w-4 h-4 mr-2"/> {isScanning ? "Scanning..." : "Run Full Scan"}
                        </Button>
                        <Button onClick={getSuggestedRules} variant="outline" className="w-full">
                            <BrainCircuit className="w-4 h-4 mr-2" /> Suggest Rules
                        </Button>
                    </div>
                     {suggestedRules && (
                        <div className="mt-4 space-y-2">
                            <h4 className="font-semibold">AI-Suggested Rules:</h4>
                            {suggestedRules.map((rule, i) => (
                                <div key={i} className="p-2 border rounded-md bg-blue-50 border-blue-200">
                                    <p><strong>{rule.name}</strong> <Badge variant="secondary">{rule.class}</Badge></p>
                                    <p className="text-sm text-slate-600">{rule.rationale}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}