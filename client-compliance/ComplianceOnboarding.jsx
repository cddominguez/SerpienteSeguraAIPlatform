import React, { useState } from 'react';
import { ComplianceProfile } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Building, Globe, Database } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  "healthcare", "finance", "technology", "retail", "government", "education", "manufacturing", "other"
];

const frameworks = [
  "GDPR", "CCPA", "HIPAA", "PCI DSS", "SOX", "ISO 27001", "NIST CSF", "SOC 2"
];

const jurisdictions = [
  "United States", "European Union", "United Kingdom", "Canada", "Australia", "Japan", "Singapore", "Global"
];

const dataTypes = [
  "Personal Identifiable Information (PII)", "Protected Health Information (PHI)", 
  "Payment Card Information (PCI)", "Financial Data", "Intellectual Property", "Biometric Data"
];

export default function ComplianceOnboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organization_name: '',
    industry: '',
    jurisdictions: [],
    applicable_frameworks: [],
    data_types_processed: [],
    compliance_maturity: 'developing',
    risk_tolerance: 'medium',
    automation_level: 25
  });

  const handleSubmit = async () => {
    try {
      await ComplianceProfile.create(formData);
      onComplete();
    } catch (error) {
      console.error("Error creating compliance profile:", error);
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              Compliance Profile Setup
            </CardTitle>
            <p className="text-slate-600 mt-2">Let's configure your AI-powered compliance management system</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">Organization Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="org_name">Organization Name</Label>
                    <Input 
                      id="org_name"
                      value={formData.organization_name}
                      onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                      placeholder="Enter your organization name"
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {industry.charAt(0).toUpperCase() + industry.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Operating Jurisdictions</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    {jurisdictions.map(jurisdiction => (
                      <div key={jurisdiction} className="flex items-center space-x-2">
                        <Checkbox 
                          id={jurisdiction}
                          checked={formData.jurisdictions.includes(jurisdiction)}
                          onCheckedChange={(checked) => handleArrayChange('jurisdictions', jurisdiction, checked)}
                        />
                        <Label htmlFor={jurisdiction} className="text-sm">{jurisdiction}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900">Compliance Requirements</h2>
                </div>

                <div>
                  <Label>Applicable Compliance Frameworks</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    {frameworks.map(framework => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox 
                          id={framework}
                          checked={formData.applicable_frameworks.includes(framework)}
                          onCheckedChange={(checked) => handleArrayChange('applicable_frameworks', framework, checked)}
                        />
                        <Label htmlFor={framework} className="text-sm">{framework}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Compliance Maturity Level</Label>
                    <Select value={formData.compliance_maturity} onValueChange={(value) => setFormData({...formData, compliance_maturity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - Getting Started</SelectItem>
                        <SelectItem value="developing">Developing - Building Processes</SelectItem>
                        <SelectItem value="defined">Defined - Established Procedures</SelectItem>
                        <SelectItem value="managed">Managed - Optimized Operations</SelectItem>
                        <SelectItem value="optimizing">Optimizing - Continuous Improvement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Risk Tolerance</Label>
                    <Select value={formData.risk_tolerance} onValueChange={(value) => setFormData({...formData, risk_tolerance: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Conservative Approach</SelectItem>
                        <SelectItem value="medium">Medium - Balanced Approach</SelectItem>
                        <SelectItem value="high">High - Aggressive Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-slate-900">Data Processing Information</h2>
                </div>

                <div>
                  <Label>Types of Sensitive Data Processed</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    {dataTypes.map(dataType => (
                      <div key={dataType} className="flex items-center space-x-2">
                        <Checkbox 
                          id={dataType}
                          checked={formData.data_types_processed.includes(dataType)}
                          onCheckedChange={(checked) => handleArrayChange('data_types_processed', dataType, checked)}
                        />
                        <Label htmlFor={dataType} className="text-sm">{dataType}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3">🎯 AI-Powered Compliance Ready!</h3>
                  <p className="text-slate-700">
                    Based on your selections, our AI will automatically configure compliance monitoring, 
                    data discovery, risk assessments, and reporting workflows tailored to your organization.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <div className="flex-1"></div>
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (!formData.organization_name || !formData.industry)}
                >
                  Next Step
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                  Launch Compliance System
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}