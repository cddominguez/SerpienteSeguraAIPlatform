import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Eye, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

export default function ThreatList({ threats, isLoading, selectedThreat, setSelectedThreat }) {
  const getSeverityColor = (severity) => ({
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  }[severity] || "bg-slate-100 text-slate-800 border-slate-200");

  const getStatusIcon = (status) => ({
    active: AlertTriangle,
    blocked: Shield,
    resolved: Eye,
    investigating: Clock
  }[status] || AlertTriangle);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">
          Active Threats ({threats.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[600px] overflow-y-auto pr-2">
        <div className="space-y-3">
          <AnimatePresence>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : (
              threats.map((threat) => {
                const StatusIcon = getStatusIcon(threat.status);
                return (
                  <motion.div
                    key={threat.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedThreat(threat)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedThreat?.id === threat.id 
                        ? 'bg-emerald-50 border-emerald-500 shadow-lg' 
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <StatusIcon className="w-5 h-5 text-slate-500 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{threat.title}</h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{threat.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge variant="outline">{threat.type}</Badge>
                          <span className="text-xs text-slate-400">
                            {format(new Date(threat.created_date), 'MMM d, HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}