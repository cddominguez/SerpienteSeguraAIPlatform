import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Eye, Clock, ShieldAlert, Code } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ExplainableAIDecision from './ExplainableAIDecision';

export default function AIActionAuditLog({ auditLogs = [], isLoading = false }) {
  const [selectedLog, setSelectedLog] = useState(null);

  const getActionColor = (action) => {
    if (action.includes('block') || action.includes('isolate')) return "bg-red-100 text-red-800";
    if (action.includes('flag') || action.includes('alert')) return "bg-yellow-100 text-yellow-800";
    if (action.includes('resolve') || action.includes('allow')) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          AI Action Audit Trail
        </CardTitle>
        <CardDescription>
          A transparent, immutable log of all automated actions taken by the security AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Explanation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge className={getActionColor(log.action_taken)}>
                      {log.action_taken.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.target}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(100, ${log.confidence_score}%, 40%)` }}></div>
                      <span>{log.confidence_score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(log.created_date), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>AI Decision Explanation</DialogTitle>
                        </DialogHeader>
                        {selectedLog && <ExplainableAIDecision auditLog={selectedLog} onFeedback={() => {}} />}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {auditLogs.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">No AI Actions Logged</h3>
              <p className="text-slate-500">Automated actions taken by the AI will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}