import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Shield, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MEVAnalytics({ mevData }) {
    const analyticsData = {
        profitByDay: [
            { day: 'Mon', profit: 12.5 },
            { day: 'Tue', profit: 15.2 },
            { day: 'Wed', profit: 8.9 },
            { day: 'Thu', profit: 20.1 },
            { day: 'Fri', profit: 25.6 },
            { day: 'Sat', profit: 18.3 },
            { day: 'Sun', profit: 22.7 },
        ],
        mevTypeDistribution: [
            { name: 'Sandwich', value: 45 },
            { name: 'Front-running', value: 30 },
            { name: 'Back-running', value: 15 },
            { name: 'Arbitrage', value: 10 },
        ],
        protectionEffectiveness: [
            { month: 'Jan', blocked: 65, missed: 35 },
            { month: 'Feb', blocked: 70, missed: 30 },
            { month: 'Mar', blocked: 78, missed: 22 },
            { month: 'Apr', blocked: 85, missed: 15 },
        ],
        totalProfit: '122.3 ETH',
        attacksBlocked: 1428,
        avgProfitPerAttack: '0.086 ETH'
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                     <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        MEV Analytics Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-600 mb-1">Total MEV Profit (30d)</h4>
                        <p className="text-2xl font-bold text-emerald-600">{analyticsData.totalProfit}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-600 mb-1">Attacks Blocked (30d)</h4>
                        <p className="text-2xl font-bold text-blue-600">{analyticsData.attacksBlocked}</p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-600 mb-1">Avg. Profit / Attack</h4>
                        <p className="text-2xl font-bold text-orange-600">{analyticsData.avgProfitPerAttack}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" /> MEV Profit by Day
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.profitByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="profit" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                         <Bot className="w-5 h-5 text-purple-500" /> MEV Type Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={analyticsData.mevTypeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {analyticsData.mevTypeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                         <Shield className="w-5 h-5 text-green-500" /> Protection Effectiveness
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.protectionEffectiveness}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="blocked" stroke="#16a34a" strokeWidth={2} name="Blocked (%)" />
                            <Line type="monotone" dataKey="missed" stroke="#ef4444" strokeWidth={2} name="Missed (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}