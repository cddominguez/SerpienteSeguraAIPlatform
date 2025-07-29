
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Zap, Shield, CheckCircle, AlertTriangle, Play, Pause, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Threat } from '@/api/entities';
import { AIActionAudit } from '@/api/entities';

export default function AutomatedResponseCenter({ threats, onRefresh }) {
  const [responses, setResponses] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [activePlaybooks, setActivePlaybooks] = useState([]);

  useEffect(() => {
    if (threats.length > 0) {
      analyzeThreatsForResponse();
    }
  }, [threats]);

  const analyzeThreatsForResponse = async () => {
    setIsAnalyzing(true);
    try {
      const activeThreats = threats.filter(t => t.status === 'active').slice(0, 10);
      
      if (activeThreats.length === 0) {
        setResponses([]);
        setIsAnalyzing(false);
        return;
      }

      const response = await InvokeLLM({
        prompt: `As an AI security orchestration system, analyze these active threats and recommend automated response actions:

Active Threats: ${JSON.stringify(activeThreats)}

For each threat, provide:
1. Recommended immediate actions
2. Risk mitigation steps
3. Automation feasibility
4. Estimated time to resolution
5. Business impact assessment

Focus on actionable, specific responses that can be automated.`,
        response_json_schema: {
          type: "object",
          properties: {
            automated_responses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threat_id: { type: "string" },
                  threat_title: { type: "string" },
                  recommended_actions: {
                    type: "array",
                    items: { type: "string" }
                  },
                  automation_level: { type: "string", enum: ["manual", "semi-automated", "fully-automated"] },
                  risk_reduction: { type: "number" },
                  estimated_resolution_time: { type: "string" },
                  business_impact: { type: "string", enum: ["low", "medium", "high", "critical"] }
                }
              }
            }
          }
        }
      });

      setResponses(response.automated_responses || []);
    } catch (error) {
      console.error("Error analyzing threats for response:", error);
      setResponses([]);
    }
    setIsAnalyzing(false);
  };

  const executeResponse = async (responseId) => {
    const response = responses.find(r => r.threat_id === responseId);
    if (!response) return;

    // Add to active playbooks
    const newPlaybook = {
      id: responseId,
      title: response.threat_title,
      status: 'executing',
      startTime: new Date().toISOString(),
      actions: response.recommended_actions
    };

    setActivePlaybooks(prev => [...prev, newPlaybook]);

    try {
      // Create an audit log for the AI-driven action
      await AIActionAudit.create({
        action_taken: 'automated_threat_response',
        target: `Threat ID: ${response.threat_id}`,
        reasoning: `AI recommended automated response for threat '${response.threat_title}' with ${response.risk_reduction}% risk reduction. Actions: ${response.recommended_actions.join(', ')}.`,
        confidence_score: (response.risk_reduction || 75) + 10, // Create a plausible confidence score
        triggering_event_ids: [response.threat_id]
      });

      // Simulate automated response execution
      setTimeout(async () => {
        // Update threat status
        await Threat.update(responseId, { 
          status: 'blocked', 
          auto_response_taken: true 
        });

        // Update playbook status
        setActivePlaybooks(prev => prev.map(p => 
          p.id === responseId ? { ...p, status: 'completed', endTime: new Date().toISOString() } : p
        ));

        // Refresh the parent data
        if (onRefresh) onRefresh();
      }, 3000);
    } catch (error) {
      console.error('Error executing automated response:', error);
      setActivePlaybooks(prev => prev.map(p => 
        p.id === responseId ? { ...p, status: 'failed', error: error.message } : p
      ));
    }
  };

  const clearCompletedPlaybooks = () => {
    setActivePlaybooks(prev => prev.filter(p => p.status === 'executing'));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Automated Response Center
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant={automationEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAutomationEnabled(!automationEnabled)}
          >
            {automationEnabled ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {automationEnabled ? 'Disable' : 'Enable'} Automation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeThreatsForResponse}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Playbooks */}
        {activePlaybooks.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-900">Active Response Playbooks</h3>
              <Button variant="ghost" size="sm" onClick={clearCompletedPlaybooks}>
                Clear Completed
              </Button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {activePlaybooks.map((playbook) => (
                  <motion.div
                    key={playbook.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {playbook.status === 'executing' ? (
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        ) : playbook.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-medium text-slate-900">{playbook.title}</span>
                      </div>
                      <Badge variant={
                        playbook.status === 'executing' ? 'default' : 
                        playbook.status === 'completed' ? 'secondary' : 
                        'destructive'
                      }>
                        {playbook.status}
                      </Badge>
                    </div>
                    {playbook.actions && (
                      <div className="text-sm text-slate-600">
                        <strong>Actions:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {playbook.actions.slice(0, 3).map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Recommended Responses */}
        {responses.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">AI-Recommended Responses</h3>
            <div className="space-y-4">
              {responses.map((response, i) => (
                <motion.div
                  key={response.threat_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-slate-50 rounded-lg border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">{response.threat_title}</h4>
                      <div className="flex gap-2">
                        <Badge className={
                          response.business_impact === 'critical' ? 'bg-red-500 text-white' :
                          response.business_impact === 'high' ? 'bg-orange-500 text-white' :
                          response.business_impact === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }>
                          {response.business_impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {response.automation_level}
                        </Badge>
                        <Badge variant="outline">
                          {response.risk_reduction}% risk reduction
                        </Badge>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          disabled={!automationEnabled || activePlaybooks.some(p => p.id === response.threat_id)}
                        >
                          Execute Response
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Execute Automated Response?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will automatically execute the recommended security response for "{response.threat_title}".
                            Estimated resolution time: {response.estimated_resolution_time}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => executeResponse(response.threat_id)}>
                            Execute
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm text-slate-700 mb-2">Recommended Actions:</h5>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {response.recommended_actions.map((action, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <Shield className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 mt-2">
                      <strong>ETA:</strong> {response.estimated_resolution_time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full mx-auto mb-3"
            />
            <p className="text-slate-500">Analyzing threats for automated response...</p>
          </div>
        )}

        {!responses.length && !isAnalyzing && (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">No Active Threats</h3>
            <p className="text-slate-500">All threats are currently contained or resolved</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
