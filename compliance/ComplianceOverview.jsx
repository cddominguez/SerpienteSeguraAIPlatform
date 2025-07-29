import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, FileCheck, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComplianceOverview({ frameworks = [], controls = [], auditLogs = [], isLoading = false }) {
  const stats = {
    totalFrameworks: frameworks.length,
    compliantFrameworks: frameworks.filter(f => f.status === 'compliant').length,
    implementedControls: controls.filter(c => c.implementation_status === 'implemented').length,
    totalControls: controls.length,
    recentAudits: auditLogs.filter(log => 
      new Date(log.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    complianceScore: frameworks.length > 0 ? 
      Math.round(frameworks.reduce((sum, f) => sum + f.compliance_score, 0) / frameworks.length) : 0
  };

  const statItems = [
    { 
      title: 'Compliance Score', 
      value: `${stats.complianceScore}%`, 
      icon: Shield, 
      color: stats.complianceScore > 90 ? 'text-emerald-600' : stats.complianceScore > 70 ? 'text-amber-600' : 'text-red-600',
      bg: stats.complianceScore > 90 ? 'bg-emerald-100' : stats.complianceScore > 70 ? 'bg-amber-100' : 'bg-red-100'
    },
    { 
      title: 'Active Frameworks', 
      value: stats.totalFrameworks, 
      icon: FileCheck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      subtitle: `${stats.compliantFrameworks} compliant`
    },
    { 
      title: 'Security Controls', 
      value: `${stats.implementedControls}/${stats.totalControls}`, 
      icon: CheckCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      subtitle: 'Implemented'
    },
    { 
      title: 'Recent Audits', 
      value: stats.recentAudits, 
      icon: Clock, 
      color: 'text-teal-600', 
      bg: 'bg-teal-100',
      subtitle: 'Last 7 days'
    },
    { 
      title: 'Risk Level', 
      value: stats.complianceScore > 90 ? 'Low' : stats.complianceScore > 70 ? 'Medium' : 'High', 
      icon: AlertTriangle, 
      color: stats.complianceScore > 90 ? 'text-emerald-600' : stats.complianceScore > 70 ? 'text-amber-600' : 'text-red-600',
      bg: stats.complianceScore > 90 ? 'bg-emerald-100' : stats.complianceScore > 70 ? 'bg-amber-100' : 'bg-red-100'
    },
    { 
      title: 'Trend', 
      value: '+5.2%', 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100',
      subtitle: 'vs last month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}