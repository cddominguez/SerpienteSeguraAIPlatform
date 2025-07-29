import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Shield, Eye, Settings, Lock, UserPlus, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserManagementSettings({ currentUser }) {
  const [users, setUsers] = useState([
    { id: 1, email: 'admin@company.com', role: 'Global Admin', status: 'Active', mfaEnabled: true, lastLogin: '2024-01-15 14:30' },
    { id: 2, email: 'security@company.com', role: 'Security Analyst', status: 'Active', mfaEnabled: true, lastLogin: '2024-01-15 12:15' },
    { id: 3, email: 'user@company.com', role: 'Standard User', status: 'Inactive', mfaEnabled: false, lastLogin: '2024-01-10 09:45' }
  ]);

  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Global Admin', 
      permissions: ['full_access', 'user_management', 'billing', 'security_config'],
      description: 'Complete platform access and administration'
    },
    { 
      id: 2, 
      name: 'Security Analyst', 
      permissions: ['threat_analysis', 'incident_response', 'compliance_read'],
      description: 'Security monitoring and incident response'
    },
    { 
      id: 3, 
      name: 'Compliance Officer', 
      permissions: ['compliance_full', 'audit_read', 'policy_management'],
      description: 'Compliance management and reporting'
    },
    { 
      id: 4, 
      name: 'Standard User', 
      permissions: ['dashboard_read', 'reports_read'],
      description: 'Read-only access to dashboards and reports'
    }
  ]);

  const [ssoConfig, setSsoConfig] = useState({
    enabled: false,
    provider: 'azure_ad',
    domain: 'company.com',
    autoProvisioning: true
  });

  const [mfaSettings, setMfaSettings] = useState({
    enforced: true,
    methods: ['authenticator', 'sms', 'email'],
    backupCodes: true,
    sessionTimeout: 8
  });

  const permissionCategories = {
    'Platform Access': ['dashboard_read', 'full_access'],
    'User Management': ['user_management', 'role_management'],
    'Security': ['threat_analysis', 'incident_response', 'security_config'],
    'Compliance': ['compliance_read', 'compliance_full', 'audit_read', 'policy_management'],
    'Billing & Licensing': ['billing', 'licensing'],
    'Reporting': ['reports_read', 'reports_create', 'reports_export']
  };

  const getRoleBadge = (role) => {
    const colors = {
      'Global Admin': 'bg-red-500 text-white',
      'Security Analyst': 'bg-blue-500 text-white',
      'Compliance Officer': 'bg-emerald-500 text-white',
      'Standard User': 'bg-slate-500 text-white'
    };
    return colors[role] || 'bg-slate-500 text-white';
  };

  return (
    <div className="space-y-8">
      {/* User Management Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-3xl font-bold text-emerald-600">{users.filter(u => u.status === 'Active').length}</p>
              </div>
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">MFA Enabled</p>
                <p className="text-3xl font-bold text-purple-600">{users.filter(u => u.mfaEnabled).length}</p>
              </div>
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Custom Roles</p>
                <p className="text-3xl font-bold text-orange-600">{roles.length}</p>
              </div>
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">User Management</CardTitle>
            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.mfaEnabled ? 'default' : 'destructive'}>
                      {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role-Based Access Control */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Role-Based Access Control</CardTitle>
            <CardDescription>Define and manage user roles with granular permissions</CardDescription>
          </div>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{role.name}</h4>
                    <p className="text-sm text-slate-600">{role.description}</p>
                  </div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SSO Configuration */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Single Sign-On (SSO)</CardTitle>
            <CardDescription>Configure enterprise identity provider integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable SSO</p>
                <p className="text-sm text-slate-600">Allow users to authenticate via external identity provider</p>
              </div>
              <Switch checked={ssoConfig.enabled} onCheckedChange={(checked) => setSsoConfig({...ssoConfig, enabled: checked})} />
            </div>
            
            {ssoConfig.enabled && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Identity Provider</label>
                  <Select value={ssoConfig.provider} onValueChange={(value) => setSsoConfig({...ssoConfig, provider: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="azure_ad">Azure Active Directory</SelectItem>
                      <SelectItem value="okta">Okta</SelectItem>
                      <SelectItem value="google">Google Workspace</SelectItem>
                      <SelectItem value="saml">Custom SAML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domain</label>
                  <Input value={ssoConfig.domain} onChange={(e) => setSsoConfig({...ssoConfig, domain: e.target.value})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Provisioning</p>
                    <p className="text-sm text-slate-600">Automatically create accounts for new users</p>
                  </div>
                  <Switch checked={ssoConfig.autoProvisioning} onCheckedChange={(checked) => setSsoConfig({...ssoConfig, autoProvisioning: checked})} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* MFA Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Multi-Factor Authentication</CardTitle>
            <CardDescription>Configure additional security layers for user authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enforce MFA</p>
                <p className="text-sm text-slate-600">Require MFA for all users</p>
              </div>
              <Switch checked={mfaSettings.enforced} onCheckedChange={(checked) => setMfaSettings({...mfaSettings, enforced: checked})} />
            </div>
            
            <div className="space-y-3">
              <p className="font-medium">Allowed Methods</p>
              {['authenticator', 'sms', 'email', 'hardware_token'].map((method) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                  <Switch 
                    checked={mfaSettings.methods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setMfaSettings({...mfaSettings, methods: [...mfaSettings.methods, method]});
                      } else {
                        setMfaSettings({...mfaSettings, methods: mfaSettings.methods.filter(m => m !== method)});
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout (hours)</label>
              <Input 
                type="number" 
                value={mfaSettings.sessionTimeout} 
                onChange={(e) => setMfaSettings({...mfaSettings, sessionTimeout: parseInt(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}