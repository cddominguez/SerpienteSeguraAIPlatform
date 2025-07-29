
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, HardDrive, Cpu, MemoryStick, Scan, Server, ShieldOff, PowerOff, WifiOff, CheckCircle, AlertTriangle, Monitor } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import ContextSharingService from "@/utils/ContextSharingService";
import { InvokeLLM } from '@/api/integrations';

export default function DeviceDetails({ device, isLoading, onUpdate }) {
  const [deviceContext, setDeviceContext] = useState(null); // State to hold device context, though not directly used in render, it's part of the context sharing system.
  const [crossModuleAlerts, setCrossModuleAlerts] = useState([]);

  // Helper function for severity badge color
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-amber-400 text-black';
      case 'low': return 'bg-blue-400 text-white';
      case 'informational': return 'bg-slate-300 text-black';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Adapting existing getStatusInfo for badge color
  const getStatusInfo = (status) => ({
    protected: { text: "Protected", icon: CheckCircle, color: "bg-emerald-100 text-emerald-800" },
    at_risk: { text: "At Risk", icon: AlertTriangle, color: "bg-amber-100 text-amber-800" },
    compromised: { text: "Compromised", icon: ShieldOff, color: "bg-red-100 text-red-800" },
    online: { text: "Online", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
    offline: { text: "Offline", icon: WifiOff, color: "bg-slate-100 text-slate-800" },
  }[status] || { text: "Unknown", icon: WifiOff, color: "bg-slate-100 text-slate-800" });

  const getStatusColor = (status) => {
    const info = getStatusInfo(status);
    return info.color;
  };

  // Helper function for protection level badge color
  const getProtectionColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-emerald-100 text-emerald-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-red-100 text-red-800';
      case 'unprotected': return 'bg-red-500 text-white';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const checkDeviceRelatedAlerts = useCallback(async (context) => {
    if (!device) {
      console.warn("Attempted to check device-related alerts without a device selected.");
      return;
    }

    try {
      const response = await InvokeLLM({
        prompt: `Check if external module context affects this device:

Device: ${JSON.stringify(device, null, 2)}
External Context: ${JSON.stringify(context, null, 2)}

Determine:
1. If this context affects the device
2. Potential correlation with device issues
3. Required device actions
4. Risk level adjustments

Provide device-specific recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            affects_device: { type: "boolean" },
            correlation_strength: { type: "number" },
            alerts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  message: { type: "string" },
                  severity: { type: "string" },
                  source_module: { type: "string" }
                },
                required: ["type", "message", "severity", "source_module"]
              }
            },
            recommendations: { type: "array", items: { type: "string" } }
          },
          required: ["affects_device", "correlation_strength", "alerts", "recommendations"]
        }
      });

      if (response.affects_device && response.alerts && response.alerts.length > 0) {
        setCrossModuleAlerts(prev => [...prev, ...response.alerts]);
        // Potentially trigger onUpdate here if device state needs to be propagated up
        // onUpdate({ ...device, status: 'at_risk' }); // Example
      }
    } catch (error) {
      console.error("Error checking device-related alerts:", error);
    }
  }, [device]); // Re-create if device changes

  useEffect(() => {
    if (device) {
      // Share device context
      ContextSharingService.registerModuleContext('device_management', {
        device_status: device.status,
        device_type: device.device_type,
        protection_level: device.protection_level,
        threats_detected: device.threats_detected,
        last_scan: device.last_scan
      });

      // Subscribe to relevant alerts from other modules
      const unsubscribe = ContextSharingService.subscribe('device_management', (sourceModule, context) => {
        if (sourceModule === 'threat_detection' || sourceModule === 'user_security') {
          checkDeviceRelatedAlerts(context);
        }
      });

      // Cleanup subscription on component unmount or device change
      return () => {
        unsubscribe();
        setCrossModuleAlerts([]); // Clear alerts when device changes
      };
    }
  }, [device, checkDeviceRelatedAlerts]); // Include checkDeviceRelatedAlerts in dependencies

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Define details array for consistent rendering of non-custom fields
  const details = [
    { label: "IP Address", value: device?.ip_address, icon: HardDrive },
    { label: "MAC Address", value: device?.mac_address, icon: Cpu },
    { label: "Operating System", value: device?.operating_system, icon: Server },
    // Protection Level and Threats Detected are custom-rendered below
    { label: "Last Scan", value: device?.last_scan ? format(new Date(device.last_scan), 'PPpp') : 'Never', icon: Scan },
  ];


  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          {device ? (
            <>
              <Monitor className="w-5 h-5 text-blue-600" />
              Device Details
              {crossModuleAlerts.length > 0 && (
                <Badge variant="destructive">{crossModuleAlerts.length} Cross-Module Alerts</Badge>
              )}
            </>
          ) : (
            // No device selected title inside CardTitle for consistent header structure
            <h3 className="font-semibold text-slate-900">No Device Selected</h3>
          )}
        </CardTitle>
        {device && <p className="text-slate-500">{device.device_type}</p>}
      </CardHeader>
      <CardContent>
        {device ? (
          <div className="space-y-6">
            {/* Cross-Module Alerts */}
            {crossModuleAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Cross-Module Security Alerts
                </h4>
                <div className="space-y-2">
                  {crossModuleAlerts.map((alert, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900">{alert.type}</h5>
                          <p className="text-sm text-slate-600">{alert.message}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <Badge variant="outline" className="text-xs">{alert.source_module}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Device Information with Cross-Module Context */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Device Information</h4>
                <div className="space-y-3">
                  {/* Status field, as explicitly shown in outline */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Status:</span>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(device.status)}>{getStatusInfo(device.status).text}</Badge>
                      {crossModuleAlerts.length > 0 && (
                        <Badge variant="outline" className="text-xs text-red-600">
                          Under Review
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Other device info fields from original `details` array, adapted to new display style */}
                  {details.map(detail => (
                    <div key={detail.label} className="flex justify-between items-center">
                      <span className="text-slate-600">{detail.label}:</span>
                      <span className="font-semibold text-slate-900 capitalize">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Security Status */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Security Status</h4>
                <div className="space-y-3">
                  {/* Protection Level field, as explicitly shown in outline */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Protection Level:</span>
                    <Badge className={getProtectionColor(device.protection_level)}>
                      {device.protection_level}
                    </Badge>
                  </div>
                  {/* Threats Detected field, as explicitly shown in outline */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Threats Detected:</span>
                    <span className={`font-bold ${device.threats_detected > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {device.threats_detected || 0}
                    </span>
                  </div>
                  {/* Cross-Module Risk field, as explicitly shown in outline */}
                  {crossModuleAlerts.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Cross-Module Risk:</span>
                      <Badge variant="destructive">Elevated</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Keep existing actions section but enhance with cross-module context */}
            <CardFooter className="bg-slate-50/50 p-4 border-t mt-6 flex gap-2">
              <Button><Scan className="w-4 h-4 mr-2" /> Scan Now</Button>
              <Button variant="outline"><ShieldOff className="w-4 h-4 mr-2" /> Isolate Device</Button>
              <Button variant="destructive-outline"><PowerOff className="w-4 h-4 mr-2" /> Remove</Button>
            </CardFooter>
          </div>
        ) : (
          // Content when no device is selected
          <div className="text-center py-8">
            <Server className="w-12 h-12 text-slate-400 mx-auto mb-3" /> {/* Using Server icon for "No Device Selected" */}
            <h3 className="font-semibold text-slate-900 mb-1">No Device Selected</h3>
            <p className="text-slate-500">Select a device from the inventory to view details.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
