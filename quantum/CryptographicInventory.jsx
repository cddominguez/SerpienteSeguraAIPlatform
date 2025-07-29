import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, Lock, Key, FileText, Download } from 'lucide-react';

export default function CryptographicInventory({ threats = [], isLoading = false }) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  const getVulnerabilityColor = (vulnerability) => {
    switch (vulnerability) {
      case 'immediate': return 'bg-red-500 text-white';
      case 'near_term': return 'bg-orange-500 text-white';
      case 'long_term': return 'bg-yellow-500 text-white';
      case 'quantum_safe': return 'bg-green-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  // Ensure threats is always an array
  const safeThreats = Array.isArray(threats) ? threats : [];

  const algorithmStats = {
    total: safeThreats.length,
    immediate_risk: safeThreats.filter(t => t.quantum_vulnerability === 'immediate').length,
    near_term_risk: safeThreats.filter(t => t.quantum_vulnerability === 'near_term').length,
    quantum_safe: safeThreats.filter(t => t.quantum_vulnerability === 'quantum_safe').length
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Cryptographic Algorithm Inventory
              </CardTitle>
              <CardDescription>
                Comprehensive assessment of all cryptographic algorithms in use across your infrastructure
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-600">Total Algorithms</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{algorithmStats.total}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-slate-600">Immediate Risk</span>
              </div>
              <div className="text-3xl font-bold text-red-600">{algorithmStats.immediate_risk}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-slate-600">Near-term Risk</span>
              </div>
              <div className="text-3xl font-bold text-orange-600">{algorithmStats.near_term_risk}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-600">Quantum Safe</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{algorithmStats.quantum_safe}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Key Size</TableHead>
                  <TableHead>Quantum Vulnerability</TableHead>
                  <TableHead>Migration Priority</TableHead>
                  <TableHead>Affected Systems</TableHead>
                  <TableHead>Est. Migration Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeThreats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      {isLoading ? 'Loading cryptographic inventory...' : 'No cryptographic algorithms found. Click "Scan Infrastructure" to discover algorithms.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  safeThreats.map((threat) => (
                    <TableRow key={threat.id}>
                      <TableCell>
                        <div className="font-medium">{threat.algorithm_type?.toUpperCase() || 'Unknown'}</div>
                        <div className="text-sm text-slate-500">Industry Standard</div>
                      </TableCell>
                      <TableCell className="font-mono">{threat.key_size || 'N/A'} bits</TableCell>
                      <TableCell>
                        <Badge className={getVulnerabilityColor(threat.quantum_vulnerability)}>
                          {threat.quantum_vulnerability?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(threat.migration_priority)}>
                          {threat.migration_priority || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {threat.affected_systems?.length || 0} systems
                        </div>
                        {threat.affected_systems?.slice(0, 2).map((system, i) => (
                          <div key={i} className="text-xs text-slate-500">{system}</div>
                        )) || <div className="text-xs text-slate-500">No systems listed</div>}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${threat.estimated_migration_cost?.toLocaleString() || '0'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}