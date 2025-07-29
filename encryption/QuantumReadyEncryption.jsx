import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import QuantumThreatDetector from './QuantumThreatDetector';
import { ShieldCheck, Brain, GitPullRequest, Layers } from 'lucide-react';

const pqcStats = {
    pqcAlgorithmsAvailable: 4,
    keysMigrated: 12,
    totalKeys: 78,
    hybridSchemas: 5,
};

export default function QuantumReadyEncryption() {
    const migrationProgress = ((pqcStats.keysMigrated / pqcStats.totalKeys) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <ShieldCheck className="w-6 h-6 text-indigo-600"/>
                        Post-Quantum Cryptography (PQC) Center
                    </CardTitle>
                    <CardDescription>Prepare your data for the quantum computing era with next-generation encryption.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <InfoCard icon={Brain} title="PQC Algorithms" value={pqcStats.pqcAlgorithmsAvailable} description="NIST-approved algorithms ready for deployment." />
                        <InfoCard icon={GitPullRequest} title="Migration Progress" value={`${migrationProgress}%`} description={`${pqcStats.keysMigrated} of ${pqcStats.totalKeys} keys migrated.`} />
                        <InfoCard icon={Layers} title="Hybrid Schemas" value={pqcStats.hybridSchemas} description="Combining classical and PQC for robust security." />
                        <InfoCard icon={ShieldCheck} title="Overall Readiness" value="Developing" description="Actively transitioning to quantum-safe standards." />
                    </div>
                </CardContent>
            </Card>
            
            <QuantumThreatDetector />
        </div>
    );
}

const InfoCard = ({ icon: Icon, title, value, description }) => (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5 text-indigo-500" />
            <p className="text-sm font-medium text-slate-600">{title}</p>
        </div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);