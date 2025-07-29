import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Share2, Shield, Brain, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { User } from '@/api/entities';

export default function FederatedLearningSettings() {
  const [settings, setSettings] = useState({
    enableFederatedLearning: false,
    shareAnomalyPatterns: true,
    shareThreatSignatures: true,
    shareVulnerabilityFindings: false,
    privacyLevel: [85],
    contributionLevel: [60],
    autoOptOut: true
  });
  const [stats, setStats] = useState({
    networksConnected: 2847,
    threatsShared: 15683,
    falsePositiveReduction: 34,
    modelAccuracy: 94.2
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSliderChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Share2 className="w-5 h-5" />
            Federated Learning Network
          </CardTitle>
          <CardDescription>
            Join a privacy-preserving threat intelligence network to enhance detection capabilities while protecting sensitive data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/60 rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.networksConnected.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Networks Connected</div>
            </div>
            <div className="p-4 bg-white/60 rounded-lg text-center">
              <Shield className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.threatsShared.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Threats Shared Today</div>
            </div>
            <div className="p-4 bg-white/60 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.falsePositiveReduction}%</div>
              <div className="text-sm text-slate-600">False Positive Reduction</div>
            </div>
            <div className="p-4 bg-white/60 rounded-lg text-center">
              <Brain className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.modelAccuracy}%</div>
              <div className="text-sm text-slate-600">Model Accuracy</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-900">Enable Federated Learning</h3>
                <p className="text-sm text-slate-600">Join the global threat intelligence network for enhanced protection</p>
              </div>
              <Switch
                checked={settings.enableFederatedLearning}
                onCheckedChange={() => handleToggle('enableFederatedLearning')}
              />
            </div>

            {settings.enableFederatedLearning && (
              <>
                <div className="space-y-4 p-4 bg-white/40 rounded-lg">
                  <h4 className="font-medium text-slate-900">Data Sharing Preferences</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Anomaly Patterns</span>
                      <p className="text-xs text-slate-500">Share behavioral anomaly signatures (anonymized)</p>
                    </div>
                    <Switch
                      checked={settings.shareAnomalyPatterns}
                      onCheckedChange={() => handleToggle('shareAnomalyPatterns')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Threat Signatures</span>
                      <p className="text-xs text-slate-500">Share malware and attack pattern signatures</p>
                    </div>
                    <Switch
                      checked={settings.shareThreatSignatures}
                      onCheckedChange={() => handleToggle('shareThreatSignatures')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Vulnerability Findings</span>
                      <p className="text-xs text-slate-500">Share discovered vulnerabilities and exploits</p>
                    </div>
                    <Switch
                      checked={settings.shareVulnerabilityFindings}
                      onCheckedChange={() => handleToggle('shareVulnerabilityFindings')}
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-white/40 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-slate-900">Privacy Protection Level: {settings.privacyLevel[0]}%</label>
                    <p className="text-xs text-slate-500 mb-2">Higher values increase anonymization but may reduce model accuracy</p>
                    <Slider
                      value={settings.privacyLevel}
                      onValueChange={(value) => handleSliderChange('privacyLevel', value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">Contribution Level: {settings.contributionLevel[0]}%</label>
                    <p className="text-xs text-slate-500 mb-2">How much of your threat intelligence to share with the network</p>
                    <Slider
                      value={settings.contributionLevel}
                      onValueChange={(value) => handleSliderChange('contributionLevel', value)}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/40 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Auto Opt-out for Sensitive Industries</span>
                    <p className="text-xs text-slate-500">Automatically exclude industry-specific sensitive data</p>
                  </div>
                  <Switch
                    checked={settings.autoOptOut}
                    onCheckedChange={() => handleToggle('autoOptOut')}
                  />
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800">Privacy Protection</h4>
                      <p className="text-xs text-amber-700">
                        All shared data is cryptographically anonymized and processed using differential privacy techniques. 
                        Raw security logs and sensitive business data never leave your environment.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Federated Learning Benefits</CardTitle>
          <CardDescription>How joining the network improves your security posture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Shield className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Enhanced Detection</h3>
              <p className="text-sm text-slate-600">Detect threats seen across the global network before they impact your organization</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Brain className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Improved Accuracy</h3>
              <p className="text-sm text-slate-600">Reduce false positives through collective intelligence and continuous learning</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Community Defense</h3>
              <p className="text-sm text-slate-600">Contribute to and benefit from the global cybersecurity community</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}