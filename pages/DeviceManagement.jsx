import React, { useState, useEffect } from "react";
import { Device } from "@/api/entities";
import { DevicePolicy } from "@/api/entities";
import { DeviceAlert } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Shield, Settings, AlertTriangle, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

import DeviceOverview from "../components/devices/DeviceOverview";
import DeviceInventory from "../components/devices/DeviceInventory";
import PolicyManagement from "../components/devices/PolicyManagement";
import DeviceAlerts from "../components/devices/DeviceAlerts";
import AIDeviceInsights from "../components/devices/AIDeviceInsights";

export default function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [devicesData, policiesData, alertsData] = await Promise.all([
      Device.list("-created_date"),
      DevicePolicy.list("-created_date"),
      DeviceAlert.list("-created_date")
    ]);
    setDevices(devicesData);
    setPolicies(policiesData);
    setAlerts(alertsData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Device Management</h1>
            <p className="text-slate-600">Centralized AI-powered device security and management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Enroll Device
            </Button>
          </div>
        </motion.div>

        <DeviceOverview devices={devices} alerts={alerts} isLoading={isLoading} />
        
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="inventory">
              <Shield className="w-4 h-4 mr-2" /> Inventory
            </TabsTrigger>
            <TabsTrigger value="policies">
              <Settings className="w-4 h-4 mr-2" /> Policies
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="w-4 h-4 mr-2" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart3 className="w-4 h-4 mr-2" /> AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <DeviceInventory devices={devices} isLoading={isLoading} refreshDevices={loadData} />
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <PolicyManagement policies={policies} devices={devices} isLoading={isLoading} refreshPolicies={loadData} />
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <DeviceAlerts alerts={alerts} devices={devices} isLoading={isLoading} refreshAlerts={loadData} />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <AIDeviceInsights devices={devices} alerts={alerts} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}