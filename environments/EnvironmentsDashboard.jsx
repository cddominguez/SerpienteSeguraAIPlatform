import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch, Shield, Activity, BarChart, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnvironmentsDashboard({ deployments = [], doraMetrics = [], isLoading }) {
  const latestMetrics = doraMetrics[0] || {};
  const failedDeployments = deployments.filter(d => d.status === 'failed').length;
  const successfulDeployments = deployments.filter(d => d.status === 'success').length;

  const stats = [
    { title: 'Deployment Frequency', value: latestMetrics.deployment_frequency?.toFixed(2) || 'N/A', unit: '/day', icon: GitBranch },
    { title: 'Lead Time for Changes', value: latestMetrics.lead_time_minutes?.toFixed(0) || 'N/A', unit: 'min', icon: Clock },
    { title: 'Change Failure Rate', value: latestMetrics.change_failure_rate_percent?.toFixed(2) || 'N/A', unit: '%', icon: AlertTriangle },
    { title: 'Time to Restore Service', value: latestMetrics.mttr_minutes?.toFixed(0) || 'N/A', unit: 'min', icon: Activity },
    { title: 'Successful Deployments', value: successfulDeployments, icon: CheckCircle },
    { title: 'Failed Deployments', value: failedDeployments, icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((item, index) => (
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
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">
                  {item.value}
                  {item.unit && <span className="text-xl font-medium text-slate-500 ml-1">{item.unit}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}