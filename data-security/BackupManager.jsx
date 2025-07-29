import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Plus, CheckCircle, AlertCircle, Clock, RotateCw } from 'lucide-react';
import { format } from 'date-fns';

export default function BackupManager({ backupJobs, isLoading }) {
  const getStatusInfo = (status) => ({
    completed: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-800" },
    in_progress: { icon: RotateCw, color: "bg-blue-100 text-blue-800", animate: true },
    failed: { icon: AlertCircle, color: "bg-red-100 text-red-800" },
    pending: { icon: Clock, color: "bg-slate-100 text-slate-800" },
  }[status] || { icon: Clock, color: "bg-slate-100 text-slate-800" });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Backup Manager
        </CardTitle>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Backup Job</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : (
            backupJobs.slice(0, 5).map(job => {
              const statusInfo = getStatusInfo(job.status);
              const StatusIcon = statusInfo.icon;
              return (
                <div key={job.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${statusInfo.color.split(' ')[1]} ${statusInfo.animate ? 'animate-spin' : ''}`} />
                    <div>
                      <p className="font-semibold text-slate-800">{job.device_name}</p>
                      <p className="text-xs text-slate-500">{format(new Date(job.created_date), 'PP p')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{job.backup_type}</Badge>
                    <Badge variant="secondary">{job.size_gb} GB</Badge>
                    <Badge className={statusInfo.color}>{job.status}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}