import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function AuditTrail({ auditLogs, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const eventTypes = ['all', 'access_attempt', 'data_modification', 'system_change', 'compliance_check', 'security_incident'];

  const filteredLogs = auditLogs.filter(log => {
    const searchMatch = searchTerm === '' || 
      log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const typeMatch = filterType === 'all' || log.event_type === filterType;
    
    return searchMatch && typeMatch;
  });

  const getResultColor = (result) => ({
    'success': 'bg-green-100 text-green-800',
    'failure': 'bg-red-100 text-red-800',
    'partial': 'bg-yellow-100 text-yellow-800'
  }[result]);

  const getEventTypeIcon = (type) => {
    // Return appropriate icons for different event types
    return '📋';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          Comprehensive Audit Trail
        </CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by user, resource, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getEventTypeIcon(log.event_type)}</span>
                    <span className="font-semibold text-slate-900">{log.action}</span>
                    <Badge variant="outline" className="text-xs">{log.event_type.replace('_', ' ')}</Badge>
                    {log.compliance_relevant && <Badge className="bg-blue-100 text-blue-800 text-xs">Compliance</Badge>}
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>User: <span className="font-medium">{log.user_id}</span> | Resource: <span className="font-medium">{log.resource}</span></div>
                    <div>IP: <span className="font-medium">{log.ip_address}</span> | Time: <span className="font-medium">{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span></div>
                  </div>
                </div>
                <Badge className={getResultColor(log.result)}>
                  {log.result}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}