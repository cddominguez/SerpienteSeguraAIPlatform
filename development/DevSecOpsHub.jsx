import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { GitMerge, ShieldCheck, Bug, Box, Rocket, Brain, TrendingUp, AlertTriangle, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDevSecOpsContext } from '../utils/ContextSharingService';
import { InvokeLLM } from "@/api/integrations";

export default function DevSecOpsHub() {
  const { sharedContext, updateContext, correlateEvents } = useDevSecOpsContext();
  const [pipelineAnalysis, setPipelineAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const pipelineStages = [
    { 
      name: 'Code', 
      icon: GitMerge, 
      status: 'secure', 
      issues: 0,
      metrics: { coverage: 95, quality: 88, security: 92 },
      tools: ['SonarQube', 'CodeQL', 'Semgrep'],
      lastScan: '2 minutes ago'
    },
    { 
      name: 'Build', 
      icon: Box, 
      status: 'secure', 
      issues: 0,
      metrics: { success_rate: 98, duration: 3.2, size_mb: 45 },
      tools: ['Docker', 'Buildah', 'Kaniko'],
      lastScan: '5 minutes ago'
    },
    { 
      name: 'Test', 
      icon: Bug, 
      status: 'warning', 
      issues: 2,
      metrics: { coverage: 78, performance: 85, security: 90 },
      tools: ['Jest', 'OWASP ZAP', 'Playwright'],
      lastScan: '1 minute ago'
    },
    { 
      name: 'Deploy', 
      icon: Rocket, 
      status: 'pending', 
      issues: 0,
      metrics: { success_rate: 96, rollback_rate: 4, mttr: 15 },
      tools: ['Kubernetes', 'Helm', 'ArgoCD'],
      lastScan: 'In progress'
    },
  ];

  const securityTrends = [
    { date: 'Mon', vulnerabilities: 12, resolved: 10, critical: 2 },
    { date: 'Tue', vulnerabilities: 8, resolved: 15, critical: 1 },
    { date: 'Wed', vulnerabilities: 15, resolved: 12, critical: 3 },
    { date: 'Thu', vulnerabilities: 6, resolved: 18, critical: 0 },
    { date: 'Fri', vulnerabilities: 9, resolved: 8, critical: 1 },
  ];

  const complianceData = [
    { name: 'GDPR', value: 95, color: '#10b981' },
    { name: 'SOC2', value: 88, color: '#3b82f6' },
    { name: 'PCI-DSS', value: 92, color: '#8b5cf6' },
    { name: 'HIPAA', value: 85, color: '#f59e0b' },
  ];

  useEffect(() => {
    // Update context with pipeline status
    updateContext('UPDATE_DEPLOYMENTS', pipelineStages);
  }, []);

  const getStatusColor = (status) => ({
    secure: 'text-green-500 bg-green-100',
    warning: 'text-yellow-500 bg-yellow-100',
    error: 'text-red-500 bg-red-100',
    pending: 'text-slate-500 bg-slate-100',
  }[status]);

  const analyzePipelineStage = async (stage) => {
    setSelectedStage(stage);
    setIsAnalyzing(true);
    
    try {
      const analysis = await InvokeLLM({
        prompt: `Provide detailed DevSecOps analysis for the ${stage.name} stage:

Stage Data:
- Status: ${stage.status}
- Issues: ${stage.issues}
- Metrics: ${JSON.stringify(stage.metrics)}
- Tools: ${stage.tools.join(', ')}
- Last Scan: ${stage.lastScan}

Shared Context:
- Active Threats: ${sharedContext.activeThreats.length}
- Recent Vulnerabilities: ${sharedContext.vulnerabilityFindings.length}
- Deployment Risk: Based on recent activity

Provide comprehensive analysis including:
1. Current security posture
2. Performance optimization opportunities  
3. Risk assessment and mitigation
4. Tool effectiveness analysis
5. Specific recommendations for DevSecOps specialists`,
        response_json_schema: {
          type: "object",
          properties: {
            security_posture: {
              type: "object",
              properties: {
                score: { type: "number" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } }
              }
            },
            performance_analysis: {
              type: "object", 
              properties: {
                efficiency_score: { type: "number" },
                bottlenecks: { type: "array", items: { type: "string" } },
                optimization_opportunities: { type: "array", items: { type: "string" } }
              }
            },
            risk_assessment: {
              type: "object",
              properties: {
                risk_level: { type: "string" },
                critical_risks: { type: "array", items: { type: "string" } },
                mitigation_strategies: { type: "array", items: { type: "string" } }
              }
            },
            tool_analysis: {
              type: "object",
              properties: {
                effectiveness: { type: "number" },
                coverage_gaps: { type: "array", items: { type: "string" } },
                recommended_additions: { type: "array", items: { type: "string" } }
              }
            },
            specialist_recommendations: {
              type: "array",
              items: {
                type: "object", 
                properties: {
                  category: { type: "string" },
                  priority: { type: "string" },
                  action: { type: "string" },
                  expected_impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      setPipelineAnalysis(analysis);
      
      // Correlate with other events
      await correlateEvents([
        { type: 'pipeline_analysis', stage: stage.name, findings: analysis }
      ]);
      
    } catch (error) {
      console.error('Pipeline analysis failed:', error);
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-blue-600" />
            Advanced DevSecOps Pipeline
          </CardTitle>
          <CardDescription>AI-enhanced security integrated CI/CD with context correlation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {pipelineStages.map((stage, index) => (
              <motion.div 
                key={stage.name}
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => analyzePipelineStage(stage)}
              >
                <Card className={`transition-all duration-300 hover:shadow-lg ${selectedStage?.name === stage.name ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(stage.status)}`}>
                        <stage.icon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-slate-900">{stage.name}</p>
                        <p className="text-sm text-slate-500">{stage.issues} issues</p>
                        <p className="text-xs text-slate-400">{stage.lastScan}</p>
                      </div>
                      
                      {/* Stage Metrics */}
                      <div className="w-full space-y-1">
                        {Object.entries(stage.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-slate-600 capitalize">{key.replace('_', ' ')}</span>
                            <span className="font-medium">
                              {typeof value === 'number' && value <= 100 ? `${value}%` : value}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Tools Used */}
                      <div className="flex flex-wrap gap-1 justify-center">
                        {stage.tools.map(tool => (
                          <Badge key={tool} variant="outline" className="text-xs px-1 py-0">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pipeline Analysis Results */}
          {pipelineAnalysis && selectedStage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    AI Analysis: {selectedStage.name} Stage
                    {isAnalyzing && <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="security" className="w-full">
                    <TabsList>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                      <TabsTrigger value="tools">Tools</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="security" className="space-y-4 mt-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {pipelineAnalysis.security_posture?.score || 0}%
                          </div>
                          <p className="text-sm text-slate-600">Security Score</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            {pipelineAnalysis.security_posture?.strengths?.map((strength, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
                          <ul className="text-sm space-y-1">
                            {pipelineAnalysis.security_posture?.weaknesses?.map((weakness, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4 mt-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold">Efficiency Score: {pipelineAnalysis.performance_analysis?.efficiency_score || 0}%</span>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-semibold text-slate-700">Bottlenecks</h5>
                            {pipelineAnalysis.performance_analysis?.bottlenecks?.map((bottleneck, i) => (
                              <p key={i} className="text-sm text-slate-600 bg-yellow-50 p-2 rounded">{bottleneck}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-700 mb-2">Optimization Opportunities</h5>
                          {pipelineAnalysis.performance_analysis?.optimization_opportunities?.map((opp, i) => (
                            <p key={i} className="text-sm text-slate-600 bg-green-50 p-2 rounded mb-2">{opp}</p>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="risk" className="space-y-4 mt-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-red-600" />
                          <span className="font-semibold">Risk Level: {pipelineAnalysis.risk_assessment?.risk_level || 'Unknown'}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-red-700 mb-2">Critical Risks</h5>
                            {pipelineAnalysis.risk_assessment?.critical_risks?.map((risk, i) => (
                              <p key={i} className="text-sm text-slate-700 bg-red-50 p-2 rounded mb-1">{risk}</p>
                            ))}
                          </div>
                          <div>
                            <h5 className="font-semibold text-blue-700 mb-2">Mitigation Strategies</h5>
                            {pipelineAnalysis.risk_assessment?.mitigation_strategies?.map((strategy, i) => (
                              <p key={i} className="text-sm text-slate-700 bg-blue-50 p-2 rounded mb-1">{strategy}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tools" className="space-y-4 mt-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {pipelineAnalysis.tool_analysis?.effectiveness || 0}%
                          </div>
                          <p className="text-sm text-slate-600">Tool Effectiveness</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-orange-700 mb-2">Coverage Gaps</h5>
                          {pipelineAnalysis.tool_analysis?.coverage_gaps?.map((gap, i) => (
                            <p key={i} className="text-sm text-slate-600 bg-orange-50 p-2 rounded mb-1">{gap}</p>
                          ))}
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">Recommended Additions</h5>
                          {pipelineAnalysis.tool_analysis?.recommended_additions?.map((addition, i) => (
                            <p key={i} className="text-sm text-slate-600 bg-green-50 p-2 rounded mb-1">{addition}</p>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        {pipelineAnalysis.specialist_recommendations?.map((rec, i) => (
                          <div key={i} className="border rounded-lg p-4 bg-slate-50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-slate-900">{rec.category}</span>
                              <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-slate-700 mb-2">{rec.action}</p>
                            <p className="text-sm text-slate-600 bg-blue-50 p-2 rounded">
                              Expected Impact: {rec.expected_impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs defaultValue="trends" className="w-full">
            <TabsList>
              <TabsTrigger value="trends">Security Trends</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
              <TabsTrigger value="context">Shared Context</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Trends (Last 5 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={securityTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="vulnerabilities" stroke="#ef4444" name="New Vulnerabilities" />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
                      <Line type="monotone" dataKey="critical" stroke="#f59e0b" name="Critical" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Framework Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {complianceData.map((framework) => (
                      <div key={framework.name} className="text-center">
                        <div className="mb-2">
                          <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: framework.color }}
                          >
                            {framework.value}%
                          </div>
                        </div>
                        <p className="font-medium">{framework.name}</p>
                        <Progress value={framework.value} className="mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="context" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Shared Security Context
                  </CardTitle>
                  <CardDescription>Real-time correlation across all security domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800">Active Threats</h4>
                      <p className="text-2xl font-bold text-red-600">{sharedContext.activeThreats.length}</p>
                      <p className="text-sm text-red-700">Requiring attention</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Ongoing Deployments</h4>
                      <p className="text-2xl font-bold text-blue-600">{sharedContext.ongoingDeployments.length}</p>
                      <p className="text-sm text-blue-700">In pipeline</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800">Vulnerabilities</h4>
                      <p className="text-2xl font-bold text-orange-600">{sharedContext.vulnerabilityFindings.length}</p>
                      <p className="text-sm text-orange-700">Unresolved</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Correlated Events</h4>
                      <p className="text-2xl font-bold text-purple-600">{sharedContext.correlatedEvents.length}</p>
                      <p className="text-sm text-purple-700">AI identified</p>
                    </div>
                  </div>
                  
                  {sharedContext.correlatedEvents.length > 0 && (
                    <div className="mt-6">
                      <h5 className="font-semibold mb-3">Recent Correlations</h5>
                      <div className="space-y-2">
                        {sharedContext.correlatedEvents.slice(0, 5).map((event, i) => (
                          <div key={i} className="bg-slate-50 p-3 rounded border-l-4 border-blue-500">
                            <p className="text-sm font-medium">{event.correlation_type}</p>
                            <p className="text-xs text-slate-600">{event.description}</p>
                            <Badge variant="outline" className="mt-1">
                              Confidence: {event.confidence}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}