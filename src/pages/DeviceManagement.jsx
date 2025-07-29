import React, { useState, useEffect } from 'react';
import { Device, DeviceAlert } from '@/api/entities';
import DeviceOverview from '@/components/devices/DeviceOverview';
import DeviceInventory from '@/components/devices/DeviceInventory';
import DeviceDetails from '@/components/devices/DeviceDetails';
import DeviceAlerts from '@/components/devices/DeviceAlerts';
import PolicyManagement from '@/components/devices/PolicyManagement';
import AIDeviceInsights from '@/components/devices/AIDeviceInsights';

export default function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeviceData();
  }, []);

  const loadDeviceData = async () => {
    setIsLoading(true);
    try {
      const [devicesData, alertsData] = await Promise.all([
        Device.list('-created_date', 100),
        DeviceAlert.list('-created_date', 50)
      ]);
      
      setDevices(devicesData);
      setAlerts(alertsData);
      
      // Mock policies data
      setPolicies([
        {
          id: 1,
          name: 'Corporate Device Security Policy',
          type: 'security',
          description: 'Standard security requirements for all corporate devices',
          is_active: true,
          compliance_score: 95,
          target_devices: ['desktop', 'laptop', 'mobile']
        }
      ]);
    } catch (error) {
      console.error('Error loading device data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Device Management Center
          </h1>
          <p className="text-slate-600">
            Comprehensive device security and compliance management
          </p>
        </div>

        {/* Device Overview */}
        <DeviceOverview 
          devices={devices} 
          alerts={alerts} 
          isLoading={isLoading} 
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Inventory */}
          <div className="lg:col-span-2">
            <DeviceInventory
              devices={devices}
              isLoading={isLoading}
              refreshDevices={loadDeviceData}
            />
          </div>

          {/* Device Details */}
          <div>
            <DeviceDetails
              device={selectedDevice}
              isLoading={isLoading}
              onUpdate={loadDeviceData}
            />
          </div>
        </div>

        {/* Device Alerts */}
        <DeviceAlerts
          alerts={alerts}
          devices={devices}
          isLoading={isLoading}
          refreshAlerts={loadDeviceData}
        />

        {/* AI Insights */}
        <AIDeviceInsights
          devices={devices}
          alerts={alerts}
          isLoading={isLoading}
        />

        {/* Policy Management */}
        <PolicyManagement
          policies={policies}
          devices={devices}
          isLoading={isLoading}
          refreshPolicies={loadDeviceData}
        />
      </div>
    </div>
  );
}