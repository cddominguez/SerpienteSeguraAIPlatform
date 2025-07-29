import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Shield, FileWarning, User, Database } from 'lucide-react';
import { format } from 'date-fns';

export default function DLPLog({ dlpEvents, isLoading }) {
  const getSeverityColor = (severity) => ({
    high: "bg-red-100 text-red-800",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-blue-100 text-blue-800",
  }[severity] || "bg-slate-100 text-slate-800");

  const getCategoryIcon = (category) => ({
    financial: '💰', pii: '👤', intellectual_property: '💡', health: '❤️'
  }[category] || '📄');
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileWarning className="w-5 h-5 text-amber-600" />
          Data Loss Prevention (DLP) Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
          ) : (
            dlpEvents.slice(0, 6).map(event => (
              <div key={event.id} className="p-3 border rounded-lg flex items-center gap-4">
                <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                  <span className="text-lg">{getCategoryIcon(event.data_category)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{event.policy_name}</p>
                  <p className="text-xs text-slate-500">
                    Action: <span className="font-medium">{event.action_taken}</span> on data moved to <span className="font-medium">{event.destination}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User className="w-3 h-3" />
                  <span>{event.user_email}</span>
                </div>
                <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}