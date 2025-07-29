import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, ShieldCheck, Ban, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function NetworkStats({ rules }) {
  const stats = {
    totalRules: rules.length,
    enabledRules: rules.filter(r => r.is_enabled).length,
    blockedRules: rules.filter(r => r.action === 'block' && r.is_enabled).length,
    activeConnections: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000 // Simulated
  };

  const statItems = [
    { title: "Firewall Rules", value: stats.totalRules, icon: Wifi },
    { title: "Enabled Rules", value: stats.enabledRules, icon: ShieldCheck },
    { title: "Active Block Rules", value: stats.blockedRules, icon: Ban },
    { title: "Active Connections", value: stats.activeConnections.toLocaleString(), icon: Zap }
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
              <item.icon className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{item.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}