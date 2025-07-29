import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Zap, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

export default function RealTimeAnalytics({ metrics, events, threats }) {
  const [realtimeData, setRealtimeData] = useState([]);
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    throughput: 0,
    latency: 0,
    errorRate: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Generate real-time analytics data
    const generateData = () => {
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString(),
        threats: threats.filter(t => t.status === 'active').length,
        events: Math.floor(Math.random() * 100) + 50,
        bandwidth: Math.floor(Math.random() * 50) + 30,
        connections: Math.floor(Math.random() * 200) + 400
      };

      setRealtimeData(prev => [...prev.slice(-19), newPoint]);
      
      // Update analytics metrics
      setAnalyticsMetrics({
        throughput: Math.floor(Math.random() * 1000) + 2000,
        latency: Math.floor(Math.random() * 50) + 10,
        errorRate: Math.random() * 2,
        activeUsers: Math.floor(Math.random() * 100) + 150
      });
    };

    generateData();
    const interval = setInterval(generateData, 2000);
    
    return () => clearInterval(interval);
  }, [threats]);

  const getMetricColor = (value, threshold) => {
    if (value > threshold) return 'text-red-600';
    if (value > threshold * 0.8) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Real-time Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-emerald-700">Throughput</p>
            <p className="text-xl font-bold text-emerald-900">{analyticsMetrics.throughput}</p>
            <p className="text-xs text-emerald-600">events/sec</p>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <Zap className="w-4 h-4 text-cyan-600" />
              <Badge variant="outline" className="text-xs">
                {analyticsMetrics.latency}ms
              </Badge>
            </div>
            <p className="text-sm text-cyan-700">Avg Latency</p>
            <p className={`text-xl font-bold ${getMetricColor(analyticsMetrics.latency, 100)}`}>
              {analyticsMetrics.latency}ms
            </p>
            <p className="text-xs text-cyan-600">response time</p>
          </div>
        </div>

        {/* Real-time Chart */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Live Security Events</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={10} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="events" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* System Performance */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">System Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Error Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${getMetricColor(analyticsMetrics.errorRate, 5)}`}>
                  {analyticsMetrics.errorRate.toFixed(2)}%
                </span>
                <div className="w-16 bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      analyticsMetrics.errorRate > 5 ? 'bg-red-500' :
                      analyticsMetrics.errorRate > 2 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(analyticsMetrics.errorRate * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Active Connections</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {analyticsMetrics.activeUsers}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Processing Load</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-purple-600">
                  {Math.floor(Math.random() * 40) + 60}%
                </span>
                <div className="w-16 bg-slate-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
            <p className="text-xs text-slate-600">Security AI</p>
            <p className="text-xs text-green-600">Active</p>
          </motion.div>
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1 animate-pulse" />
            <p className="text-xs text-slate-600">Threat Engine</p>
            <p className="text-xs text-blue-600">Processing</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1 animate-pulse" />
            <p className="text-xs text-slate-600">Analytics</p>
            <p className="text-xs text-purple-600">Live</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}