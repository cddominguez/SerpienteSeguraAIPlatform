import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, FileText, AlertTriangle, Bot, Eye, MousePointer, Keyboard } from 'lucide-react';
import { format } from 'date-fns';
import { VisitorAuditLog } from "@/api/entities";

export default function VisitorAuditTrail() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    const logs = await VisitorAuditLog.list('-created_date', 100);
    setAuditLogs(logs);
    setIsLoading(false);
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'page_view': return Eye;
      case 'suspicious_activity': return AlertTriangle;
      case 'bot_detected': return Bot;
      case 'form_submission': return FileText;
      default: return FileText;
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'suspicious_activity': return 'text-red-600 bg-red-100';
      case 'bot_detected': return 'text-orange-600 bg-orange-100';
      case 'threat_detected': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const filteredLogs = auditLogs.filter(log =>
    log.visitor_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.event_details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.page_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Visitor Audit Trail
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Visitor ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Page URL</TableHead>
                <TableHead>Behavior Metrics</TableHead>
                <TableHead>AI Analysis</TableHead>
                <TableHead>Risk Indicators</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const EventIcon = getEventIcon(log.event_type);
                return (
                  <TableRow key={log.id} className="border-b border-slate-100">
                    <TableCell className="font-mono text-xs">
                      {format(new Date(log.created_date), 'MMM d, HH:mm:ss')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.visitor_id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EventIcon className="w-4 h-4" />
                        <div>
                          <Badge className={getEventColor(log.event_type)}>
                            {log.event_type.replace('_', ' ')}
                          </Badge>
                          <div className="text-xs text-slate-500 mt-1">
                            {log.event_details}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs truncate">
                      {log.page_url}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          <span>{log.mouse_movements || 0} moves</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Keyboard className="w-3 h-3" />
                          <span>{log.keyboard_events || 0} keys</span>
                        </div>
                        <div className="text-slate-500">
                          {log.time_on_page || 0}s on page
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs">
                      <div className="truncate" title={log.ai_analysis}>
                        {log.ai_analysis || 'No analysis available'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.risk_indicators?.length > 0 ? (
                        <div className="space-y-1">
                          {log.risk_indicators.slice(0, 2).map((indicator, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                          {log.risk_indicators.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{log.risk_indicators.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">None detected</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}