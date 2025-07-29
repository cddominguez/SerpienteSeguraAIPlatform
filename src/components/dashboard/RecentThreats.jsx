import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Bot, CheckCircle, X, Eye, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecentThreats({ threats = [], onRefresh }) {
  const [actioningThreat, setActioningThreat] = useState(null);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-yellow-400 text-slate-900';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getThreatIcon = (type) => {
    switch (type) {
      case 'malware':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'phishing':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'ransomware':
        return <Lock className="w-5 h-5 text-red-600" />;
      default:
        return <Shield className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleThreatAction = async (threat, action) => {
    setActioningThreat(threat.id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating threat:', error);
    } finally {
      setActioningThreat(null);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Threats</CardTitle>
            <CardDescription>Latest security events identified across the enterprise.</CardDescription>
          </div>
          <Button variant="outline" onClick={onRefresh} size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {threats.slice(0, 8).map(threat => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div className="pt-1">{getThreatIcon(threat.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800">{threat.title}</h4>
                    <div className="flex gap-2">
                      <Badge className={getSeverityBadge(threat.severity)}>{threat.severity}</Badge>
                      <Badge variant="outline">{threat.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{threat.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        {formatDistanceToNow(new Date(threat.created_date), { addSuffix: true })}
                      </span>
                      {threat.detection_method === 'ai_analysis' && (
                        <div className="flex items-center gap-1">
                          <Bot className="w-3 h-3 text-purple-600" />
                          <span>AI Detected</span>
                        </div>
                      )}
                      {threat.risk_score && (
                        <span>Risk Score: {threat.risk_score}/100</span>
                      )}
                    </div>
                    {threat.status === 'active' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={actioningThreat === threat.id}
                          onClick={() => handleThreatAction(threat, 'resolve')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={actioningThreat === threat.id}
                          onClick={() => handleThreatAction(threat, 'block')}
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Block
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {threats.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">No Recent Threats</h3>
              <p className="text-slate-500">Your systems are secure</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}