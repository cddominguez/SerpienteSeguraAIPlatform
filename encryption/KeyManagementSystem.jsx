import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Key, Plus, RefreshCw, ShieldOff, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KeyManagementSystem() {
    const [keys, setKeys] = useState([
        { id: 'KMS-001', algorithm: 'AES-256-GCM', strength: 256, status: 'Active', created: '2023-10-26', rotationDue: '2024-10-26' },
        { id: 'KMS-002', algorithm: 'RSA-4096', strength: 4096, status: 'Active', created: '2023-08-15', rotationDue: '2024-08-15' },
        { id: 'KMS-003', algorithm: 'CRYSTALS-Kyber-1024', strength: 1024, status: 'Active', created: '2024-01-20', rotationDue: '2025-01-20', quantumReady: true },
        { id: 'KMS-004', algorithm: 'AES-128-CBC', strength: 128, status: 'Deprecated', created: '2022-05-10', rotationDue: 'N/A' },
    ]);
    const [newKey, setNewKey] = useState({ algorithm: '', strength: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendations, setRecommendations] = useState(null);

    const generateKey = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const newKeyData = {
                id: `KMS-${String(keys.length + 1).padStart(3, '0')}`,
                algorithm: newKey.algorithm,
                strength: newKey.strength,
                status: 'Active',
                created: new Date().toISOString().split('T')[0],
                rotationDue: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                quantumReady: newKey.algorithm.includes('Kyber')
            };
            setKeys(prev => [newKeyData, ...prev]);
            setIsGenerating(false);
        }, 1000);
    };

    const getAIRecommendations = async () => {
        const response = await InvokeLLM({
            prompt: `Based on this list of cryptographic keys, provide 3 actionable recommendations for improving our key management security posture. Focus on key rotation, algorithm strength, and quantum readiness. Keys: ${JSON.stringify(keys)}`,
            response_json_schema: {
                type: 'object',
                properties: {
                    recommendations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                description: { type: 'string' },
                                priority: { type: 'string', enum: ['High', 'Medium', 'Low'] }
                            }
                        }
                    }
                }
            }
        });
        setRecommendations(response.recommendations);
    };

    const getStatusColor = (status) => ({
        'Active': 'bg-green-100 text-green-800',
        'Deprecated': 'bg-yellow-100 text-yellow-800',
        'Revoked': 'bg-red-100 text-red-800'
    }[status] || 'bg-slate-100 text-slate-800');

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Key className="w-5 h-5 text-blue-600" />
                            Key Management System (KMS)
                        </CardTitle>
                        <CardDescription>Manage the lifecycle of cryptographic keys.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={getAIRecommendations} disabled={!!recommendations}>
                             <BrainCircuit className="w-4 h-4 mr-2" /> AI Recommendations
                         </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" /> Generate New Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Generate New Cryptographic Key</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <Select onValueChange={(v) => setNewKey(p => ({...p, algorithm: v}))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Algorithm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AES-256-GCM">AES-256-GCM (Symmetric)</SelectItem>
                                            <SelectItem value="RSA-4096">RSA-4096 (Asymmetric)</SelectItem>
                                            <SelectItem value="CRYSTALS-Kyber-1024">CRYSTALS-Kyber-1024 (PQC)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input placeholder="Key Strength (e.g., 256)" onChange={(e) => setNewKey(p => ({...p, strength: e.target.value}))} />
                                    <Button onClick={generateKey} disabled={isGenerating} className="w-full">
                                        {isGenerating ? 'Generating...' : 'Generate Key'}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {recommendations && (
                        <motion.div initial={{opacity:0, y: -10}} animate={{opacity:1, y:0}} className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                             <h4 className="font-semibold text-blue-900">AI-Powered Recommendations</h4>
                             {recommendations.map((rec, i) => (
                                 <div key={i} className="text-sm">
                                     <Badge className={rec.priority === 'High' ? 'bg-red-500' : rec.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}>{rec.priority}</Badge>
                                     <strong className="ml-2">{rec.title}:</strong>
                                     <p className="text-blue-800 pl-2 border-l-2 border-blue-200 ml-2 mt-1">{rec.description}</p>
                                 </div>
                             ))}
                        </motion.div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key ID</TableHead>
                                <TableHead>Algorithm</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Rotation Due</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.map(key => (
                                <TableRow key={key.id}>
                                    <TableCell className="font-mono">{key.id}</TableCell>
                                    <TableCell>
                                        {key.algorithm}
                                        {key.quantumReady && <Badge className="ml-2 bg-purple-100 text-purple-800">PQC</Badge>}
                                    </TableCell>
                                    <TableCell><Badge className={getStatusColor(key.status)}>{key.status}</Badge></TableCell>
                                    <TableCell>{key.created}</TableCell>
                                    <TableCell>{key.rotationDue}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1"/> Rotate</Button>
                                        <Button variant="destructive" size="sm"><ShieldOff className="w-4 h-4 mr-1"/> Revoke</Button>
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