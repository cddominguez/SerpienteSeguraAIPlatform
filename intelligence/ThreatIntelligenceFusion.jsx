import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Network, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThreatIntelligenceFusion({ threats }) {
  const [intelligence, setIntelligence] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (threats.length > 0) {
      analyzeThreatIntelligence();
    }
  }, [threats]);

  const analyzeThreatIntelligence = async () => {
    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze threat intelligence from multiple sources and correlate with current threats:

Current Threats: ${JSON.stringify(threats.slice(0, 10))}

Fuse intelligence from:
1. MITRE ATT&CK Framework
2. CVE Database
3. Threat Actor Profiles
4. Indicators of Compromise (IOCs)
5. Tactics, Techniques, and Procedures (TTPs)

Provide threat correlation, attribution analysis, and predictive insights.`,
        response_json_schema: {
          type: "object",
          properties: {
            threat_correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threat_id: { type: "string" },
                  mitre_technique: { type: "string" },
                  threat_actor: { type: "string" },
                  confidence: { type: "number" },
                  iocs: { type: "array", items: { type: "string" } }
                }
              }
            },
            attribution_analysis: {
              type: "object",
              properties: {
                likely_actor: { type: "string" },
                campaign_name: { type: "string" },
                motivation: { type: "string" },
                confidence_level: { type: "number" }
              }
            },
            predictive_insights: {
              type: "array",
              items: { type: "string" }
            },
            intelligence_score: { type: "number" }
          }
        }
      });
      setIntelligence(response);
    } catch (error) {
      console.error("Error analyzing threat intelligence:", error);
    }
    setIsAnalyzing(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 80) return 'bg-green-100 text-green-800';
    if (confidence > 60) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-600" />
          Threat Intelligence Fusion
        </CardTitle>
        <Button onClick={analyzeThreatIntelligence} disabled={isAnalyzing} size="sm">
          {isAnalyzing ? 'Analyzing...' : 'Refresh Intel'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intelligence Sources */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <Brain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-800 font-medium">MITRE ATT&CK</p>
            <p className="text-xs text-blue-600">Active</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <AlertTriangle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-800 font-medium">CVE Database</p>
            <p className="text-xs text-green-600">Synced</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-800 font-medium">Threat Feeds</p>
            <p className="text-xs text-purple-600">Live</p>
          </div>
        </div>

        {intelligence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Attribution Analysis */}
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-bold text-slate-900 mb-3">Attribution Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Likely Actor:</span>
                  <div className="font-bold text-slate-900">{intelligence.attribution_analysis?.likely_actor || 'Unknown'}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Campaign:</span>
                  <div className="font-bold text-slate-900">{intelligence.attribution_analysis?.campaign_name || 'Unidentified'}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Motivation:</span>
                  <div className="text-slate-800">{intelligence.attribution_analysis?.motivation || 'Unknown'}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Confidence:</span>
                  <Badge className={getConfidenceColor(intelligence.attribution_analysis?.confidence_level || 0)}>
                    {intelligence.attribution_analysis?.confidence_level || 0}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Threat Correlations */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Threat Correlations</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {intelligence.threat_correlations?.map((correlation, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-slate-900">{correlation.mitre_technique}</h5>
                        <p className="text-sm text-slate-600">Actor: {correlation.threat_actor}</p>
                      </div>
                      <Badge className={getConfidenceColor(correlation.confidence)}>
                        {correlation.confidence}%
                      </Badge>
                    </div>
                    {correlation.iocs?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">IOCs:</p>
                        <div className="flex flex-wrap gap-1">
                          {correlation.iocs.slice(0, 3).map((ioc, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ioc}
                            </Badge>
                          ))}
                          {correlation.iocs.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{correlation.iocs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Insights */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Predictive Insights</h4>
              <div className="space-y-2">
                {intelligence.predictive_insights?.map((insight, index) => (
                  <div key={index} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Intelligence Score */}
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-900">Intelligence Fusion Score</span>
                <Badge className="bg-indigo-100 text-indigo-800">
                  {intelligence.intelligence_score}%
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}