import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Smartphone, Shield, AlertTriangle, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeviceStats({ devices, isLoading }) {
  const stats = {
    total: devices.length,
    protected: devices.filter(d => d.status === 'protected').length,
    atRisk: devices.filter(d => d.status === 'at_risk' || d.status === 'compromised').length,
    offline: devices.filter(d => d.status === 'offline').length,
  };

  const statItems = [
    { title: 'Total Devices', value: stats.total, icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Fully Protected', value: stats.protected, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'At Risk', value: stats.atRisk, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Offline', value: stats.offline, icon: WifiOff, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{item.title}</CardTitle>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{item.value}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}