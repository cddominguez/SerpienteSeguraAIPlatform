
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Crown, Users, Shield, Zap, Check, X, Settings, Key, Eye, EyeOff, Clock, AlertTriangle, GitBranch, FileCode, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { useFeatureFlags } from '../utils/FeatureFlagProvider'; // Assuming this path is correct for your project structure

const CustomerLicenseView = ({ license }) => {
  const [showFullLicenseKey, setShowFullLicenseKey] = useState(false);

  const maskLicenseKey = (key) => {
    if (!key || key.length < 8) return key;
    return `********************${key.slice(-4)}`;
  };
  
  return (
     <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                 {license.name} License
              </CardTitle>
              <CardDescription className="text-purple-100">
                Your active SerpienteSegura subscription
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2 capitalize">
                 {license.tier} Plan
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-purple-200 mb-2">License Key</p>
              <div className="flex items-center gap-3">
                <code className="bg-white/10 px-3 py-2 rounded text-sm font-mono">
                  {showFullLicenseKey ? license.licenseKey : maskLicenseKey(license.licenseKey)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullLicenseKey(!showFullLicenseKey)}
                  className="text-white hover:bg-white/10"
                >
                  {showFullLicenseKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
                <p className="text-purple-200 mb-2">License Tier</p>
                <div className="text-2xl font-bold capitalize">{license.tier}</div>
                <p className="text-purple-200">Enterprise-grade security platform</p>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

const TrialUserView = ({ user }) => {
    const endDate = new Date(user.trial_end_date);
    const daysRemaining = differenceInDays(endDate, new Date());
    
    return (
        <Card className="bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0">
            <CardHeader>
                <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Clock className="w-6 h-6" />
                        7-Day Trial Active
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                        You have full access to Pro features.
                    </CardDescription>
                </div>
                <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    Trial Plan
                </Badge>
                </div>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2">{daysRemaining > 0 ? daysRemaining : '0'}</div>
                <p className="text-lg text-blue-100 mb-4">Days Remaining</p>
                <p className="text-sm text-blue-200 mb-6">Your trial will end {formatDistanceToNow(endDate, { addSuffix: true })}.</p>
                <Button className="bg-white text-blue-600 hover:bg-blue-100 font-bold text-lg px-8 py-6">
                    Upgrade to a Full License
                </Button>
            </CardContent>
        </Card>
    )
}

export default function LicensingSettings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { featureFlags, toggleFeatureFlag } = useFeatureFlags();

  // Mock license data for a paying customer
  const customerLicense = {
    name: 'Enterprise Pro',
    tier: 'enterprise',
    licenseKey: 'SERP-PROD-ENT-QWERT-ASDFG-1234',
  };

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const user = await User.me(); // Fetching user data directly
            setCurrentUser(user);
        } catch (e) {
            console.error("User not found or API error:", e);
            setCurrentUser(null); // Ensure currentUser is null on error
        }
        setIsLoading(false);
    };
    fetchUser();
  }, []);

  const [usageMetrics, setUsageMetrics] = useState({
    apiCalls: 45230,
    maxApiCalls: 100000,
    dataIngestion: 2.4,
    maxDataIngestion: 10,
    alerts: 1250,
    maxAlerts: 5000
  });

  const allFeatures = {
    'Core Security': {
      'ai_security': 'AI-powered threat detection',
      'behavioral_analytics': 'User behavior analytics',
      'automated_response': 'Automated incident response'
    },
    'Compliance': {
      'compliance_full': 'Full compliance automation',
    },
    'Analytics & Reporting': {
      'executive_reporting': 'Executive reporting'
    },
    'Advanced Platforms': {
      'devsecops': { icon: GitBranch, name: 'DevSecOps Lifecycle Security'},
      'iot_security': { icon: HardDrive, name: 'IoT/OT Network Security' },
      'web3_security': { icon: FileCode, name: 'Web3 & Smart Contract Security' },
      'quantum_safety': { icon: Shield, name: 'Quantum-Safe Cryptography' },
    },
    'Enterprise Features': {
      'white_label': 'White-label solution',
    }
  };

  const getFeatureAccess = (feature) => {
    return true; // Assume all listed features are part of the current license for toggling
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-slate-700">Loading your licensing details...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-8 text-center bg-white rounded-lg shadow-xl">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Could not load user data</h2>
          <p className="text-slate-600">
            We were unable to retrieve your licensing information. Please ensure you are logged in and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {currentUser?.license_tier === 'trial' 
        ? <TrialUserView user={currentUser} /> 
        : <CustomerLicenseView license={customerLicense} />
      }

      {/* Feature Management */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Feature Management</CardTitle>
          <CardDescription>Enable or disable platform modules included in your plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(allFeatures).map(([category, features]) => (
              <div key={category}>
                <h3 className="font-semibold text-slate-900 mb-3">{category}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(features).map(([featureKey, featureValue]) => {
                    const hasAccess = getFeatureAccess(featureKey);
                    const isEnabled = featureFlags[featureKey] ?? false;
                    const featureName = typeof featureValue === 'string' ? featureValue : featureValue.name;
                    const FeatureIcon = typeof featureValue === 'object' ? featureValue.icon : null;

                    return (
                      <div
                        key={featureKey}
                        className="p-4 border rounded-lg flex items-center justify-between bg-slate-50/50"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            {FeatureIcon && <FeatureIcon className="w-4 h-4 text-slate-600" />}
                            <span className="font-medium text-slate-900">{featureName}</span>
                            {hasAccess ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            {hasAccess ? 'Included in your plan' : 'Not available in current plan'}
                          </p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => toggleFeatureFlag(featureKey)}
                          disabled={!hasAccess}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Usage Analytics</CardTitle>
          <CardDescription>Monitor your platform usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">API Calls</span>
                <Badge variant="outline">{((usageMetrics.apiCalls / usageMetrics.maxApiCalls) * 100).toFixed(1)}%</Badge>
              </div>
              <Progress value={(usageMetrics.apiCalls / usageMetrics.maxApiCalls) * 100} className="mb-2" />
              <p className="text-sm text-slate-600">
                {usageMetrics.apiCalls.toLocaleString()} of {usageMetrics.maxApiCalls.toLocaleString()} calls used
              </p>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">Data Storage</span>
                <Badge variant="outline">{((usageMetrics.dataIngestion / usageMetrics.maxDataIngestion) * 100).toFixed(1)}%</Badge>
              </div>
              <Progress value={(usageMetrics.dataIngestion / usageMetrics.maxDataIngestion) * 100} className="mb-2" />
              <p className="text-sm text-slate-600">
                {usageMetrics.dataIngestion} GB of {usageMetrics.maxDataIngestion} GB used
              </p>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">Alerts Generated</span>
                <Badge variant="outline">{((usageMetrics.alerts / usageMetrics.maxAlerts) * 100).toFixed(1)}%</Badge>
              </div>
              <Progress value={(usageMetrics.alerts / usageMetrics.maxAlerts) * 100} className="mb-2" />
              <p className="text-sm text-slate-600">
                {usageMetrics.alerts.toLocaleString()} of {usageMetrics.maxAlerts.toLocaleString()} alerts this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
