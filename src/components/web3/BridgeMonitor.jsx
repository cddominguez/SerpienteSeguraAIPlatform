import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, Shield, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BridgeMonitor() {
  const [selectedBridge, setSelectedBridge] = useState(null);

  const bridges = [
    {
      id: 'eth-polygon',
      name: 'Ethereum ↔ Polygon',
      status: 'secure',
      volume24h: '15.2M',
      transactions: 2847,
      tvl: '124.5M',
      securityScore: 95
    },
    {
      id: 'bsc-avalanche',
      name: 'BSC ↔ Avalanche',
      status: 'monitoring',
      volume24h: '8.7M',
      transactions: 1523,
      tvl: '67.3M',
      securityScore: 88
    }
  ];

  const chartData = [
    { time: '00:00', volume: 1200, security: 95 },
    { time: '04:00', volume: 800, security: 94 },
    { time: '08:00', volume: 1500, security: 96 },
    { time: '12:00', volume: 2200, security: 95 },
    { time: '16:00', volume: 1800, security: 97 },
    { time: '20:00', volume: 1400, security: 95 },
  ];

  const getStatusColor = (status) => ({
    secure: 'bg-green-100 text-green-800',
    monitoring: 'bg-yellow-100 text-yellow-800',
    warning: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }[status] || 'bg-slate-100 text-slate-800');

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitCompareArrows className="w-5 h-5 text-blue-600" />
            Cross-Chain Bridge Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {bridges.map((bridge) => (
              <div
                key={bridge.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedBridge?.id === bridge.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedBridge(bridge)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{bridge.name}</h3>
                  <Badge className={getStatusColor(bridge.status)}>
                    {bridge.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">TVL:</span>
                    <div className="font-bold">${bridge.tvl}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">24h Volume:</span>
                    <div className="font-bold">${bridge.volume24h}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Transactions:</span>
                    <div className="font-bold">{bridge.transactions.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Security Score:</span>
                    <div className="font-bold text-green-600">{bridge.securityScore}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Bridge Activity Monitoring</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} name="Volume ($M)" />
                <Line type="monotone" dataKey="security" stroke="#10b981" strokeWidth={2} name="Security Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}