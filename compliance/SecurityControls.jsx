import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function SecurityControls({ controls, isLoading, refreshData }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = ['all', 'confidentiality', 'integrity', 'availability', 'authentication', 'authorization', 'nonrepudiation', 'risk_management'];
  const statuses = ['all', 'implemented', 'partial', 'planned', 'not_implemented'];

  const filteredControls = controls.filter(control => {
    const categoryMatch = filterCategory === 'all' || control.category === filterCategory;
    const statusMatch = filterStatus === 'all' || control.implementation_status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'planned': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'not_implemented': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => ({
    'implemented': 'bg-green-100 text-green-800',
    'partial': 'bg-yellow-100 text-yellow-800',
    'planned': 'bg-blue-100 text-blue-800',
    'not_implemented': 'bg-red-100 text-red-800'
  }[status]);

  const getRiskColor = (risk) => ({
    'critical': 'bg-red-500',
    'high': 'bg-orange-500',
    'medium': 'bg-yellow-500',
    'low': 'bg-blue-500'
  }[risk]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Security Controls Management
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex gap-1">
            {categories.map(category => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
                className="text-xs"
              >
                {category.replace('_', ' ')}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            {statuses.map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="text-xs"
              >
                {status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredControls.map((control, index) => (
            <motion.div
              key={control.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(control.implementation_status)}
                    <h3 className="font-semibold text-slate-900">{control.name}</h3>
                    <Badge variant="outline" className="text-xs">{control.control_id}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Framework: {control.framework}</span>
                    <span>Category: {control.category.replace('_', ' ')}</span>
                    <span>Team: {control.responsible_team}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(control.risk_level)}`} title={`${control.risk_level} risk`}></div>
                  <Badge className={getStatusColor(control.implementation_status)}>
                    {control.implementation_status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Effectiveness</span>
                    <span className="text-sm font-semibold text-emerald-600">{control.effectiveness}%</span>
                  </div>
                  <Progress value={control.effectiveness} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Last Tested:</span>
                  <span className="font-medium">{format(new Date(control.last_tested), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}