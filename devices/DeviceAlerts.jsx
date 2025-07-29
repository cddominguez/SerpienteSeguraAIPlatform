import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Settings, Wrench, CheckCircle, X, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DeviceAlert } from "@/api/entities";
import ExplainableAIDecision from '../ai/ExplainableAIDecision';
import { AnimatePresence, motion } from 'framer-motion';

export default function DeviceAlerts({ alerts = [], devices = [], isLoading, refreshAlerts }) {
  const [processingAlert, setProcessingAlert] = useState(null);
  const [autoResolveLog, setAutoResolveLog] = useState(null);

  const getAlertIcon = (type) => ({
    threat_detected: Shield,
    policy_violation: Settings,
    maintenance_required: Wrench,
    anomaly_detected: AlertTriangle,
    compliance_issue: CheckCircle
  }[type] || AlertTriangle);

  const getSeverityColor = (severity) => ({
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-blue-500 text-white"
  }[severity] || "bg-slate-500 text-white");

  const getDeviceName = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    return device ? device.name : 'Unknown Device';
  };

  const resolveAlert = async (alert) => {
    setProcessingAlert(alert.id);
    try {
      await DeviceAlert.update(alert.id, { status: 'resolved' });
      await refreshAlerts();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
    setProcessingAlert(null);
  };

  const dismissAlert = async (alert) => {
    setProcessingAlert(alert.id);
    try {
      await DeviceAlert.update(alert.id, { status: 'dismissed' });
      await refreshAlerts();
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
    setProcessingAlert(null);
  };
  
  const handleViewExplanation = async (alert) => {
    // Create a mock log for demonstration
    const mockLog = {
      id: `log-${alert.id}`,
      action_taken: 'isolate_device',
      target: getDeviceName(alert.device_id),
      reasoning: `The device exhibited behavior consistent with a C2 beacon (high-frequency, low-volume outbound traffic to a low-reputation IP) combined with a recently failed policy compliance check for patch levels. The action was taken to prevent potential lateral movement.`,
      confidence_score: 92,
      triggering_event_ids: [alert.id],
    };
    setAutoResolveLog(mockLog);
  };

  const openAlerts = alerts.filter(a => a.status === 'open');
  const criticalAlerts = openAlerts.filter(a => a.severity === 'critical');

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Device Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {autoResolveLog && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ExplainableAIDecision auditLog={autoResolveLog} onFeedback={() => setAutoResolveLog(null)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {criticalAlerts.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Alerts Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAlerts.map(alert => {
                const AlertIcon = getAlertIcon(alert.alert_type);
                return (
                  <div key={alert.id} className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <AlertIcon className="w-5 h-5 text-red-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{getDeviceName(alert.device_id)}</p>
                          <p className="text-sm text-slate-700">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-red-500 text-white">Critical</Badge>
                            <span className="text-xs text-slate-500">
                              AI Confidence: {alert.ai_confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => resolveAlert(alert)}
                          disabled={processingAlert === alert.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">All Device Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No alerts found. Your devices are secure.
              </div>
            ) : (
              alerts.map(alert => {
                const AlertIcon = getAlertIcon(alert.alert_type);
                return (
                  <div key={alert.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <AlertIcon className="w-5 h-5 text-slate-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            {alert.auto_resolved && (
                              <Badge variant="outline" className="text-purple-600 border-purple-300">
                                Auto-Resolved by AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{getDeviceName(alert.device_id)}</p>
                          <p className="text-sm text-slate-700 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                            <span>AI Confidence: {alert.ai_confidence}%</span>
                            <span>Status: {alert.status}</span>
                            <span>{formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}</span>
                            {alert.auto_resolved && (
                              <Button variant="link" className="p-0 h-auto text-xs" onClick={() => handleViewExplanation(alert)}>
                                View Explanation
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {alert.status === 'open' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resolveAlert(alert)}
                            disabled={processingAlert === alert.id}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => dismissAlert(alert)}
                            disabled={processingAlert === alert.id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}