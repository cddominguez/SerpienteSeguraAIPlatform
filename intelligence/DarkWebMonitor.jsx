import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Search, AlertTriangle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DarkWebMonitor() {
  const [monitoring, setMonitoring] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [keywords, setKeywords] = useState(['company', 'breach', 'exploit']);

  const scanDarkWeb = async () => {
    setIsScanning(true);
    try {
      const response = await InvokeLLM({
        prompt: `Simulate dark web monitoring results for cybersecurity intelligence:

Keywords being monitored: ${keywords.join(', ')}

Provide intelligence on:
1. Data breach mentions
2. Exploit sales/discussions
3. Credential leaks
4. Insider threats
5. Company-specific chatter

Generate realistic but simulated findings for security awareness.`,
        response_json_schema: {
          type: "object",
          properties: {
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  threat_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  category: { type: "string" },
                  description: { type: "string" },
                  source_type: { type: "string" },
                  confidence: { type: "number" }
                }
              }
            },
            summary: {
              type: "object",
              properties: {
                total_mentions: { type: "number" },
                critical_alerts: { type: "number" },
                new_threats: { type: "number" },
                credential_leaks: { type: "number" }
              }
            }
          }
        }
      });
      setMonitoring(response);
    } catch (error) {
      console.error("Error scanning dark web:", error);
    }
    setIsScanning(false);
  };

  const getThreatColor = (level) => ({
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }[level]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-slate-600" />
          Dark Web Monitor
        </CardTitle>
        <Button onClick={scanDarkWeb} disabled={isScanning} size="sm">
          {isScanning ? 'Scanning...' : 'Scan Dark Web'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords Management */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Monitoring Keywords</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {keyword}
                <button
                  onClick={() => setKeywords(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setKeywords(prev => [...prev, e.target.value.trim()]);
                  e.target.value = '';
                }
              }}
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Monitoring Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <Globe className="w-5 h-5 text-slate-600 mx-auto mb-1" />
            <p className="text-xs text-slate-800 font-medium">Forums</p>
            <p className="text-xs text-slate-600">247 Monitored</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <Search className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-800 font-medium">Marketplaces</p>
            <p className="text-xs text-blue-600">89 Active</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xs text-amber-800 font-medium">Paste Sites</p>
            <p className="text-xs text-amber-600">156 Scanned</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <Eye className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-800 font-medium">Status</p>
            <p className="text-xs text-green-600">Live</p>
          </div>
        </div>

        {/* Scan Results */}
        {monitoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Summary Dashboard */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-3">Scan Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Total Mentions:</span>
                  <div className="font-bold text-slate-900">{monitoring.summary?.total_mentions || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Critical Alerts:</span>
                  <div className="font-bold text-red-600">{monitoring.summary?.critical_alerts || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">New Threats:</span>
                  <div className="font-bold text-orange-600">{monitoring.summary?.new_threats || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Credential Leaks:</span>
                  <div className="font-bold text-purple-600">{monitoring.summary?.credential_leaks || 0}</div>
                </div>
              </div>
            </div>

            {/* Findings */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Recent Findings</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {monitoring.findings?.map((finding, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900">{finding.title}</h5>
                          <p className="text-sm text-slate-600 mb-1">{finding.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Source: {finding.source_type}</span>
                            <span>•</span>
                            <span>Category: {finding.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getThreatColor(finding.threat_level)}>
                            {finding.threat_level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {finding.confidence}%
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            Configure Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}