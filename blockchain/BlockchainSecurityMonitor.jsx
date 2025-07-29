import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hexagon, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function BlockchainSecurityMonitor() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);

  // Sample blockchain security data
  const blockchainMetrics = {
    smartContracts: 147,
    vulnerabilitiesFound: 8,
    gasOptimizations: 23,
    securityScore: 87.3,
    totalValueLocked: '$12.4M'
  };

  const vulnerabilityData = [
    { type: 'Reentrancy', count: 3, severity: 'high' },
    { type: 'Integer Overflow', count: 2, severity: 'medium' },
    { type: 'Access Control', count: 2, severity: 'high' },
    { type: 'Flash Loan', count: 1, severity: 'critical' }
  ];

  const contractData = [
    { name: 'Token Contract', score: 92, vulnerabilities: 1 },
    { name: 'DEX Router', score: 85, vulnerabilities: 3 },
    { name: 'Lending Pool', score: 78, vulnerabilities: 2 },
    { name: 'Governance', score: 95, vulnerabilities: 0 }
  ];

  const runSecurityScan = async () => {
    setIsScanning(true);
    
    // Simulate blockchain security scan
    setTimeout(() => {
      setScanResults({
        contractsScanned: 147,
        newVulnerabilities: 2,
        gasOptimized: 12,
        complianceScore: 94.2,
        riskLevel: 'medium'
      });
      setIsScanning(false);
    }, 3000);
  };

  const getSeverityColor = (severity) => ({
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }[severity]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Hexagon className="w-5 h-5 text-indigo-600" />
          Blockchain Security Monitor
        </CardTitle>
        <Button onClick={runSecurityScan} disabled={isScanning} size="sm">
          {isScanning ? 'Scanning...' : 'Security Scan'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-indigo-700">Smart Contracts</span>
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-900">{blockchainMetrics.smartContracts}</div>
            <div className="text-xs text-indigo-600">Monitored</div>
          </div>
          
          <div className="p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-700">Security Score</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-900">{blockchainMetrics.securityScore}%</div>
            <div className="text-xs text-emerald-600">Overall Rating</div>
          </div>
        </div>

        {/* Vulnerability Distribution */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Vulnerability Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vulnerabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Contract Security Scores */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Smart Contract Analysis</h3>
          <div className="space-y-3">
            {contractData.map((contract, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{contract.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {contract.vulnerabilities} issues
                    </Badge>
                    <span className={`font-bold ${getScoreColor(contract.score)}`}>
                      {contract.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      contract.score >= 90 ? 'bg-green-500' :
                      contract.score >= 75 ? 'bg-blue-500' :
                      contract.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${contract.score}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vulnerability Details */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Active Vulnerabilities
          </h3>
          <div className="space-y-2">
            {vulnerabilityData.filter(v => v.count > 0).map((vuln, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <span className="font-medium text-slate-900">{vuln.type}</span>
                  <div className="text-sm text-slate-600">{vuln.count} instances found</div>
                </div>
                <Badge className={getSeverityColor(vuln.severity)}>
                  {vuln.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Results */}
        {scanResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-slate-50 rounded-lg"
          >
            <h4 className="font-bold text-slate-900 mb-3">Latest Scan Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Contracts Scanned:</span>
                <div className="font-bold">{scanResults.contractsScanned}</div>
              </div>
              <div>
                <span className="text-slate-600">New Vulnerabilities:</span>
                <div className="font-bold text-red-600">{scanResults.newVulnerabilities}</div>
              </div>
              <div>
                <span className="text-slate-600">Gas Optimizations:</span>
                <div className="font-bold text-green-600">{scanResults.gasOptimized}</div>
              </div>
              <div>
                <span className="text-slate-600">Compliance Score:</span>
                <div className="font-bold">{scanResults.complianceScore}%</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm">
            Deploy Patches
          </Button>
          <Button variant="outline" size="sm">
            Gas Optimization
          </Button>
          <Button variant="outline" size="sm">
            Audit Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}