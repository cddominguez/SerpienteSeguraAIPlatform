import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Key, Cpu, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const overviewData = {
    totalAssets: 12450,
    encryptedAssets: 11890,
    keysManaged: 78,
    pqcReadyKeys: 12,
    encryptionHealth: 92,
    highRiskAssets: 45,
};

const encryptionByAssetType = [
    { name: 'Databases', encrypted: 95 },
    { name: 'File Systems', encrypted: 98 },
    { name: 'Backups', encrypted: 100 },
    { name: 'APIs', encrypted: 85 },
    { name: 'User Devices', encrypted: 91 },
];

export default function EncryptionOverview() {
    const encryptionPercentage = ((overviewData.encryptedAssets / overviewData.totalAssets) * 100).toFixed(1);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Encryption Coverage</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{encryptionPercentage}%</div>
                    <p className="text-xs text-muted-foreground">
                        {overviewData.encryptedAssets} of {overviewData.totalAssets} assets encrypted
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Managed Keys</CardTitle>
                    <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overviewData.keysManaged}</div>
                    <p className="text-xs text-muted-foreground">
                        <Badge className="bg-purple-100 text-purple-800">{overviewData.pqcReadyKeys} PQC-ready keys</Badge>
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Encryption Health</CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overviewData.encryptionHealth}%</div>
                    <p className="text-xs text-muted-foreground">Based on policy compliance</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unencrypted Risks</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">{overviewData.highRiskAssets}</div>
                    <p className="text-xs text-muted-foreground">High-sensitivity unencrypted assets</p>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-4">
                 <CardHeader>
                    <CardTitle>Encryption by Asset Type</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={encryptionByAssetType}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip />
                            <Bar dataKey="encrypted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}