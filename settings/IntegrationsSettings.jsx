import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Code, Key, Zap, Settings, Eye, Copy, RefreshCw, Plus, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialApiKeys = [
  { id: 1, name: 'Production API', key: 'sk_live_abc123xyz789', permissions: ['read', 'write'], lastUsed: '2024-07-15', active: true },
  { id: 2, name: 'Development API', key: 'sk_test_def456uvw456', permissions: ['read'], lastUsed: '2024-07-14', active: true },
  { id: 3, name: 'SIEM Integration', key: 'sk_siem_ghi789rst123', permissions: ['read', 'webhook'], lastUsed: '2024-07-10', active: false }
];

const initialIntegrations = [
  { id: 'splunk', name: 'Splunk SIEM', type: 'siem', status: 'connected', lastSync: '2024-07-15 14:30', config: { endpoint: 'https://splunk.company.com', index: 'security' }, description: 'Cloud-native SIEM and SOAR solution' },
  { id: 'jira', name: 'Jira Service Desk', type: 'ticketing', status: 'connected', lastSync: '2024-07-15 12:15', config: { project: 'SEC', 'issue type': 'Security Incident' } },
  { id: 'slack', name: 'Slack Notifications', type: 'communication', status: 'configured', lastSync: '2024-07-15 10:45', config: { channel: '#security-alerts', 'webhook url': 'https://hooks.slack.com/...' } },
];

const allAvailableIntegrations = [
  { id: 'github', name: 'GitHub', type: 'source_control', description: 'Connect repositories for automated security scanning and vulnerability detection on commits' },
  { id: 'gitlab', name: 'GitLab', type: 'source_control', description: 'Integrate GitLab projects for continuous security analysis and DevSecOps workflows' },
  { id: 'jenkins', name: 'Jenkins', type: 'ci cd', description: 'Embed security testing and compliance checks in Jenkins build pipelines' },
  { id: 'teamcity', name: 'TeamCity', type: 'ci cd', description: 'Add automated security scanning to TeamCity build configurations' },
  { id: 'octopus', name: 'Octopus Deploy', type: 'deployment', description: 'Integrate security gates and compliance validation in deployment pipelines' },
  { id: 'codefresh', name: 'Codefresh', type: 'ci cd', description: 'Enable security-first CI/CD with integrated vulnerability scanning' },
  { id: 'digitalocean', name: 'DigitalOcean', type: 'cloud', description: 'Monitor and secure DigitalOcean droplets, databases, and Kubernetes clusters' },
  { id: 'aws', name: 'AWS Security Hub', type: 'cloud', description: 'Centralized security findings from AWS services' },
  { id: 'azure', name: 'Azure Sentinel', type: 'siem', description: 'Cloud-native SIEM and SOAR solution' },
  { id: 'gcp', name: 'Google Cloud Security', type: 'cloud', description: 'Google Cloud security and compliance' },
  { id: 'retool', name: 'Retool', type: 'internal tools', description: 'Secure integration for internal dashboards and admin tools with granular permissions' },
  { id: 'okta', name: 'Okta', type: 'identity', description: 'Identity and access management' },
  { id: 'crowdstrike', name: 'CrowdStrike', type: 'endpoint', description: 'Endpoint detection and response' },
  { id: 'paloalto', name: 'Palo Alto Networks', type: 'network', description: 'Next-generation firewall integration' },
  { id: 'msteams', name: 'Microsoft Teams', type: 'communication', status: 'disconnected', lastSync: null, config: {} },
];

const initialWebhooks = [
  { id: 1, url: 'https://api.company.com/security/webhook', events: ['threat_detected', 'incident_created'], status: 'active' },
  { id: 2, url: 'https://monitoring.company.com/webhook', events: ['compliance_violation'], status: 'active' },
  { id: 3, url: 'https://alerts.company.com/webhook', events: ['all'], status: 'inactive' }
];

export default function IntegrationsSettings() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [webhooks, setWebhooks] = useState(initialWebhooks);

  const getStatusBadge = (status) => {
    const colors = {
      'connected': 'bg-emerald-100 text-emerald-800',
      'configured': 'bg-blue-100 text-blue-800',
      'disconnected': 'bg-red-100 text-red-800',
      'active': 'bg-emerald-100 text-emerald-800',
      'inactive': 'bg-slate-100 text-slate-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: 'New API Key',
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ['read'],
      lastUsed: 'Never',
      active: true
    };
    setApiKeys([...apiKeys, newKey]);
  };
  
  const handleToggleApiKey = (id) => {
    setApiKeys(apiKeys.map(key => key.id === id ? { ...key, active: !key.active } : key));
  };
  
  const handleDeleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleToggleWebhook = (id) => {
    setWebhooks(webhooks.map(hook => hook.id === id ? { ...hook, status: hook.status === 'active' ? 'inactive' : 'active' } : hook));
  };
  
  const handleConnectIntegration = (integrationToConnect) => {
    const newIntegration = {
        ...integrationToConnect,
        status: 'configured',
        lastSync: new Date().toISOString().split('T')[0],
        config: { placeholder: 'Configuration needed' }
    };
    setIntegrations([...integrations, newIntegration]);
  };

  const connectedIntegrationIds = integrations.map(i => i.id);
  const availableIntegrations = allAvailableIntegrations.filter(i => !connectedIntegrationIds.includes(i.id));

  return (
    <div className="space-y-8">
      {/* API Key Management */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              API Key Management
            </CardTitle>
            <CardDescription>Manage API keys for programmatic access to the platform</CardDescription>
          </div>
          <Button onClick={handleGenerateApiKey} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate API Key
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm select-all">
                        {apiKey.key.slice(0, 12)}...{apiKey.key.slice(-4)}
                      </code>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(apiKey.key)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {apiKey.permissions.map((permission, i) => (
                        <Badge key={i} variant="outline" className="text-xs capitalize">{permission}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{apiKey.lastUsed}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadge(apiKey.active ? 'active' : 'inactive')} capitalize`}>
                      {apiKey.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleApiKey(apiKey.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>{apiKey.active ? 'Deactivate' : 'Activate'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteApiKey(apiKey.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Connected Integrations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Connected Integrations
          </CardTitle>
          <CardDescription>Manage connections to external security tools and platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {integrations.map((integration) => (
                <motion.div
                  key={integration.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{integration.name}</h4>
                      <p className="text-sm text-slate-600 capitalize">{integration.type} Integration</p>
                    </div>
                    <Badge className={`${getStatusBadge(integration.status)} capitalize`}>
                      {integration.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-slate-600">
                      <strong>Last Sync:</strong> {integration.lastSync || 'Never'}
                    </p>
                    {Object.entries(integration.config).length > 0 && (
                      <div>
                        <strong className="text-slate-700">Configuration:</strong>
                        <div className="mt-1 space-y-1 bg-slate-50 p-2 rounded">
                          {Object.entries(integration.config).map(([key, value], i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                              <span className="text-slate-600 capitalize">{key}:</span>
                              <span className="text-slate-900 font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <Button size="sm" variant="outline"><Settings className="w-4 h-4 mr-1" />Configure</Button>
                    <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" />Test</Button>
                    {integration.status === 'connected' && (
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">Disconnect</Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Available Integrations</CardTitle>
          <CardDescription>Connect with developer tools, cloud providers, and security platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
                {availableIntegrations.map((integration, i) => (
                <motion.div
                    key={integration.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow flex flex-col bg-white"
                >
                    <div className="mb-3">
                    <h4 className="font-semibold text-slate-900">{integration.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize mt-1">{integration.type.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 flex-grow">{integration.description}</p>
                    <Button size="sm" className="w-full mt-auto" onClick={() => handleConnectIntegration(integration)}>
                        <Plus className="w-4 h-4 mr-2" />Connect
                    </Button>
                </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              Webhook Configuration
            </CardTitle>
            <CardDescription>Configure webhooks for real-time event notifications</CardDescription>
          </div>
          <Button variant="outline"><Plus className="w-4 h-4 mr-2" />Add Webhook</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div className="flex-1">
                    <code className="bg-slate-100 px-2 py-1 rounded text-sm break-all">{webhook.url}</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusBadge(webhook.status)} capitalize`}>{webhook.status}</Badge>
                    <Switch checked={webhook.status === 'active'} onCheckedChange={() => handleToggleWebhook(webhook.id)} />
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {webhook.events.map((event, i) => (
                    <Badge key={i} variant="secondary" className="text-xs capitalize">{event.replace('_', ' ')}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}