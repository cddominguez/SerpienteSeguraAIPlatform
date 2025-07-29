import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Siren, ShieldBan, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const generateLogEntry = () => {
    const eventTypes = ['Potential SQL Injection', 'Anomalous Port Scan', 'Malware Signature Detected', 'Connection to C&C Server', 'Data Exfiltration Pattern'];
    const actions = ['Blocked', 'Flagged', 'Allowed'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];
    
    return {
        id: Date.now() + Math.random(),
        time: new Date(),
        description: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
    };
};

export default function IDSLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(Array.from({ length: 10 }, generateLogEntry));
    const interval = setInterval(() => {
      setLogs(prev => [generateLogEntry(), ...prev.slice(0, 14)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => ({
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800'
  }[severity]);

  const getActionIcon = (action) => {
      if (action === 'Blocked') return <ShieldBan className="w-4 h-4 text-red-600" />;
      if (action === 'Flagged') return <Siren className="w-4 h-4 text-yellow-600" />;
      return <ShieldCheck className="w-4 h-4 text-green-600" />;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Siren className="w-5 h-5 text-orange-600" />
          Intrusion Detection Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-2 border-b border-slate-100"
              >
                {getActionIcon(log.action)}
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800">{log.description}</p>
                  <p className="text-xs text-slate-500">
                    {log.ip} &bull; {log.time.toLocaleTimeString()}
                  </p>
                </div>
                <Badge className={`${getSeverityColor(log.severity)} text-xs`}>
                  {log.severity}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}