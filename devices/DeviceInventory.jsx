import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Smartphone, Monitor, Laptop, Tablet, Server, Router, Search, Scan, Lock, Trash2, ShieldCheck, RefreshCw, Download } from "lucide-react";
import { format } from 'date-fns';
import { Device } from '@/api/entities';
import { motion } from 'framer-motion';

export default function DeviceInventory({ devices = [], isLoading, refreshDevices }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [actioningDevice, setActioningDevice] = useState(null);

  const getDeviceIcon = (type) => ({
    desktop: Monitor, laptop: Laptop, mobile: Smartphone, tablet: Tablet, server: Server, router: Router
  }[type] || Smartphone);

  const getStatusColor = (status) => ({
    protected: "bg-emerald-100 text-emerald-800",
    at_risk: "bg-amber-100 text-amber-800",
    compromised: "bg-red-100 text-red-800",
    online: "bg-blue-100 text-blue-800",
    offline: "bg-slate-100 text-slate-800",
  }[status] || "bg-slate-100 text-slate-800");

  const getTrustScoreColor = (score) => {
    if (!score && score !== 0) return 'text-slate-500';
    if (score > 80) return 'text-emerald-600';
    if (score > 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleDeviceAction = async (device, action) => {
    setActioningDevice(device.id);
    try {
      let updateData = {};
      
      switch (action) {
        case 'scan':
          updateData = { 
            last_scan: new Date().toISOString(),
            status: device.threats_detected > 0 ? 'at_risk' : 'protected'
          };
          break;
        case 'isolate':
          updateData = { status: 'offline' };
          break;
        case 'delete':
          await Device.delete(device.id);
          if (refreshDevices) refreshDevices();
          return;
        default:
          break;
      }
      
      if (Object.keys(updateData).length > 0) {
        await Device.update(device.id, updateData);
        if (refreshDevices) refreshDevices();
      }
    } catch (error) {
      console.error('Error performing device action:', error);
    } finally {
      setActioningDevice(null);
    }
  };

  const exportDeviceList = () => {
    const csv = devices.map(device => [
      device.name,
      device.device_type,
      device.operating_system,
      device.os_version,
      device.ip_address,
      device.status,
      device.trust_score || 'N/A',
      device.threats_detected
    ].join(',')).join('\n');
    
    const blob = new Blob([`Name,Type,OS,Version,IP,Status,Trust Score,Threats\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         device.ip_address.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesType = typeFilter === "all" || device.device_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Device Inventory</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{filteredDevices.length} of {devices.length} devices</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="protected">Protected</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="compromised">Compromised</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="server">Server</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportDeviceList}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={refreshDevices} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Device</th>
                <th className="text-left p-4 font-semibold text-slate-700">Trust Score</th>
                <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                <th className="text-left p-4 font-semibold text-slate-700">IP Address</th>
                <th className="text-left p-4 font-semibold text-slate-700">OS Version</th>
                <th className="text-left p-4 font-semibold text-slate-700">Threats</th>
                <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.device_type);
                const isActioning = actioningDevice === device.id;
                
                return (
                  <motion.tr 
                    key={device.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <DeviceIcon className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900">{device.name}</p>
                          <p className="text-sm text-slate-500 capitalize">{device.device_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1 font-semibold ${getTrustScoreColor(device.trust_score)}`}>
                        <ShieldCheck className="w-4 h-4" />
                        {device.trust_score !== null && device.trust_score !== undefined ? `${device.trust_score}%` : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(device.status)} variant="secondary">
                        {device.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-sm">{device.ip_address}</td>
                    <td className="p-4 text-sm">
                      <p>{device.operating_system} {device.os_version}</p>
                      <p className="text-xs text-slate-500">Patch: {device.patch_level}</p>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${device.threats_detected > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {device.threats_detected}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeviceAction(device, 'scan')}
                          disabled={isActioning}
                          title="Scan Device"
                        >
                          <Scan className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={isActioning}
                              title="Isolate Device"
                            >
                              <Lock className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Isolate Device?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will isolate "{device.name}" from the network. The device will be taken offline immediately.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeviceAction(device, 'isolate')}>
                                Isolate Device
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              disabled={isActioning}
                              title="Remove Device"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Device?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{device.name}" from the inventory? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeviceAction(device, 'delete')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove Device
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredDevices.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">No devices found</h3>
              <p className="text-slate-500">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your search filters" 
                  : "No devices have been enrolled yet"
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}