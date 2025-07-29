import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart, DollarSign, BrainCircuit, Activity } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';

export default function RiskScenarioModeler({ onNewScenario }) {
  const [threatVector, setThreatVector] = useState('phishing');
  const [threatIncrease, setThreatIncrease] = useState([20]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const response = await InvokeLLM({
        prompt: `Simulate the business impact of a ${threatIncrease[0]}% increase in '${threatVector}' attacks. 
        Given our current security posture, calculate:
        1. Potential financial impact (in USD).
        2. Recommended security investment to mitigate this risk.
        3. Projected ROI of that investment.
        4. A concise summary of the outcome.`,
        response_json_schema: {
          type: "object",
          properties: {
            potential_financial_impact: { type: "number" },
            recommended_investment: { type: "number" },
            projected_roi: { type: "number" },
            summary: { type: "string" }
          }
        }
      });

      const scenarioData = {
        scenario_name: `+${threatIncrease[0]}% ${threatVector} attack`,
        threat_vector: threatVector,
        threat_increase_percent: threatIncrease[0],
        simulated_financial_impact: response.potential_financial_impact,
        recommended_investment: response.recommended_investment,
        projected_roi: response.projected_roi,
        summary: response.summary,
      };

      setSimulationResult(scenarioData);
      if(onNewScenario) onNewScenario();

    } catch (error) {
      console.error("Error running simulation:", error);
    }
    setIsSimulating(false);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Risk Scenario Modeler
        </CardTitle>
        <CardDescription>Run 'what-if' scenarios to understand potential business impact.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Threat Vector</label>
            <Select value={threatVector} onValueChange={setThreatVector}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="phishing">Phishing Attacks</SelectItem>
                <SelectItem value="ransomware">Ransomware Attacks</SelectItem>
                <SelectItem value="insider_threat">Insider Threats</SelectItem>
                <SelectItem value="supply_chain">Supply Chain Attacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Simulated Increase</label>
            <div className="flex items-center gap-4">
              <Slider
                value={threatIncrease}
                onValueChange={setThreatIncrease}
                max={100}
                step={5}
              />
              <span className="font-bold text-slate-700 w-16 text-center">{threatIncrease[0]}%</span>
            </div>
          </div>
        </div>
        <Button onClick={handleSimulate} disabled={isSimulating} className="w-full">
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </Button>
        {simulationResult && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold">Simulation Outcome:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <DollarSign className="w-6 h-6 mx-auto text-red-600 mb-1" />
                <p className="text-xs text-slate-500">Financial Impact</p>
                <p className="text-lg font-bold text-red-700">${simulationResult.simulated_financial_impact.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BrainCircuit className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                <p className="text-xs text-slate-500">Recommended Investment</p>
                <p className="text-lg font-bold text-blue-700">${simulationResult.recommended_investment.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <BarChart className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                <p className="text-xs text-slate-500">Projected ROI</p>
                <p className="text-lg font-bold text-emerald-700">{simulationResult.projected_roi}%</p>
              </div>
            </div>
            <div>
                <h5 className="font-medium text-sm mb-1">AI Summary:</h5>
                <p className="text-sm p-3 bg-slate-50 rounded-lg border">{simulationResult.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}