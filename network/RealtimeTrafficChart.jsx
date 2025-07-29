import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from "lucide-react";

export default function RealtimeTrafficChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateInitialData = () => {
      const initialData = [];
      for (let i = 29; i >= 0; i--) {
        const time = new Date();
        time.setSeconds(time.getSeconds() - i * 5);
        initialData.push({
          time: time.toLocaleTimeString(),
          inbound: Math.floor(Math.random() * 500 + 100),
          outbound: Math.floor(Math.random() * 300 + 50),
        });
      }
      return initialData;
    };
    setData(generateInitialData());

    const interval = setInterval(() => {
      setData(prevData => {
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          inbound: Math.floor(Math.random() * 500 + 100),
          outbound: Math.floor(Math.random() * 300 + 50),
        };
        const updatedData = [...prevData.slice(1), newDataPoint];
        if (Math.random() > 0.9) { // Occasionally spike for anomaly
            updatedData[29].inbound = Math.floor(Math.random() * 1000 + 800);
        }
        return updatedData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Real-time Network Traffic (Mbps)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
              }}
            />
            <Area type="monotone" dataKey="inbound" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInbound)" name="Inbound" />
            <Area type="monotone" dataKey="outbound" stroke="#10b981" fillOpacity={1} fill="url(#colorOutbound)" name="Outbound" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}