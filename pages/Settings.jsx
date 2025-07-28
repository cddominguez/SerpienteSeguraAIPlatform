import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Key, Building, Sliders, Palette, Code, Bell, ShieldCheck, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import UserManagementSettings from '../components/settings/UserManagementSettings';
import LicensingSettings from '../components/settings/LicensingSettings';
import CompanySettings from '../components/settings/CompanySettings';
import IntegrationsSettings from '../components/settings/IntegrationsSettings';
import SecurityPolicySettings from '../components/settings/SecurityPolicySettings';
import BrandingSettings from '../components/settings/BrandingSettings';
import DeveloperSettings from '../components/settings/DeveloperSettings';
import LocalizationSettings from '../components/settings/LocalizationSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import FederatedLearningSettings from '../components/settings/FederatedLearningSettings';

export default function Settings() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-8xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your organization, security policies, and integrations.</p>
        </div>

        <Tabs defaultValue="account" className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <TabsList className="flex flex-col w-full bg-white p-2 space-y-1 h-auto rounded-lg shadow-sm">
              <TabsTrigger 
                value="account" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <User className="w-4 h-4 mr-2" /> My Account
              </TabsTrigger>
              <TabsTrigger 
                value="licensing" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <Key className="w-4 h-4 mr-2" /> Licensing
              </TabsTrigger>
              <TabsTrigger 
                value="organization" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <Building className="w-4 h-4 mr-2" /> Organization
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <Sliders className="w-4 h-4 mr-2" /> Integrations
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 mr-2" /> Security & Alerts
              </TabsTrigger>
              <TabsTrigger 
                value="branding" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <Palette className="w-4 h-4 mr-2" /> Branding
              </TabsTrigger>
              <TabsTrigger 
                value="developer" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <Code className="w-4 h-4 mr-2" /> Developer
              </TabsTrigger>
              <TabsTrigger 
                value="localization" 
                className="w-full justify-start p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow text-left hover:bg-slate-50"
              >
                <Languages className="w-4 h-4 mr-2" /> Localization
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <TabsContent value="account" className="mt-0">
              <UserManagementSettings />
            </TabsContent>
            
            <TabsContent value="licensing" className="mt-0">
              <LicensingSettings />
            </TabsContent>
            
            <TabsContent value="organization" className="mt-0">
              <CompanySettings />
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-0">
              <IntegrationsSettings />
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                  <CardDescription>Manage security policies, notification preferences, and advanced AI settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <SecurityPolicySettings />
                  <NotificationSettings />
                  <FederatedLearningSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="branding" className="mt-0">
              <BrandingSettings />
            </TabsContent>
            
            <TabsContent value="developer" className="mt-0">
              <DeveloperSettings />
            </TabsContent>
            
            <TabsContent value="localization" className="mt-0">
              <LocalizationSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}