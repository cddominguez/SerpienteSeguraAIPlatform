
import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { DataInventory } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database, Search, Shield, MapPin, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function DataGovernanceCenter({ dataInventory = [], profile, isLoading, refreshData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryResults, setDiscoveryResults] = useState(null);

  const runDataDiscovery = async () => {
    if (!profile) {
      console.error("Compliance profile is not available to run data discovery.");
      return;
    }
    setIsDiscovering(true);
    try {
      const response = await InvokeLLM({
        prompt: `Perform an AI-powered data discovery and classification for ${profile.organization_name} in the ${profile.industry} industry.

Current Data Inventory: ${JSON.stringify(dataInventory.slice(0, 10))}
Applicable Frameworks: ${JSON.stringify(profile.applicable_frameworks)}

Identify:
1. Potential unclassified sensitive data sources
2. Data retention and minimization opportunities
3. Encryption compliance gaps
4. Cross-border data transfer risks
5. GDPR/CCPA compliance status for each data type`,
        response_json_schema: {
          type: "object",
          properties: {
            discovered_sources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source_name: { type: "string" },
                  data_types: { type: "array", items: { type: "string" } },
                  sensitivity: { type: "string" },
                  compliance_status: { type: "string" }
                }
              }
            },
            retention_opportunities: { type: "array", items: { type: "string" } },
            encryption_gaps: { type: "array", items: { type: "string" } },
            transfer_risks: { type: "array", items: { type: "string" } },
            compliance_summary: { type: "string" }
          }
        }
      });
      setDiscoveryResults(response);
    } catch (error) {
      console.error("Error running data discovery:", error);
    }
    setIsDiscovering(false);
  };

  const filteredInventory = (dataInventory || []).filter(item =>
    item.data_source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sensitivityData = (dataInventory || []).reduce((acc, item) => {
    const existing = acc.find(entry => entry.name === item.sensitivity_level);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.sensitivity_level, value: 1 });
    }
    return acc;
  }, []);

  const getSensitivityColor = (level) => ({
    'public': 'bg-green-100 text-green-800',
    'internal': 'bg-blue-100 text-blue-800',
    'confidential': 'bg-amber-100 text-amber-800',
    'restricted': 'bg-red-100 text-red-800'
  }[level]);

  const getEncryptionColor = (status) => ({
    'encrypted': 'bg-green-100 text-green-800',
    'partially_encrypted': 'bg-amber-100 text-amber-800',
    'not_encrypted': 'bg-red-100 text-red-800'
  }[status]);

  return (
    <div className="space-y-8">
      {/* AI Data Discovery */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            AI-Powered Data Discovery & Classification
          </CardTitle>
          <Button onClick={runDataDiscovery} disabled={isDiscovering || !profile}>
            {isDiscovering ? 'Discovering...' : 'Run Discovery Scan'}
          </Button>
        </CardHeader>
        <CardContent>
          {discoveryResults && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-slate-900 mb-2">Compliance Summary</h3>
                <p className="text-slate-700">{discoveryResults.compliance_summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Discovered Data Sources</h3>
                  <div className="space-y-2">
                    {discoveryResults.discovered_sources.map((source, index) => (
                      <div key={index} className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-900">{source.source_name}</span>
                          <Badge className={getSensitivityColor(source.sensitivity)}>
                            {source.sensitivity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          Data Types: {source.data_types.join(', ')}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {source.compliance_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Compliance Recommendations</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Retention Optimization</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {discoveryResults.retention_opportunities.map((opp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Clock className="w-3 h-3 text-amber-500 mt-1" />
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Encryption Gaps</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {discoveryResults.encryption_gaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Shield className="w-3 h-3 text-red-500 mt-1" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Data Inventory Overview */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">Data Inventory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search data sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredInventory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{item.data_source}</h3>
                      <div className="flex gap-2">
                        <Badge className={getSensitivityColor(item.sensitivity_level)}>
                          {item.sensitivity_level}
                        </Badge>
                        <Badge className={getEncryptionColor(item.encryption_status)}>
                          {item.encryption_status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>Category: <span className="font-medium">{item.data_category.toUpperCase()}</span></div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.retention_period} days retention
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.compliance_tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Data Sensitivity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sensitivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sensitivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
