import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MEVProtectionDashboard() {
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  
  const mevData = [
    { time: '00:00', blocked: 12, profit: 2.4 },
    { time: '04:00', blocked: 8, profit: 1.8 },
    { time: '08:00', blocked: 15, profit: 3.2 },
    { time: '12:00', blocked: 22, profit: 4.1 },
    { time: '16:00', blocked: 18, profit: 3.6 },
    { time: '20:00', blocked: 14, profit: 2.9 },
  ];

  const stats = {
    totalBlocked: 156,
    savedValue: '12.4 ETH',
    protectionRate: 94.2,
    avgBlockTime: '2.3s'
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            MEV Protection Dashboard
          </CardTitle>
          <Button 
            variant={protectionEnabled ? "default" : "outline"}
            onClick={() => setProtectionEnabled(!protectionEnabled)}
          >
            {protectionEnabled ? 'Protection Active' : 'Enable Protection'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-600">MEV Blocked</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{stats.totalBlocked}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-600">Value Saved</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.savedValue}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-600">Protection Rate</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.protectionRate}%</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-slate-600">Avg Block Time</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.avgBlockTime}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">MEV Protection Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mevData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} name="Blocked Attacks" />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} name="Saved Value (ETH)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}