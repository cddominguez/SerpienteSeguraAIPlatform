import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, change, isLoading, changeType, onRefresh, trend }) {
  const changeColor = changeType === 'increase' ? 'text-emerald-500' : changeType === 'decrease' ? 'text-red-500' : 'text-slate-500';
  const TrendIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : null;
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh} className="h-6 w-6 p-0">
              <Icon className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-slate-900">{value}</div>
            <div className="flex items-center gap-1 mt-1">
              {TrendIcon && <TrendIcon className="w-3 h-3" />}
              <p className={`text-xs ${changeColor}`}>{change}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}