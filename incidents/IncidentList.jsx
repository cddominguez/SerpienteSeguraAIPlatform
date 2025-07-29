import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { List } from 'lucide-react';

export default function IncidentList({ incidents, isLoading, selectedIncident, setSelectedIncident }) {

  const getPriorityColor = (priority) => ({
    "critical": "bg-red-500 border-red-700",
    "high": "bg-orange-500 border-orange-700",
    "medium": "bg-yellow-500 border-yellow-700",
    "low": "bg-blue-500 border-blue-700",
  }[priority] || 'bg-gray-400');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <List className="w-5 h-5 text-blue-600" />
          Incident Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : (
            incidents.map(incident => (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-4 cursor-pointer border-l-4 transition-colors ${selectedIncident?.id === incident.id ? 'bg-blue-50 border-blue-500' : `border-transparent hover:bg-slate-50`}`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-800 text-sm flex-1 pr-2">{incident.title}</p>
                  <div className={`w-3 h-3 rounded-full mt-1 ${getPriorityColor(incident.priority)}`} title={`Priority: ${incident.priority}`}></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline">{incident.status}</Badge>
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(incident.detection_time), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}