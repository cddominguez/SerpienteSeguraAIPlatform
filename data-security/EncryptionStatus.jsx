import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Lock } from 'lucide-react';

export default function EncryptionStatus({ isLoading }) {
  const data = [
    { name: 'Encrypted', value: 4892 },
    { name: 'Unencrypted', value: 123 },
  ];
  const COLORS = ['#10b981', '#ef4444'];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentage = ((data[0].value / total) * 100).toFixed(1);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          Encryption Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-emerald-600">{percentage}%</span>
            <span className="text-sm text-slate-500">Encrypted</span>
          </div>
        </div>
        <div className="mt-4 w-full text-center">
          <p className="text-slate-600">{data[0].value.toLocaleString()} files encrypted</p>
          <p className="text-red-600">{data[1].value.toLocaleString()} files at risk</p>
        </div>
      </CardContent>
    </Card>
  );
}