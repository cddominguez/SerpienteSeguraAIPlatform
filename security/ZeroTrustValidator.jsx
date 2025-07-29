import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';

export default function ZeroTrustValidator({ devices, events }) {
  const [trustScores, setTrustScores] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    generateTrustScores();
  }, [devices, events]);

  const generateTrustScores = () => {
    const scores = devices.map(device => ({
      device_id: device.id,
      device_name: device.name,
      trust_score: Math.floor(Math.random() * 40) + 60, // 60-100
      risk_factors: generateRiskFactors(),
      verification_status: ['verified', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      last_validation: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    }));
    setTrustScores(scores);
  };

  const generateRiskFactors = () => {
    const allFactors = [
      'Outdated OS',
      'Missing patches',
      'Unusual location',
      'High privilege access',
      'Multiple failed logins',
      'Uncommon device type',
      'Certificate expiry',
      'Network anomaly'
    ];
    const count = Math.floor(Math.random() * 4);
    return allFactors.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const runZeroTrustValidation = async () => {
    setIsValidating(true);
    try {
      const response = await InvokeLLM({
        prompt: `Perform Zero Trust validation analysis on the network devices and security events:

Devices: ${JSON.stringify(devices.slice(0, 10))}
Recent Events: ${JSON.stringify(events.slice(0, 20))}

Apply Zero Trust principles:
1. Never trust, always verify
2. Principle of least privilege
3. Assume breach mentality
4. Verify explicitly

Analyze device compliance, user behavior, and access patterns. Provide trust scores and recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_trust_level: { type: "string", enum: ["high", "medium", "low", "critical"] },
            compliance_score: { type: "number" },
            policy_violations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  device_id: { type: "string" },
                  violation_type: { type: "string" },
                  severity: { type: "string" },
                  recommendation: { type: "string" }
                }
              }
            },
            access_anomalies: { type: "array", items: { type: "string" } },
            trust_recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      setValidationResults(response);
    } catch (error) {
      console.error("Error running Zero Trust validation:", error);
    }
    setIsValidating(false);
  };

  const getTrustColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getTrustLevel = (score) => {
    if (score >= 90) return 'High Trust';
    if (score >= 75) return 'Medium Trust';
    if (score >= 60) return 'Low Trust';
    return 'No Trust';
  };

  const getVerificationColor = (status) => ({
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-red-100 text-red-800'
  }[status]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Zero Trust Validator
        </CardTitle>
        <Button onClick={runZeroTrustValidation} disabled={isValidating} size="sm">
          {isValidating ? 'Validating...' : 'Validate Trust'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zero Trust Principles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <Lock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-800 font-medium">Never Trust</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <Eye className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-800 font-medium">Always Verify</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <UserCheck className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-800 font-medium">Least Privilege</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <Shield className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xs text-orange-800 font-medium">Assume Breach</p>
          </div>
        </div>

        {/* Device Trust Scores */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Device Trust Scores</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {trustScores.map((device, index) => (
              <motion.div
                key={device.device_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{device.device_name}</h4>
                    <p className="text-sm text-slate-600">ID: {device.device_id}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getTrustColor(device.trust_score)}`}>
                      {device.trust_score}%
                    </div>
                    <Badge className={getVerificationColor(device.verification_status)}>
                      {device.verification_status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Trust Level: {getTrustLevel(device.trust_score)}</span>
                    <span>Last Check: {device.last_validation.toLocaleTimeString()}</span>
                  </div>
                  <Progress value={device.trust_score} className="h-2" />
                </div>

                {device.risk_factors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {device.risk_factors.map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-red-600">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Validation Results */}
        {validationResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Zero Trust Assessment</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <span className="font-medium">Overall Trust Level:</span>
                  <div className="font-bold capitalize">{validationResults.overall_trust_level}</div>
                </div>
                <div>
                  <span className="font-medium">Compliance Score:</span>
                  <div className="font-bold">{validationResults.compliance_score}%</div>
                </div>
              </div>
            </div>

            {validationResults.policy_violations.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Policy Violations</h4>
                <div className="space-y-2">
                  {validationResults.policy_violations.map((violation, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-red-900">{violation.violation_type}</span>
                        <Badge variant="destructive">{violation.severity}</Badge>
                      </div>
                      <p className="text-sm text-red-800">Device: {violation.device_id}</p>
                      <p className="text-sm text-red-700 mt-1">{violation.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Trust Recommendations</h4>
              <div className="space-y-2">
                {validationResults.trust_recommendations.map((rec, index) => (
                  <div key={index} className="p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            Enforce Policies
          </Button>
          <Button variant="outline" size="sm">
            Update Trust Scores
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}