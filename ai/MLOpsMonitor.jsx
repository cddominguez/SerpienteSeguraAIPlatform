import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GitBranch, BrainCircuit, Activity, Database } from 'lucide-react';

export default function MLOpsMonitor({ models, isLoading }) {
    const data = [
        { name: 'Jan', accuracy: 92.1, drift: 1.2 },
        { name: 'Feb', accuracy: 92.5, drift: 1.1 },
        { name: 'Mar', accuracy: 93.2, drift: 0.9 },
        { name: 'Apr', accuracy: 93.1, drift: 1.0 },
        { name: 'May', accuracy: 92.8, drift: 1.3 },
        { name: 'Jun', accuracy: 94.0, drift: 0.7 },
    ];

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-teal-600" />
                    MLOps & Model Performance
                </CardTitle>
                <CardDescription>Monitor the health, performance, and lifecycle of all security AI models.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-500">Total Models</h4>
                        <p className="text-2xl font-bold">{isLoading ? '...' : models.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-500">Avg. Accuracy</h4>
                        <p className="text-2xl font-bold text-emerald-600">{isLoading ? '...' : `${(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length).toFixed(2)}%`}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-500">Models in Training</h4>
                        <p className="text-2xl font-bold text-blue-600">{isLoading ? '...' : models.filter(m => m.status === 'training').length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-500">Data Sources</h4>
                        <p className="text-2xl font-bold">12 Active</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Overall Model Performance Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#10b981" name="Accuracy (%)" />
                            <Line yAxisId="right" type="monotone" dataKey="drift" stroke="#f59e0b" name="Concept Drift (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}