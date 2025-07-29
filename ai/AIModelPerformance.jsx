import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrainCircuit, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AIModelPerformance({ models = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-600" />
            AI Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="w-full h-[250px]" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          AI Model Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" />Model Accuracy (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={models}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} angle={-10} textAnchor="end" height={50} />
              <YAxis domain={[80, 100]} />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.5rem' }}
              />
              <Legend />
              <Bar dataKey="accuracy" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Model Status</h3>
          <div className="space-y-2">
            {models.map(model => (
              <div key={model.name} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-medium text-sm text-slate-700">{model.name}</span>
                <Badge variant={model.status === 'active' ? 'default' : 'secondary'} className={model.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}>
                  {model.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                  {model.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}