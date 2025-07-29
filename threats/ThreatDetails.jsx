
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Shield, MapPin, Clock, Target, Zap } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ContextSharingService from "../utils/ContextSharingService";

export default function ThreatDetails({ threat, isLoading }) {
  const [threatValidation, setThreatValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (threat) {
      validateThreatWithContext();
      
      // Share threat context with other modules
      ContextSharingService.registerModuleContext('threat_detection', {
        active_threat: threat,
        severity: threat.severity,
        type: threat.type,
        status: threat.status,
        risk_score: threat.risk_score
      });
    }
  }, [threat]);

  const validateThreatWithContext = async () => {
    if (!threat) return;
    
    setIsValidating(true);
    try {
      const validation = await ContextSharingService.validateThreat(threat, 'threat_detection');
      setThreatValidation(validation);
    } catch (error) {
      console.error("Error validating threat:", error);
    }
    setIsValidating(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity) => ({
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800", 
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  }[severity] || "bg-slate-100 text-slate-800");

  const threatDetails = [
    { label: "Detection Method", value: threat?.detection_method, icon: Target },
    { label: "Source IP", value: threat?.source_ip || 'Unknown', icon: MapPin },
    { label: "Risk Score", value: `${threat?.risk_score || 0}/100`, icon: AlertTriangle },
    { label: "Affected Device", value: threat?.affected_device || 'Multiple', icon: Shield },
    { label: "Auto Response", value: threat?.auto_response_taken ? 'Yes' : 'No', icon: Zap },
    { label: "First Detected", value: threat?.created_date ? format(new Date(threat.created_date), 'PPpp') : 'N/A', icon: Clock },
  ];

  return (
    <motion.div
      key={threat?.id || "no-threat-selected"} // Updated key for consistent animation even if threat is null
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Threat Analysis
            {threatValidation && (
              <Badge variant={threatValidation.is_legitimate ? "destructive" : "secondary"}>
                {threatValidation.false_positive_probability > 50 ? "Likely False Positive" : "Validated"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6"> {/* Apply space-y-6 here for consistent spacing */}
          {threat ? (
            <>
              {/* Cross-Module Validation Panel */}
              {threatValidation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    threatValidation.false_positive_probability > 50
                      ? 'bg-amber-50 border-amber-200'
                      : threatValidation.is_legitimate
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Cross-Module Validation
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Legitimacy:</span>
                      <Badge className={threatValidation.is_legitimate ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {threatValidation.is_legitimate ? "Confirmed Threat" : "False Positive"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span>
                      <Badge variant="outline">{threatValidation.confidence_score}%</Badge>
                    </div>
                    <div>
                      <span className="font-medium">False Positive Risk:</span>
                      <Badge className={
                        threatValidation.false_positive_probability > 50 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                      }>
                        {threatValidation.false_positive_probability}%
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Recommended Action:</span>
                      <span className="ml-2 text-slate-700">{threatValidation.recommended_action}</span>
                    </div>
                  </div>

                  {/* Supporting Evidence */}
                  {threatValidation.supporting_evidence?.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-green-900 mb-1">Supporting Evidence:</h5>
                      <ul className="text-sm text-green-800 list-disc list-inside">
                        {threatValidation.supporting_evidence.map((evidence, i) => (
                          <li key={i}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contradicting Evidence */}
                  {threatValidation.contradicting_evidence?.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-amber-900 mb-1">Contradicting Evidence:</h5>
                      <ul className="text-sm text-amber-800 list-disc list-inside">
                        {threatValidation.contradicting_evidence.map((evidence, i) => (
                          <li key={i}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Correlation Summary */}
                  {threatValidation.correlation_summary && (
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-1">Cross-Module Correlation:</h5>
                      <p className="text-sm text-blue-800">{threatValidation.correlation_summary}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Original Description Section */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600">{threat.description}</p>
              </div>
              
              {/* Combined new "Threat Information" summary and original "Additional Details" */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: New Threat Information Summary */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Threat Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Title:</span>
                      <span className="font-medium">{threat.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Severity:</span>
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.severity} severity
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <Badge variant="outline">{threat.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <Badge variant="secondary">{threat.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk Score:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{threat.risk_score || 'N/A'}</span>
                        {threatValidation && (
                          <span className="text-xs text-slate-500">
                            (Adjusted: {threatValidation.confidence_score})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Original Detailed Threat Info (from threatDetails array) */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Additional Details</h4> 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                    {threatDetails.map(detail => (
                      <div key={detail.label} className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <detail.icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">{detail.label}</p>
                          <p className="font-semibold text-slate-900 capitalize">{detail.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">No Threat Selected</h3>
              <p className="text-slate-500">Select a threat from the list to view detailed analysis</p>
            </div>
          )}
        </CardContent>
        {threat && ( // Only show footer if a threat is selected
          <CardFooter className="bg-slate-50/50 p-4 border-t mt-6 flex gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Shield className="w-4 h-4 mr-2" />
              Block Threat
            </Button>
            <Button variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Investigate
            </Button>
            <Button variant="destructive">
              <Zap className="w-4 h-4 mr-2" />
              Emergency Response
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
