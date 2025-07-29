import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { differenceInHours, differenceInMinutes } from 'date-fns';

export default function IncidentStats({ incidents }) {
    const openIncidents = incidents.filter(i => i.status !== 'closed');
    const criticalIncidents = openIncidents.filter(i => i.priority === 'critical');
    
    let totalMinutes = 0;
    const resolvedIncidents = incidents.filter(i => i.status === 'closed' && i.resolution_time);
    if(resolvedIncidents.length > 0){
        resolvedIncidents.forEach(i => {
            totalMinutes += differenceInMinutes(new Date(i.resolution_time), new Date(i.detection_time));
        });
    }
    const avgResolutionTime = resolvedIncidents.length > 0 
        ? (totalMinutes / resolvedIncidents.length / 60).toFixed(1)
        : 0;

    const stats = [
        { title: 'Open Incidents', value: openIncidents.length, icon: AlertTriangle, color: "text-orange-500" },
        { title: 'Critical Priority', value: criticalIncidents.length, icon: ShieldCheck, color: "text-red-500" },
        { title: 'Avg. Resolution (Hours)', value: avgResolutionTime, icon: Clock, color: "text-blue-500" },
        { title: 'Total Closed', value: resolvedIncidents.length, icon: CheckCircle, color: "text-emerald-500" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
                <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}