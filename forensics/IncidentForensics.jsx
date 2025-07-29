import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Clock, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function IncidentForensics({ events, threats }) {
  const [forensicsData, setForensicsData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const runForensicAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Perform digital forensics analysis on security events and threats:

Security Events: ${JSON.stringify(events.slice(0, 20))}
Active Threats: ${JSON.stringify(threats.slice(0, 10))}

Conduct forensics analysis including:
1. Timeline reconstruction
2. Attack vector analysis
3. Evidence collection
4. Attribution analysis
5. Impact assessment
6. Recovery recommendations

Provide detailed forensics findings with evidence chains.`,
        response_json_schema: {
          type: "object",
          properties: {
            incidents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  incident_id: { type: "string" },
                  title: { type: "string" },
                  severity: { type: "string" },
                  timeline: { type: "array", items: { type: "string" } },
                  attack_vector: { type: "string" },
                  evidence: { type: "array", items: { type: "string" } },
                  attribution: { type: "string" },
                  impact_assessment: { type: "string" }
                }
              }
            },
            forensic_summary: {
              type: "object",
              properties: {
                total_incidents: { type: "number" },
                evidence_pieces: { type: "number" },
                attribution_confidence: { type: "number" },
                recovery_time: { type: "string" }
              }
            }
          }
        }
      });
      setForensicsData(response);
      if (response.incidents && response.incidents.length > 0) {
        setSelectedIncident(response.incidents[0]);
      }
    } catch (error) {
      console.error("Error running forensic analysis:", error);
    }
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity) => ({
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }[severity]);

  // Generate timeline chart data
  const timelineData = selectedIncident?.timeline.map((event, index) => ({
    step: index + 1,
    event: event,
    timestamp: new Date(Date.now() - (selectedIncident.timeline.length - index) * 60000).toLocaleTimeString()
  })) || [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600" />
          Incident Forensics
        </CardTitle>
        <Button onClick={runForensicAnalysis} disabled={isAnalyzing} size="sm">
          {isAnalyzing ? 'Analyzing...' : 'Run Forensics'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {forensicsData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Forensics Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-3">Forensics Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Total Incidents:</span>
                  <div className="font-bold text-slate-900">{forensicsData.forensic_summary?.total_incidents || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Evidence Pieces:</span>
                  <div className="font-bold text-indigo-600">{forensicsData.forensic_summary?.evidence_pieces || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Attribution Confidence:</span>
                  <div className="font-bold text-green-600">{forensicsData.forensic_summary?.attribution_confidence || 0}%</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Est. Recovery Time:</span>
                  <div className="font-bold text-amber-600">{forensicsData.forensic_summary?.recovery_time || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Incidents List */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Active Investigations</h4>
              <div className="grid gap-3">
                {forensicsData.incidents?.map((incident, index) => (
                  <div
                    key={incident.incident_id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedIncident?.incident_id === incident.incident_id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">{incident.title}</h5>
                        <p className="text-sm text-slate-600">ID: {incident.incident_id}</p>
                      </div>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Incident Details */}
            {selectedIncident && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Incident Analysis: {selectedIncident.title}</h4>
                <Tabs defaultValue="timeline" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="timeline">
                      <Clock className="w-4 h-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="evidence">
                      <FileText className="w-4 h-4 mr-2" />
                      Evidence
                    </TabsTrigger>
                    <TabsTrigger value="attribution">
                      <Users className="w-4 h-4 mr-2" />
                      Attribution
                    </TabsTrigger>
                    <TabsTrigger value="impact">
                      <Search className="w-4 h-4 mr-2" />
                      Impact
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">Attack Timeline</h5>
                      <div className="space-y-2">
                        {selectedIncident.timeline?.map((event, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-800">{event}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(Date.now() - (selectedIncident.timeline.length - index) * 60000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="evidence" className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">Digital Evidence</h5>
                      <div className="space-y-2">
                        {selectedIncident.evidence?.map((evidence, index) => (
                          <div key={index} className="p-2 bg-white rounded border border-green-200">
                            <p className="text-sm text-slate-800">{evidence}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="attribution" className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h5 className="font-semibold text-purple-900 mb-2">Attribution Analysis</h5>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-purple-800">Attack Vector:</span>
                          <p className="text-purple-700">{selectedIncident.attack_vector}</p>
                        </div>
                        <div>
                          <span className="font-medium text-purple-800">Attribution:</span>
                          <p className="text-purple-700">{selectedIncident.attribution}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="impact" className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h5 className="font-semibold text-amber-900 mb-2">Impact Assessment</h5>
                      <p className="text-amber-800">{selectedIncident.impact_assessment}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <p className="text-slate-600">Running forensic analysis...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}