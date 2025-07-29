import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, DollarSign, CheckCircle, Clock, ArrowRight, Zap, AlertTriangle } from 'lucide-react';

export default function MigrationPlanner({ threats = [], isLoading = false }) {
  const [migrationPlan, setMigrationPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ensure threats is always an array
  const safeThreats = Array.isArray(threats) ? threats : [];

  const generateMigrationPlan = async () => {
    setIsGenerating(true);
    try {
      const context = {
        total_algorithms: safeThreats.length,
        immediate_threats: safeThreats.filter(t => t.quantum_vulnerability === 'immediate'),
        near_term_threats: safeThreats.filter(t => t.quantum_vulnerability === 'near_term'),
        estimated_total_cost: safeThreats.reduce((sum, t) => sum + (t.estimated_migration_cost || 0), 0),
        affected_systems: safeThreats.flatMap(t => t.affected_systems || [])
      };

      const response = await InvokeLLM({
        prompt: `Create a comprehensive quantum-safe migration plan based on the current cryptographic infrastructure assessment.
        
Data: ${JSON.stringify(context)}

Provide a detailed migration strategy including phases, timelines, priorities, and cost estimates.`,
        response_json_schema: {
          type: "object",
          properties: {
            migration_phases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phase_name: { type: "string" },
                  duration_months: { type: "number" },
                  priority: { type: "string" },
                  estimated_cost: { type: "number" },
                  key_activities: { type: "array", items: { type: "string" } }
                }
              }
            },
            risk_mitigation: { type: "array", items: { type: "string" } },
            recommended_algorithms: { type: "array", items: { type: "string" } },
            total_timeline_months: { type: "number" },
            success_metrics: { type: "array", items: { type: "string" } }
          }
        }
      });

      setMigrationPlan(response);
    } catch (error) {
      console.error("Error generating migration plan:", error);
    }
    setIsGenerating(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Quantum Migration Planner
            </CardTitle>
            <CardDescription>
              AI-powered migration strategy for transitioning to quantum-safe cryptography
            </CardDescription>
          </div>
          <Button onClick={generateMigrationPlan} disabled={isGenerating}>
            {isGenerating ? 'Generating Plan...' : 'Generate Migration Plan'}
          </Button>
        </CardHeader>
        <CardContent>
          {migrationPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">
                    {migrationPlan.total_timeline_months} months
                  </div>
                  <div className="text-sm text-slate-600">Total Timeline</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">
                    {migrationPlan.migration_phases?.length || 0}
                  </div>
                  <div className="text-sm text-slate-600">Migration Phases</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">
                    ${migrationPlan.migration_phases?.reduce((sum, phase) => sum + (phase.estimated_cost || 0), 0).toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-slate-600">Estimated Cost</div>
                </div>
              </div>

              <Tabs defaultValue="phases" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="phases">Migration Phases</TabsTrigger>
                  <TabsTrigger value="algorithms">Recommended Algorithms</TabsTrigger>
                  <TabsTrigger value="risks">Risk Mitigation</TabsTrigger>
                  <TabsTrigger value="metrics">Success Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="phases" className="space-y-4">
                  {migrationPlan.migration_phases?.map((phase, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-slate-900">{phase.phase_name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(phase.priority)}>
                            {phase.priority}
                          </Badge>
                          <span className="text-sm text-slate-600">{phase.duration_months} months</span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-slate-700 mb-2">Key Activities</h4>
                          <ul className="space-y-1">
                            {phase.key_activities?.map((activity, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                {activity}
                              </li>
                            )) || <li className="text-sm text-slate-500">No activities defined</li>}
                          </ul>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            ${phase.estimated_cost?.toLocaleString() || '0'}
                          </div>
                          <p className="text-sm text-slate-600">Estimated Cost</p>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-slate-500">
                      No migration phases generated yet
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="algorithms" className="space-y-4">
                  <div className="grid gap-4">
                    {migrationPlan.recommended_algorithms?.map((algorithm, index) => (
                      <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-slate-900">{algorithm}</span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-slate-500">
                        No algorithm recommendations generated yet
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  <div className="grid gap-4">
                    {migrationPlan.risk_mitigation?.map((risk, index) => (
                      <div key={index} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <span className="text-slate-700">{risk}</span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-slate-500">
                        No risk mitigation strategies generated yet
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid gap-4">
                    {migrationPlan.success_metrics?.map((metric, index) => (
                      <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <span className="text-slate-700">{metric}</span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-slate-500">
                        No success metrics generated yet
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {!migrationPlan && !isGenerating && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Plan Your Migration?</h3>
              <p className="text-slate-600 mb-6">
                Generate a comprehensive quantum-safe migration strategy tailored to your infrastructure
              </p>
              <Button onClick={generateMigrationPlan} size="lg">
                Generate Migration Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}