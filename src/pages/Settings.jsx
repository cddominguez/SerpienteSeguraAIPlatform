import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagementSettings from '@/components/settings/UserManagementSettings';
import SecurityPolicySettings from '@/components/settings/SecurityPolicySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import IntegrationsSettings from '@/components/settings/IntegrationsSettings';
import LicensingSettings from '@/components/settings/LicensingSettings';
import LocalizationSettings from '@/components/settings/LocalizationSettings';
import BrandingSettings from '@/components/settings/BrandingSettings';
import DeveloperSettings from '@/components/settings/DeveloperSettings';
import FederatedLearningSettings from '@/components/settings/FederatedLearningSettings';
import CompanySettings from '@/components/settings/CompanySettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Platform Settings
          </h1>
          <p className="text-slate-600">
            Configure and customize your security platform
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="licensing">Licensing</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="developer">Developer</TabsTrigger>
            <TabsTrigger value="federated">Federated</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-8">
            <UserManagementSettings currentUser={{ email: 'admin@company.com' }} />
          </TabsContent>

          <TabsContent value="security" className="mt-8">
            <SecurityPolicySettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-8">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="integrations" className="mt-8">
            <IntegrationsSettings />
          </TabsContent>

          <TabsContent value="licensing" className="mt-8">
            <LicensingSettings />
          </TabsContent>

          <TabsContent value="localization" className="mt-8">
            <LocalizationSettings />
          </TabsContent>

          <TabsContent value="branding" className="mt-8">
            <BrandingSettings />
          </TabsContent>

          <TabsContent value="developer" className="mt-8">
            <DeveloperSettings />
          </TabsContent>

          <TabsContent value="federated" className="mt-8">
            <FederatedLearningSettings />
          </TabsContent>

          <TabsContent value="company" className="mt-8">
            <CompanySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}