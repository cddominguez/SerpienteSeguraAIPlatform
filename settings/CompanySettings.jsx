import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, UserPlus, ChevronDown } from 'lucide-react';

export default function CompanySettings() {
  const [organizations, setOrganizations] = useState([
    { id: 'acme-corp', name: 'Acme Corporation' },
    { id: 'globex-inc', name: 'Globex Inc.' },
    { id: 'stark-industries', name: 'Stark Industries' }
  ]);
  const [currentOrg, setCurrentOrg] = useState('acme-corp');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-700"/>
            Organization Management
        </CardTitle>
        <CardDescription>
            Manage multiple organizations or tenants from your account. This is a UI simulation of multi-tenancy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h4 className="font-medium text-slate-800 mb-2">Switch Organization</h4>
            <div className="flex items-center gap-4">
                <Select value={currentOrg} onValueChange={setCurrentOrg}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                        {organizations.map(org => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button>Switch</Button>
            </div>
        </div>
        
        <div>
             <h4 className="font-medium text-slate-800 mb-2">Manage Users for {organizations.find(o => o.id === currentOrg)?.name}</h4>
             <Button variant="outline">
                 <UserPlus className="w-4 h-4 mr-2"/>
                 Invite User to Organization
             </Button>
        </div>

      </CardContent>
    </Card>
  );
}