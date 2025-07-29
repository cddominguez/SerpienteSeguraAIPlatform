import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Plus, BrainCircuit, FileCog } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EncryptionPolicyManager() {
    const [policies, setPolicies] = useState([
        { id: 'POL-01', name: 'Encrypt PII Data at Rest',対象: 'Databases', type: 'Data at Rest', algorithm: 'AES-256-GCM', enforced: true },
        { id: 'POL-02', name: 'Encrypt Financial Data in Transit',対象: 'APIs', type: 'Data in Transit', algorithm: 'TLS 1.3', enforced: true },
        { id: 'POL-03', name: 'Encrypt All Backups',対象: 'Backups', type: 'Data at Rest', algorithm: 'AES-256-GCM', enforced: true },
        { id: 'POL-04', name: 'Quantum-Safe Encryption for IP',対象: 'Internal Storage', type: 'Data at Rest', algorithm: 'Kyber-1024 + AES', enforced: false },
    ]);
    const [suggestedPolicy, setSuggestedPolicy] = useState(null);

    const togglePolicy = (id) => {
        setPolicies(policies.map(p => p.id === id ? { ...p, enforced: !p.enforced } : p));
    };
    
    const getSuggestedPolicy = async () => {
        const response = await InvokeLLM({
            prompt: `Based on current encryption policies ${JSON.stringify(policies)} and best practices for data security, suggest a new, high-impact encryption policy. Consider data types like logs, user-generated content, or IoT device data.`,
            response_json_schema: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    target: { type: 'string' },
                    type: { type: 'string' },
                    algorithm: { type: 'string' },
                    rationale: { type: 'string' }
                }
            }
        });
        setSuggestedPolicy(response);
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileCog className="w-5 h-5 text-purple-600" />
                        Encryption Policy Manager
                    </CardTitle>
                    <CardDescription>Define and enforce encryption policies across all data assets.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={getSuggestedPolicy} disabled={!!suggestedPolicy}>
                        <BrainCircuit className="w-4 h-4 mr-2" /> Suggest Policy
                    </Button>
                    <Button><Plus className="w-4 h-4 mr-2"/> New Policy</Button>
                </div>
            </CardHeader>
            <CardContent>
                {suggestedPolicy && (
                    <motion.div initial={{opacity:0, y: -10}} animate={{opacity:1, y:0}} className="mb-6 bg-purple-50 border border-purple-200 p-4 rounded-lg">
                         <h4 className="font-semibold text-purple-900">AI-Suggested Policy</h4>
                         <p className="font-bold mt-2">{suggestedPolicy.name}</p>
                         <p className="text-sm text-purple-800">{suggestedPolicy.rationale}</p>
                         <div className="flex gap-4 mt-2 text-sm">
                            <span>Target: <Badge variant="secondary">{suggestedPolicy.target}</Badge></span>
                            <span>Algorithm: <Badge variant="secondary">{suggestedPolicy.algorithm}</Badge></span>
                         </div>
                         <Button className="mt-3" size="sm">Implement Suggested Policy</Button>
                    </motion.div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Policy Name</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Algorithm</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {policies.map(policy => (
                            <TableRow key={policy.id}>
                                <TableCell className="font-medium">{policy.name}</TableCell>
                                <TableCell>{policy.target}</TableCell>
                                <TableCell><Badge variant="outline">{policy.algorithm}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={policy.enforced}
                                            onCheckedChange={() => togglePolicy(policy.id)}
                                            id={`switch-${policy.id}`}
                                        />
                                        <label htmlFor={`switch-${policy.id}`} className={policy.enforced ? "text-green-600" : "text-slate-500"}>
                                            {policy.enforced ? "Enforced" : "Disabled"}
                                        </label>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}