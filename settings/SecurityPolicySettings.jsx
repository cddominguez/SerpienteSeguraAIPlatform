import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

export default function SecurityPolicySettings() {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expireDays: 90,
    preventReuse: 5
  });

  const [accessPolicy, setAccessPolicy] = useState({
    sessionTimeout: 8,
    maxConcurrentSessions: 3,
    lockoutThreshold: 5,
    lockoutDuration: 30,
    requireMFA: true
  });

  const [dataPolicy, setDataPolicy] = useState({
    encryptionRequired: true,
    dataClassification: true,
    dlpEnabled: true,
    backupRetention: 365,
    auditLogging: true
  });

  return (
    <div className="space-y-8">
      {/* Password Policy */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Password Policy
          </CardTitle>
          <CardDescription>Configure organization-wide password requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Length</label>
              <Input 
                type="number"
                value={passwordPolicy.minLength}
                onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Expiration (Days)</label>
              <Input 
                type="number"
                value={passwordPolicy.expireDays}
                onChange={(e) => setPasswordPolicy({...passwordPolicy, expireDays: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Password Requirements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Uppercase Letters</span>
                <Switch 
                  checked={passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireUppercase: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Lowercase Letters</span>
                <Switch 
                  checked={passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireLowercase: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Numbers</span>
                <Switch 
                  checked={passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireNumbers: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Special Characters</span>
                <Switch 
                  checked={passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireSpecialChars: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Control Policy */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Access Control Policy
          </CardTitle>
          <CardDescription>Configure session management and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout (Hours)</label>
              <Input 
                type="number"
                value={accessPolicy.sessionTimeout}
                onChange={(e) => setAccessPolicy({...accessPolicy, sessionTimeout: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Concurrent Sessions</label>
              <Input 
                type="number"
                value={accessPolicy.maxConcurrentSessions}
                onChange={(e) => setAccessPolicy({...accessPolicy, maxConcurrentSessions: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Lockout Threshold</label>
              <Input 
                type="number"
                value={accessPolicy.lockoutThreshold}
                onChange={(e) => setAccessPolicy({...accessPolicy, lockoutThreshold: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lockout Duration (Minutes)</label>
              <Input 
                type="number"
                value={accessPolicy.lockoutDuration}
                onChange={(e) => setAccessPolicy({...accessPolicy, lockoutDuration: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require Multi-Factor Authentication</p>
              <p className="text-sm text-slate-600">Enforce MFA for all user accounts</p>
            </div>
            <Switch 
              checked={accessPolicy.requireMFA}
              onCheckedChange={(checked) => setAccessPolicy({...accessPolicy, requireMFA: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Security Policy */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Data Security Policy
          </CardTitle>
          <CardDescription>Configure data protection and monitoring policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Encryption Required</p>
                <p className="text-sm text-slate-600">Require encryption for sensitive data</p>
              </div>
              <Switch 
                checked={dataPolicy.encryptionRequired}
                onCheckedChange={(checked) => setDataPolicy({...dataPolicy, encryptionRequired: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Classification</p>
                <p className="text-sm text-slate-600">Automatically classify sensitive data</p>
              </div>
              <Switch 
                checked={dataPolicy.dataClassification}
                onCheckedChange={(checked) => setDataPolicy({...dataPolicy, dataClassification: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Loss Prevention (DLP)</p>
                <p className="text-sm text-slate-600">Monitor and prevent data exfiltration</p>
              </div>
              <Switch 
                checked={dataPolicy.dlpEnabled}
                onCheckedChange={(checked) => setDataPolicy({...dataPolicy, dlpEnabled: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Audit Logging</p>
                <p className="text-sm text-slate-600">Log all data access and modifications</p>
              </div>
              <Switch 
                checked={dataPolicy.auditLogging}
                onCheckedChange={(checked) => setDataPolicy({...dataPolicy, auditLogging: checked})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Backup Retention (Days)</label>
            <Input 
              type="number"
              value={dataPolicy.backupRetention}
              onChange={(e) => setDataPolicy({...dataPolicy, backupRetention: parseInt(e.target.value)})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Security Policies
        </Button>
      </div>
    </div>
  );
}