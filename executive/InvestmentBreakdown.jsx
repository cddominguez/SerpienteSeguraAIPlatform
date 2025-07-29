import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestmentBreakdown({ executiveData = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Security Investment Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const latestSummary = executiveData[0] || {};
  const investmentData = latestSummary.investment_breakdown || {
    preventative: 450000,
    detective: 280000,
    responsive: 320000
  };

  const data = [
    { name: 'Preventative', value: investmentData.preventative, color: '#10b981' },
    { name: 'Detective', value: investmentData.detective, color: '#f59e0b' },
    { name: 'Responsive', value: investmentData.responsive, color: '#ef4444' },
  ];

  const formatCurrency = (value) => `$${(value / 1000).toFixed(0)}K`;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Security Investment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <ResponsiveContainer width="60%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="w-40% space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-600">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}