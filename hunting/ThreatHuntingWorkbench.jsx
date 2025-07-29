import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Target, Search, Filter, Download, Plus, Eye, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { InvokeLLM } from "@/api/integrations";
import { format } from 'date-fns';

export default function ThreatHuntingWorkbench({ 
  threats = [], 
  userActivity = [], 
  devices = [], 
  isLoading, 
  onCreateInvestigation, 
  activeInvestigation, 
  refreshData 
}) {
  const [huntingResults, setHuntingResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isHunting, setIsHunting] = useState(false);
  const [huntQuery, setHuntQuery] = useState('');
  const [investigationName, setInvestigationName] = useState('');
  const [investigationDescription, setInvestigationDescription] = useState('');

  const executeHunt = async () => {
    if (!huntQuery.trim()) return;
    
    setIsHunting(true);
    try {
      const huntingContext = {
        query: huntQuery,
        available_threats: threats.slice(0, 20),
        available_activities: userActivity.slice(0, 50),
        available_devices: devices.slice(0, 30)
      };

      const results = await InvokeLLM({
        prompt: `Execute a threat hunting query against security data. Analyze the provided data sources and return relevant matches based on the hunting query.

Hunting Query: "${huntQuery}"

Available Data:
${JSON.stringify(huntingContext, null, 2)}

Instructions:
1. Parse the hunting query for IOCs, behavioral patterns, or specific search criteria
2. Search across threats, user activities, and devices for matches
3. Correlate findings and identify potential relationships
4. Provide confidence scores and hunting recommendations
5. Suggest follow-up hunting queries

Return structured results with matched entities and analysis.`,
        response_json_schema: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entity_type: { type: "string", enum: ["threat", "user_activity", "device"] },
                  entity_id: { type: "string" },
                  match_reason: { type: "string" },
                  confidence: { type: "number", minimum: 0, maximum: 100 },
                  risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  summary: { type: "string" }
                }
              }
            },
            correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entities: { type: "array", items: { type: "string" } },
                  correlation_type: { type: "string" },
                  description: { type: "string" },
                  significance: { type: "number", minimum: 0, maximum: 100 }
                }
              }
            },
            hunting_insights: {
              type: "object",
              properties: {
                summary: { type: "string" },
                key_findings: { type: "array", items: { type: "string" } },
                recommended_actions: { type: "array", items: { type: "string" } },
                follow_up_queries: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      setHuntingResults(results);
    } catch (error) {
      console.error('Error executing hunt:', error);
    }
    setIsHunting(false);
  };

  const createInvestigation = () => {
    if (!investigationName.trim()) return;
    
    const investigation = onCreateInvestigation(investigationName, investigationDescription);
    setInvestigationName('');
    setInvestigationDescription('');
    return investigation;
  };

  const toggleItemSelection = (entityType, entityId) => {
    const itemKey = `${entityType}:${entityId}`;
    setSelectedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    );
  };

  const exportResults = () => {
    if (huntingResults.matches?.length === 0) return;
    
    const exportData = {
      query: huntQuery,
      timestamp: new Date().toISOString(),
      investigation: activeInvestigation?.name || 'Ad-hoc Hunt',
      results: huntingResults
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-hunt-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEntityIcon = (type) => ({
    threat: AlertTriangle,
    user_activity: Eye,
    device: Target
  }[type] || Search);

  const getRiskColor = (risk) => ({
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-blue-500 text-white'
  }[risk] || 'bg-slate-500 text-white');

  return (
    <div className="space-y-6">
      {/* Hunt Query Interface */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                Interactive Threat Hunting Workbench
              </CardTitle>
              <CardDescription>
                SQL-like query interface with natural language processing for advanced threat hunting
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    New Investigation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create New Investigation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Start a new collaborative investigation to track your hunting progress.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Investigation Name"
                      value={investigationName}
                      onChange={(e) => setInvestigationName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={investigationDescription}
                      onChange={(e) => setInvestigationDescription(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={createInvestigation}>
                      Create Investigation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {huntingResults.matches?.length > 0 && (
                <Button variant="outline" onClick={exportResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeInvestigation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Active Investigation:</span>
                <span className="text-blue-700">{activeInvestigation.name}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Input
              placeholder="Enter hunting query (e.g., 'find all failed logins from IP 192.168.1.1' or 'show suspicious activity for user@domain.com')"
              value={huntQuery}
              onChange={(e) => setHuntQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && executeHunt()}
              className="flex-1"
            />
            <Button onClick={executeHunt} disabled={isHunting || !huntQuery.trim()}>
              {isHunting ? 'Hunting...' : 'Execute Hunt'}
            </Button>
          </div>

          {/* Quick Hunt Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600">Quick examples:</span>
            {[
              'failed logins last 24h',
              'high risk activities',
              'off-hours access patterns',
              'suspicious file downloads'
            ].map(example => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setHuntQuery(example)}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hunt Results */}
      {huntingResults.matches && (
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matches">Matches ({huntingResults.matches?.length || 0})</TabsTrigger>
            <TabsTrigger value="correlations">Correlations ({huntingResults.correlations?.length || 0})</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Hunt Results</CardTitle>
                <CardDescription>Entities matching your hunting criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {huntingResults.matches?.map((match, index) => {
                    const EntityIcon = getEntityIcon(match.entity_type);
                    const itemKey = `${match.entity_type}:${match.entity_id}`;
                    const isSelected = selectedItems.includes(itemKey);
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'border-purple-300 bg-purple-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => toggleItemSelection(match.entity_type, match.entity_id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <EntityIcon className="w-5 h-5 text-slate-600 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium capitalize">{match.entity_type.replace('_', ' ')}</span>
                                <Badge className={getRiskColor(match.risk_level)}>
                                  {match.risk_level}
                                </Badge>
                                <span className="text-sm text-slate-500">
                                  Confidence: {match.confidence}%
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 mb-2">{match.summary}</p>
                              <p className="text-xs text-slate-600">Match reason: {match.match_reason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {huntingResults.matches?.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Search className="w-12 h-12 mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">No matches found</h3>
                      <p>Try refining your hunting query or expanding the time range</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Entity Correlations</CardTitle>
                <CardDescription>Relationships identified between hunting results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {huntingResults.correlations?.map((correlation, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-900">{correlation.correlation_type}</h4>
                        <Badge variant="outline">
                          Significance: {correlation.significance}%
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{correlation.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {correlation.entities?.map(entity => (
                          <Badge key={entity} variant="secondary">{entity}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">AI Hunting Insights</CardTitle>
                <CardDescription>AI-generated analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {huntingResults.hunting_insights && (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-slate-700">{huntingResults.hunting_insights.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Findings</h4>
                      <ul className="space-y-1">
                        {huntingResults.hunting_insights.key_findings?.map((finding, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        {huntingResults.hunting_insights.recommended_actions?.map((action, i) => (
                          <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Follow-up Hunting Queries</h4>
                      <div className="flex flex-wrap gap-2">
                        {huntingResults.hunting_insights.follow_up_queries?.map((query, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => setHuntQuery(query)}
                            className="text-xs"
                          >
                            {query}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}