import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Activity, Clock } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function HuntingDashboard({ 
  threats = [], 
  userActivity = [], 
  devices = [], 
  activeInvestigation,
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-12 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Active Threats',
      value: threats.filter(t => t.status === 'active').length,
      total: threats.length,
      icon: Target,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      title: 'User Activities',
      value: userActivity.filter(a => a.is_anomaly).length,
      total: userActivity.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Device Anomalies',
      value: devices.filter(d => d.status === 'at_risk' || d.status === 'compromised').length,
      total: devices.length,
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
    {
      title: 'Investigation Status',
      value: activeInvestigation ? 'Active' : 'None',
      total: activeInvestigation ? activeInvestigation.name : 'Start hunting',
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
            {typeof stat.total === 'number' && (
              <>
                <p className="text-xs text-slate-500 mb-2">of {stat.total} total</p>
                <Progress value={(stat.value / stat.total) * 100} className="h-2" />
              </>
            )}
            {typeof stat.total === 'string' && (
              <p className="text-sm text-slate-600">{stat.total}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}