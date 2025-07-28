import React, { useState, useEffect } from 'react';
import { IoTDevice } from '@/api/entities';
import { OTIncident } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Shield, AlertTriangle, Activity, Search, Filter, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function IoTSecurity() {
  const [devices, setDevices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [devicesData, incidentsData] = await Promise.all([
        IoTDevice.list('-last_security_scan'),
        OTIncident.list('-created_date')
      ]);
      setDevices(devicesData || []);
      setIncidents(incidentsData || []);
    } catch (error) {
      console.error("Failed to load IoT security data:", error);
    }
    setIsLoading(false);
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.device_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.operational_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const summary = React.useMemo(() => {
    const total = devices.length;
    const critical = devices.filter(d => d.security_level === 'critical').length;
    const vulnerable = devices.filter(d => d.vulnerabilities_count > 0).length;
    const offline = devices.filter(d => d.operational_status === 'offline').length;
    const avgAnomalyScore = devices.reduce((sum, d) => sum + (d.anomaly_score || 0), 0) / (devices.length || 1);
    return { total, critical, vulnerable, offline, avgAnomalyScore };
  }, [devices]);

  const deviceTypeData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.device_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: device.device_type, value: 1 });
    }
    return acc;
  }, []);

  const securityLevelData = devices.reduce((acc, device) => {
    const existing = acc.find(item => item.name === device.security_level);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: device.security_level, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  const getSecurityBadge = (level) => {
    const variants = {
      critical: <Badge variant="destructive">Critical</Badge>,
      high: <Badge className="bg-orange-500 text-white">High</Badge>,
      medium: <Badge className="bg-yellow-500 text-white">Medium</Badge>,
      low: <Badge className="bg-emerald-500 text-white">Low</Badge>
    };
    return variants[level] || <Badge variant="outline">{level}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      operational: <Badge className="bg-emerald-500 text-white">Operational</Badge>,
      maintenance: <Badge className="bg-yellow-500 text-white">Maintenance</Badge>,
      offline: <Badge variant="destructive">Offline</Badge>,
      error: <Badge variant="destructive">Error</Badge>
    };
    return variants[status] || <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-transparent p-0 md:p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">IoT/OT Security Center</h1>
          </div>
          <p className="text-slate-600">Monitor and secure Industrial IoT devices and Operational Technology systems</p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Network className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{summary.total}</div>
              <p className="text-xs text-blue-600">IoT/OT assets monitored</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Assets</CardTitle>
              <Shield className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{summary.critical}</div>
              <p className="text-xs text-red-600">High security priority</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vulnerable</CardTitle>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{summary.vulnerable}</div>
              <p className="text-xs text-orange-600">With known vulnerabilities</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomaly Score</CardTitle>
              <Activity className="w-4 h-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-700">{summary.avgAnomalyScore.toFixed(1)}</div>
              <p className="text-xs text-slate-600">Average behavioral anomaly</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices">Device Inventory</TabsTrigger>
            <TabsTrigger value="incidents">OT Incidents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="protocols">Protocol Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>IoT/OT Device Inventory</CardTitle>
                    <CardDescription>Comprehensive view of all industrial and IoT devices</CardDescription>
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
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="operational">Operational</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="offline">Offline</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Device</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Protocol</th>
                        <th className="text-left p-3">Security Level</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Vulnerabilities</th>
                        <th className="text-left p-3">Anomaly Score</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevices.map((device) => (
                        <tr key={device.id} className="border-b hover:bg-slate-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{device.device_name}</p>
                              <p className="text-sm text-slate-500">{device.network_segment}</p>
                            </div>
                          </td>
                          <td className="p-3 capitalize">{device.device_type}</td>
                          <td className="p-3 uppercase">{device.protocol}</td>
                          <td className="p-3">{getSecurityBadge(device.security_level)}</td>
                          <td className="p-3">{getStatusBadge(device.operational_status)}</td>
                          <td className="p-3">
                            <span className={device.vulnerabilities_count > 0 ? 'text-red-600 font-medium' : 'text-emerald-600'}>
                              {device.vulnerabilities_count}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`font-medium ${
                              device.anomaly_score > 70 ? 'text-red-600' : 
                              device.anomaly_score > 40 ? 'text-orange-600' : 'text-emerald-600'
                            }`}>
                              {device.anomaly_score?.toFixed(1) || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>OT Security Incidents</CardTitle>
                <CardDescription>Operational Technology security events and responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold capitalize">{incident.incident_type.replace('_', ' ')}</h4>
                          <p className="text-sm text-slate-600">Device: {incident.affected_device_id}</p>
                        </div>
                        <div className="flex gap-2">
                          {getSecurityBadge(incident.severity)}
                          <Badge variant="outline" className="capitalize">
                            {incident.impact_assessment.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-2">
                        <p><strong>Detection:</strong> {incident.detection_method.replace('_', ' ')}</p>
                        {incident.root_cause && <p><strong>Root Cause:</strong> {incident.root_cause}</p>}
                        {incident.response_actions && incident.response_actions.length > 0 && (
                          <div>
                            <strong>Response Actions:</strong>
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {incident.response_actions.map((action, i) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Device Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {deviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Security Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={securityLevelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Industrial Protocol Analysis</CardTitle>
                <CardDescription>Security assessment of industrial communication protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['modbus', 'dnp3', 'opcua', 'bacnet', 'ethernet_ip'].map(protocol => {
                    const protocolDevices = devices.filter(d => d.protocol === protocol);
                    const vulnerableCount = protocolDevices.filter(d => d.vulnerabilities_count > 0).length;
                    return (
                      <div key={protocol} className="p-4 border rounded-lg">
                        <h4 className="font-semibold uppercase mb-2">{protocol}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Devices:</span>
                            <span className="font-medium">{protocolDevices.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vulnerable:</span>
                            <span className={`font-medium ${vulnerableCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              {vulnerableCount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security Score:</span>
                            <span className="font-medium">
                              {protocolDevices.length > 0 ? 
                                ((protocolDevices.length - vulnerableCount) / protocolDevices.length * 100).toFixed(0) + '%' : 
                                'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}