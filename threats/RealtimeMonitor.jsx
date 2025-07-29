import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RealtimeMonitor({ securityEvents, isLoading }) {
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    setLiveEvents(securityEvents.slice(0, 10));
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newEvent = {
          id: Date.now(),
          event_type: ['login_attempt', 'file_access', 'network_connection'][Math.floor(Math.random() * 3)],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          source_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          description: 'Simulated real-time security event',
          created_date: new Date().toISOString()
        };
        setLiveEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [securityEvents]);

  const getEventIcon = (type) => ({
    login_attempt: Shield,
    file_access: CheckCircle,
    network_connection: Activity,
    system_change: AlertCircle
  }[type] || Activity);

  const getSeverityColor = (severity) => ({
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800'
  }[severity] || 'bg-slate-100 text-slate-800');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
          Real-time Security Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {liveEvents.map((event) => {
              const EventIcon = getEventIcon(event.event_type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <EventIcon className="w-5 h-5 text-slate-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 capitalize">{event.event_type.replace('_', ' ')}</p>
                    <p className="text-sm text-slate-500">{event.source_ip} • {event.description}</p>
                  </div>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(event.created_date).toLocaleTimeString()}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}