import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ComplianceStatus({ summary = {}, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const complianceFrameworks = [
    { name: 'GDPR', score: summary.gdpr_compliance || 85 },
    { name: 'HIPAA', score: summary.hipaa_compliance || 92 },
    { name: 'PCI-DSS', score: summary.pci_compliance || 78 },
    { name: 'SOX', score: summary.sox_compliance || 88 },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {complianceFrameworks.map(item => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
              <span className={`text-sm font-semibold ${item.score >= 90 ? 'text-emerald-600' : item.score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                {item.score}%
              </span>
            </div>
            <Progress value={item.score} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}