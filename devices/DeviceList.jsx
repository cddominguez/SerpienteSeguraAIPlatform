import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Monitor, Laptop, Tablet, Server, Router, CheckCircle, AlertTriangle, ShieldOff, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeviceList({ devices, isLoading, selectedDevice, setSelectedDevice }) {
  const getDeviceIcon = (type) => ({
    desktop: Monitor, laptop: Laptop, mobile: Smartphone, tablet: Tablet, server: Server, router: Router
  }[type] || Smartphone);

  const getStatusInfo = (status) => ({
    protected: { icon: CheckCircle, color: "text-emerald-600" },
    at_risk: { icon: AlertTriangle, color: "text-amber-600" },
    compromised: { icon: ShieldOff, color: "text-red-600" },
    online: { icon: CheckCircle, color: "text-blue-600" },
    offline: { icon: WifiOff, color: "text-slate-500" },
  }[status] || { icon: WifiOff, color: "text-slate-500" });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">All Devices ({devices.length})</CardTitle>
      </CardHeader>
      <CardContent className="h-[600px] overflow-y-auto pr-2">
        <div className="space-y-3">
          <AnimatePresence>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : (
              devices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.device_type);
                const StatusIcon = getStatusInfo(device.status).icon;
                const statusColor = getStatusInfo(device.status).color;

                return (
                  <motion.div
                    key={device.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedDevice(device)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedDevice?.id === device.id ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <DeviceIcon className="w-6 h-6 text-slate-500" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{device.name}</h3>
                        <p className="text-sm text-slate-500">{device.ip_address}</p>
                      </div>
                      <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}