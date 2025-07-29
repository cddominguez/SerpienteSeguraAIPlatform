
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Users, Eye, Shield, AlertTriangle, Bot, Globe, Smartphone, Monitor, Clock, ShieldBan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { RealTimeVisitor } from "@/api/entities";
import { FirewallRule } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

export default function RealTimeVisitorMonitor() {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadVisitors();
    const interval = setInterval(loadVisitors, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadVisitors = async () => {
    const data = await RealTimeVisitor.list('-created_date', 50);
    setVisitors(data);
  };

  const getThreatColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getDeviceIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'tablet': return Smartphone;
      case 'desktop': return Monitor;
      default: return Globe;
    }
  };

  const analyzeVisitor = async (visitor) => {
    setSelectedVisitor(visitor);
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await InvokeLLM({
        prompt: `Analyze this website visitor for potential security threats and behavioral anomalies:

Visitor Data:
- IP: ${visitor.ip_address}
- Location: ${visitor.location?.city}, ${visitor.location?.country}
- Device: ${visitor.device_info?.type} - ${visitor.device_info?.brand} ${visitor.device_info?.model}
- OS: ${visitor.device_info?.os}
- Browser: ${visitor.device_info?.browser}
- User Agent: ${visitor.user_agent}
- Pages Visited: ${visitor.pages_visited?.join(', ')}
- Visit Duration: ${visitor.visit_end ? new Date(visitor.visit_end) - new Date(visitor.visit_start) : 'Ongoing'}
- Referrer: ${visitor.referrer}
- Is Bot: ${visitor.is_bot}
- Current Threat Score: ${visitor.threat_score}

Provide a comprehensive security analysis including threat assessment, behavioral analysis, and recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            threat_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
            confidence_score: { type: "number", minimum: 0, maximum: 100 },
            risk_factors: { type: "array", items: { type: "string" } },
            behavioral_indicators: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            is_likely_bot: { type: "boolean" },
            is_suspicious: { type: "boolean" },
            summary: { type: "string" }
          }
        }
      });
      setAnalysis(response);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
    setIsAnalyzing(false);
  };
  
  const handleBlockAndKick = async (visitor) => {
    if (!visitor) return;
    setIsBlocking(true);
    try {
      await FirewallRule.create({
        name: `Real-time Block: ${visitor.ip_address}`,
        action: 'block',
        direction: 'inbound',
        protocol: 'any',
        source_ip: visitor.ip_address,
        is_enabled: true
      });
      await RealTimeVisitor.update(visitor.id, { is_malicious: true, is_active: false, threat_score: 100 });
      await loadVisitors();
      setSelectedVisitor(null);
      setAnalysis(null);
    } catch (error) {
      console.error("Failed to block visitor:", error);
    }
    setIsBlocking(false);
  };

  const activeVisitors = visitors.filter(v => v.is_active);
  const totalThreatScore = visitors.reduce((sum, v) => sum + (v.threat_score || 0), 0);
  const avgThreatScore = visitors.length > 0 ? totalThreatScore / visitors.length : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeVisitors.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Bots</CardTitle>
            <Bot className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {visitors.filter(v => v.is_bot).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Malicious Actors</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {visitors.filter(v => v.is_malicious).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Threat Score</CardTitle>
            <Shield className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getThreatColor(avgThreatScore).split(' ')[0]}`}>
              {avgThreatScore.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor List */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Real-Time Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Threat</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {visitors.slice(0, 10).map((visitor) => {
                        const DeviceIcon = getDeviceIcon(visitor.device_info?.type);
                        return (
                          <motion.tr
                            key={visitor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="border-b border-slate-100"
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-mono text-sm">{visitor.ip_address}</div>
                                <div className="text-xs text-slate-500">
                                  {visitor.fingerprint_hash?.substring(0, 8)}...
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">{visitor.location?.city}</div>
                                <div className="text-xs text-slate-500">{visitor.location?.country}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <DeviceIcon className="w-4 h-4" />
                                <div className="space-y-1">
                                  <div className="text-sm">{visitor.device_info?.brand} {visitor.device_info?.model}</div>
                                  <div className="text-xs text-slate-500">{visitor.device_info?.os}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge variant={visitor.is_active ? 'default' : 'secondary'}>
                                  {visitor.is_active ? 'Active' : 'Left'}
                                </Badge>
                                {visitor.is_bot && <Badge variant="outline">Bot</Badge>}
                                {visitor.is_malicious && <Badge variant="destructive">Malicious</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getThreatColor(visitor.threat_score || 0)}>
                                {visitor.threat_score || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => analyzeVisitor(visitor)}
                                disabled={isAnalyzing && selectedVisitor?.id === visitor.id}
                              >
                                {isAnalyzing && selectedVisitor?.id === visitor.id ? 'Analyzing...' : 'Analyze'}
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                AI Security Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedVisitor && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Select a visitor to analyze</p>
                </div>
              )}

              {selectedVisitor && !analysis && !isAnalyzing && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Visitor Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>IP:</strong> {selectedVisitor.ip_address}</div>
                    <div><strong>Location:</strong> {selectedVisitor.location?.city}, {selectedVisitor.location?.country}</div>
                    <div><strong>Device:</strong> {selectedVisitor.device_info?.brand} {selectedVisitor.device_info?.model}</div>
                    <div><strong>OS:</strong> {selectedVisitor.device_info?.os}</div>
                    <div><strong>Browser:</strong> {selectedVisitor.device_info?.browser}</div>
                    <div><strong>Pages:</strong> {selectedVisitor.pages_visited?.length || 0}</div>
                    <div><strong>Duration:</strong> {
                      selectedVisitor.visit_end 
                        ? `${Math.round((new Date(selectedVisitor.visit_end) - new Date(selectedVisitor.visit_start)) / 1000)}s`
                        : 'Ongoing'
                    }</div>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-sm">AI analyzing visitor behavior...</span>
                  </div>
                </div>
              )}

              {analysis && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Threat Level</span>
                      <Badge className={
                        analysis.threat_level === 'critical' ? 'bg-red-500 text-white' :
                        analysis.threat_level === 'high' ? 'bg-orange-500 text-white' :
                        analysis.threat_level === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }>
                        {analysis.threat_level}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      Confidence: {analysis.confidence_score}%
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2">Summary</h5>
                    <p className="text-sm text-slate-700">{analysis.summary}</p>
                  </div>

                  {analysis.risk_factors?.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2">Risk Factors</h5>
                      <ul className="text-sm space-y-1">
                        {analysis.risk_factors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.recommendations?.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2">Recommendations</h5>
                      <ul className="text-sm space-y-1">
                        {analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Shield className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(analysis.threat_level === 'high' || analysis.threat_level === 'critical') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-center sm:text-left">
                                <h5 className="font-bold text-red-800">High-Risk Visitor Detected</h5>
                                <p className="text-sm text-red-700">Immediate action recommended.</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => handleBlockAndKick(selectedVisitor)}
                                disabled={isBlocking}
                                className="w-full sm:w-auto flex-shrink-0"
                            >
                                <ShieldBan className="w-4 h-4 mr-2" />
                                {isBlocking ? 'Blocking...' : 'Block & Kick IP'}
                            </Button>
                        </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Geographic Map */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-600" />
            Visitor Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {visitors.map(visitor => {
                if (!visitor.location?.lat || !visitor.location?.lon) return null;
                return (
                  <Marker 
                    key={visitor.id} 
                    position={[visitor.location.lat, visitor.location.lon]}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <div><strong>IP:</strong> {visitor.ip_address}</div>
                        <div><strong>Location:</strong> {visitor.location.city}, {visitor.location.country}</div>
                        <div><strong>Device:</strong> {visitor.device_info?.type}</div>
                        <div><strong>Threat Score:</strong> {visitor.threat_score || 0}</div>
                        <div><strong>Status:</strong> {visitor.is_active ? 'Active' : 'Left'}</div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
