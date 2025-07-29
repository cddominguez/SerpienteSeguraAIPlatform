
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Settings, Shield, Globe, Download, Plus, Edit } from 'lucide-react';
import { DevicePolicy } from "@/api/entities";

export default function PolicyManagement({ policies = [], devices = [], isLoading, refreshPolicies }) {
  const [updatingPolicy, setUpdatingPolicy] = useState(null);

  const getPolicyIcon = (type) => ({
    security: Shield,
    application: Settings,
    content_filtering: Globe,
    update: Download,
    compliance: Settings
  }[type] || Settings);

  const togglePolicy = async (policy) => {
    setUpdatingPolicy(policy.id);
    await DevicePolicy.update(policy.id, { is_active: !policy.is_active });
    await refreshPolicies();
    setUpdatingPolicy(null);
  };

  const getComplianceColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-slate-900">Security Policies</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {policies.map((policy) => {
              const PolicyIcon = getPolicyIcon(policy.type);
              return (
                <div key={policy.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <PolicyIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{policy.name}</h3>
                          <Badge variant="outline" className="capitalize">{policy.type.replace('_', ' ')}</Badge>
                          <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                            {policy.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{policy.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">Compliance</span>
                              <span className={`text-sm font-semibold ${getComplianceColor(policy.compliance_score)}`}>
                                {policy.compliance_score}%
                              </span>
                            </div>
                            <Progress value={policy.compliance_score} className="h-2" />
                          </div>
                          <div className="text-sm text-slate-500">
                            {policy.target_devices.length} device types
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={policy.is_active}
                        onCheckedChange={() => togglePolicy(policy)}
                        disabled={updatingPolicy === policy.id}
                      />
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
