import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

export default function DeploymentHistoryTable({ deployments, isLoading }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success': return <Badge className="bg-emerald-500 text-white">Success</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500 text-white animate-pulse">In Progress</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Deployment History</CardTitle>
        <CardDescription>Recent deployments across all environments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commit</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deployments.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.service_name}</TableCell>
                <TableCell>{d.environment}</TableCell>
                <TableCell>{getStatusBadge(d.status)}</TableCell>
                <TableCell className="font-mono text-xs">{d.commit_hash?.substring(0, 7)}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(d.start_time), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}