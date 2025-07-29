import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, ShieldAlert, FileText, CheckCircle, Search } from 'lucide-react';

export default function SupplyChainAnalyzer({ components, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = useMemo(() => 
    components.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.license.toLowerCase().includes(searchTerm.toLowerCase())
    ), [components, searchTerm]);

  const summary = useMemo(() => {
    const total = components.length;
    const withVulns = components.filter(c => c.vulnerabilities_found > 0).length;
    const nonCompliant = components.filter(c => !c.is_compliant).length;
    const criticalVulns = components.filter(c => c.highest_severity === 'Critical').length;
    return { total, withVulns, nonCompliant, criticalVulns };
  }, [components]);

  const getSeverityBadge = (severity) => {
    if (severity === 'Critical') return <Badge variant="destructive">{severity}</Badge>;
    if (severity === 'High') return <Badge className="bg-orange-500 text-white hover:bg-orange-600">{severity}</Badge>;
    if (severity === 'Medium') return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">{severity}</Badge>;
    if (severity === 'Low') return <Badge variant="secondary">{severity}</Badge>;
    return <Badge variant="outline">{severity}</Badge>;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Software Supply Chain Analysis (SBOM)
        </CardTitle>
        <CardDescription>
            Analysis of components from the latest deployment's Software Bill of Materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
            <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-sm font-medium text-slate-600">Total Components</p>
                <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-sm font-medium text-slate-600">With Vulnerabilities</p>
                <p className={`text-2xl font-bold ${summary.withVulns > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>{summary.withVulns}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-sm font-medium text-slate-600">Critical Vulnerabilities</p>
                <p className={`text-2xl font-bold ${summary.criticalVulns > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{summary.criticalVulns}</p>
            </div>
             <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-sm font-medium text-slate-600">Non-Compliant Licenses</p>
                <p className={`text-2xl font-bold ${summary.nonCompliant > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{summary.nonCompliant}</p>
            </div>
        </div>

        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
                placeholder="Search components by name, version, or license..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>License</TableHead>
                        <TableHead className="text-center">Vulnerabilities</TableHead>
                        <TableHead>Highest Severity</TableHead>
                        <TableHead>License Compliance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredComponents.map(c => (
                        <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell>{c.version}</TableCell>
                            <TableCell>{c.license}</TableCell>
                            <TableCell className="text-center">{c.vulnerabilities_found}</TableCell>
                            <TableCell>{getSeverityBadge(c.highest_severity)}</TableCell>
                            <TableCell>
                                {c.is_compliant ? 
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-300"><CheckCircle className="w-3 h-3 mr-1" />Compliant</Badge> : 
                                    <Badge variant="destructive"><ShieldAlert className="w-3 h-3 mr-1" />Non-Compliant</Badge>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}