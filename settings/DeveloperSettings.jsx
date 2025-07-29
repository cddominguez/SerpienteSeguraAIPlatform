import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Code, GitBranch, Zap, Settings } from 'lucide-react';

export default function DeveloperSettings() {
  const [apiSettings, setApiSettings] = useState({
    rateLimit: 1000,
    enableCORS: true,
    apiVersion: 'v1',
    enableWebhooks: true,
    debugMode: false
  });

  const [cicdSettings, setCicdSettings] = useState({
    enablePipelineIntegration: true,
    autoScanOnCommit: true,
    blockDeploymentOnVulnerabilities: true,
    notificationChannel: 'slack'
  });

  const [customScripts, setCustomScripts] = useState([
    { id: 1, name: 'Security Scan Script', type: 'pre-commit', enabled: true },
    { id: 2, name: 'Compliance Check', type: 'pre-deploy', enabled: true },
    { id: 3, name: 'Custom Alert Handler', type: 'webhook', enabled: false }
  ]);

  return (
    <div className="space-y-8">
      {/* API Configuration */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            API Configuration
          </CardTitle>
          <CardDescription>Configure API settings and developer access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate Limit (requests/hour)</label>
              <Input 
                type="number"
                value={apiSettings.rateLimit}
                onChange={(e) => setApiSettings({...apiSettings, rateLimit: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Version</label>
              <Input 
                value={apiSettings.apiVersion}
                onChange={(e) => setApiSettings({...apiSettings, apiVersion: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable CORS</p>
                <p className="text-sm text-slate-600">Allow cross-origin requests</p>
              </div>
              <Switch 
                checked={apiSettings.enableCORS}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, enableCORS: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Webhooks</p>
                <p className="text-sm text-slate-600">Allow webhook integrations</p>
              </div>
              <Switch 
                checked={apiSettings.enableWebhooks}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, enableWebhooks: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Debug Mode</p>
                <p className="text-sm text-slate-600">Enable detailed API error responses</p>
              </div>
              <Switch 
                checked={apiSettings.debugMode}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, debugMode: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CI/CD Integration */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-600" />
            CI/CD Integration
          </CardTitle>
          <CardDescription>Configure continuous integration and deployment settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Pipeline Integration</p>
                <p className="text-sm text-slate-600">Integrate with CI/CD pipelines</p>
              </div>
              <Switch 
                checked={cicdSettings.enablePipelineIntegration}
                onCheckedChange={(checked) => setCicdSettings({...cicdSettings, enablePipelineIntegration: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-scan on Commit</p>
                <p className="text-sm text-slate-600">Automatically scan code on every commit</p>
              </div>
              <Switch 
                checked={cicdSettings.autoScanOnCommit}
                onCheckedChange={(checked) => setCicdSettings({...cicdSettings, autoScanOnCommit: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Block Deployment on Vulnerabilities</p>
                <p className="text-sm text-slate-600">Prevent deployment if high-risk vulnerabilities are found</p>
              </div>
              <Switch 
                checked={cicdSettings.blockDeploymentOnVulnerabilities}
                onCheckedChange={(checked) => setCicdSettings({...cicdSettings, blockDeploymentOnVulnerabilities: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Scripts */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Custom Scripts
          </CardTitle>
          <CardDescription>Manage custom automation scripts and hooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {customScripts.map((script) => (
              <div key={script.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{script.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {script.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={script.enabled}
                    onCheckedChange={(checked) => {
                      setCustomScripts(customScripts.map(s => 
                        s.id === script.id ? {...s, enabled: checked} : s
                      ));
                    }}
                  />
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline">
            <Code className="w-4 h-4 mr-2" />
            Add Custom Script
          </Button>
        </CardContent>
      </Card>

      {/* Policy as Code */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Policy as Code</CardTitle>
          <CardDescription>Define security policies using code for version control and automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Security Policy Template</label>
            <Textarea 
              rows={10}
              placeholder="# Example Security Policy
apiVersion: security.serpientesegura.com/v1
kind: SecurityPolicy
metadata:
  name: default-security-policy
spec:
  passwordPolicy:
    minLength: 12
    requireSpecialChars: true
  accessControl:
    sessionTimeout: 8h
    maxFailedAttempts: 5
  dataProtection:
    encryptionRequired: true
    backupRetention: 365d"
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-3">
            <Button>Validate Policy</Button>
            <Button variant="outline">Save Template</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Developer Settings
        </Button>
      </div>
    </div>
  );
}