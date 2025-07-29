import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Workflow, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SOAROrchestrator({ threats }) {
  const [playbooks, setPlaybooks] = useState([]);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [automationLevel, setAutomationLevel] = useState('adaptive');

  useEffect(() => {
    generatePlaybooks();
  }, [threats]);

  const generatePlaybooks = async () => {
    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `As a SOAR (Security Orchestration, Automation, and Response) system, analyze these active threats and generate automated response playbooks:

Active Threats: ${JSON.stringify(threats.slice(0, 10))}

For each threat, create a response playbook with:
1. Automated containment steps
2. Investigation workflows
3. Remediation actions
4. Escalation procedures
5. Recovery tasks

Provide playbooks that can be executed automatically or with human approval.`,
        response_json_schema: {
          type: "object",
          properties: {
            playbooks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  threat_type: { type: "string" },
                  automation_level: { type: "string", enum: ["manual", "semi-auto", "fully-auto"] },
                  steps: { type: "array", items: { type: "string" } },
                  estimated_duration: { type: "string" },
                  risk_mitigation: { type: "number" },
                  requires_approval: { type: "boolean" }
                }
              }
            }
          }
        }
      });
      setPlaybooks(response.playbooks || []);
    } catch (error) {
      console.error("Error generating playbooks:", error);
    }
    setIsAnalyzing(false);
  };

  const executePlaybook = async (playbook) => {
    const workflowId = `workflow_${Date.now()}`;
    
    setActiveWorkflows(prev => [...prev, {
      id: workflowId,
      playbook: playbook,
      status: 'executing',
      startTime: new Date(),
      currentStep: 0,
      progress: 0
    }]);

    // Simulate workflow execution
    const totalSteps = playbook.steps.length;
    for (let step = 0; step < totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setActiveWorkflows(prev => prev.map(workflow => 
        workflow.id === workflowId 
          ? { 
              ...workflow, 
              currentStep: step + 1,
              progress: ((step + 1) / totalSteps) * 100,
              status: step === totalSteps - 1 ? 'completed' : 'executing'
            }
          : workflow
      ));
    }
  };

  const getAutomationColor = (level) => ({
    'manual': 'bg-gray-100 text-gray-800',
    'semi-auto': 'bg-amber-100 text-amber-800',
    'fully-auto': 'bg-green-100 text-green-800'
  }[level]);

  const getStatusColor = (status) => ({
    'executing': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800',
    'pending': 'bg-gray-100 text-gray-800'
  }[status]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-emerald-600" />
          SOAR Orchestrator
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Mode: {automationLevel}
          </Badge>
          <Button onClick={generatePlaybooks} disabled={isAnalyzing} size="sm">
            {isAnalyzing ? 'Analyzing...' : 'Generate Playbooks'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Automation Level Control */}
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <h3 className="font-semibold text-emerald-900 mb-3">Automation Configuration</h3>
          <div className="grid grid-cols-3 gap-2">
            {['manual', 'adaptive', 'fully-auto'].map(level => (
              <Button
                key={level}
                variant={automationLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutomationLevel(level)}
                className="text-xs"
              >
                {level.replace('-', ' ').toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Workflows */}
        {activeWorkflows.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Active Workflows</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {activeWorkflows.map((workflow) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{workflow.playbook.name}</span>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Step {workflow.currentStep} of {workflow.playbook.steps.length}</span>
                        <span>{workflow.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                    </div>
                    {workflow.currentStep > 0 && (
                      <p className="text-sm text-slate-600">
                        Current: {workflow.playbook.steps[workflow.currentStep - 1]}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Available Playbooks */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Response Playbooks</h3>
          <div className="space-y-3">
            {playbooks.map((playbook, index) => (
              <motion.div
                key={playbook.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{playbook.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">Target: {playbook.threat_type}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getAutomationColor(playbook.automation_level)}>
                        {playbook.automation_level}
                      </Badge>
                      <Badge variant="outline">
                        {playbook.estimated_duration}
                      </Badge>
                      <Badge variant="outline">
                        {playbook.risk_mitigation}% risk reduction
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {playbook.requires_approval ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            Execute
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Execute Playbook: {playbook.name}</AlertDialogTitle>
                            <AlertDialogDescription>
                              This playbook will automatically execute the following steps:
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                {playbook.steps.slice(0, 3).map((step, i) => (
                                  <li key={i} className="text-sm">{step}</li>
                                ))}
                                {playbook.steps.length > 3 && (
                                  <li className="text-sm">...and {playbook.steps.length - 3} more steps</li>
                                )}
                              </ul>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => executePlaybook(playbook)}>
                              Authorize Execution
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button size="sm" onClick={() => executePlaybook(playbook)}>
                        <Play className="w-4 h-4 mr-1" />
                        Auto Execute
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <details>
                    <summary className="cursor-pointer font-medium mb-2">View Steps ({playbook.steps.length})</summary>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      {playbook.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SOAR Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{playbooks.length}</div>
            <div className="text-sm text-slate-600">Active Playbooks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{activeWorkflows.filter(w => w.status === 'completed').length}</div>
            <div className="text-sm text-slate-600">Completed Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {playbooks.reduce((acc, p) => acc + p.risk_mitigation, 0) / playbooks.length || 0}%
            </div>
            <div className="text-sm text-slate-600">Avg Risk Reduction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}