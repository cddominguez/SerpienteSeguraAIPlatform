import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function SystemStatus() {
  const services = [
    { name: 'AI Prediction Engine', status: 'operational' },
    { name: 'Firewall Service', status: 'operational' },
    { name: "Endpoint Protection", status: 'operational' },
    { name: 'Threat Intelligence Feed', status: 'degraded' },
    { name: 'Log Ingestion', status: 'operational' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'degraded':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.name} className="flex items-center justify-between">
              <span className="text-slate-700">{service.name}</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className="font-medium text-slate-600 capitalize">{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}