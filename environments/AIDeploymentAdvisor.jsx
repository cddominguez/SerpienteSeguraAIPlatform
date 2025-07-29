import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, Zap, ShieldAlert, GitBranch } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AIDeploymentAdvisor({ deployments, vulnerabilities }) {
  const [advice, setAdvice] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateAdvice = async () => {
    setIsAnalyzing(true);
    try {
      const context = {
        recent_deployments: deployments.slice(0, 5),
        detected_vulnerabilities: vulnerabilities.slice(0, 10),
        failed_deployments_count: deployments.filter(d => d.status === 'failed').length,
      };

      const response = await InvokeLLM({
        prompt: `As a DevSecOps expert AI, analyze this deployment data and provide actionable advice.
        Data: ${JSON.stringify(context)}
        Identify risks, suggest improvements for security and efficiency, and highlight positive trends.`,
        response_json_schema: {
          type: "object",
          properties: {
            key_observation: { type: "string" },
            security_risks: { type: "array", items: { type: "string" } },
            efficiency_recommendations: { type: "array", items: { type: "string" } },
            positive_reinforcements: { type: "array", items: { type: "string" } }
          }
        }
      });
      setAdvice(response);
    } catch (e) {
      console.error("AI Advisor error:", e);
    }
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (deployments.length > 0) {
      generateAdvice();
    }
  }, [deployments]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Deployment Advisor
        </CardTitle>
        <CardDescription>Insights to optimize your deployment pipeline.</CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
            <>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-16 w-full" />
            </>
        )}
        {advice && !isAnalyzing && (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Key Observation</h4>
                    <p className="text-sm text-slate-700 mt-1">{advice.key_observation}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500" /> Security Risks</h4>
                    <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
                        {advice.security_risks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2"><GitBranch className="w-4 h-4 text-blue-500" /> Efficiency Recommendations</h4>
                     <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
                        {advice.efficiency_recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                </div>
            </div>
        )}
         <Button onClick={generateAdvice} disabled={isAnalyzing} className="w-full mt-4">
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Re-analyze"}
        </Button>
      </CardContent>
    </Card>
  );
}