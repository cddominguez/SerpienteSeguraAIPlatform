import React, { useState, useEffect } from 'react';
import { Threat, Device, SecurityEvent } from '@/api/entities';
import StatCard from '@/components/dashboard/StatCard';
import SecurityScore from '@/components/dashboard/SecurityScore';
import ThreatTrendChart from '@/components/dashboard/ThreatTrendChart';
import RecentThreats from '@/components/dashboard/RecentThreats';
import SystemStatus from '@/components/dashboard/SystemStatus';
import AIPredictionPanel from '@/components/dashboard/AIPredictionPanel';
import AutomatedResponseCenter from '@/components/dashboard/AutomatedResponseCenter';
import AISecurityAssistant from '@/components/dashboard/AISecurityAssistant';
import { Shield, AlertTriangle, Users, Activity } from 'lucide-react';

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [devices, setDevices] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [threatsData, devicesData, eventsData] = await Promise.all([
        Threat.list('-created_date', 50),
        Device.list('-created_date', 50),
        SecurityEvent.list('-created_date', 100)
      ]);
      
      setThreats(threatsData);
      setDevices(devicesData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const stats = {
    totalThreats: threats.length,
    activeThreats: threats.filter(t => t.status === 'active').length,
    protectedDevices: devices.filter(d => d.status === 'protected').length,
    securityEvents: events.length
  };

  const securityScore = Math.round(
    ((stats.protectedDevices / Math.max(devices.length, 1)) * 50) +
    (Math.max(0, 100 - (stats.activeThreats * 10)) * 0.5)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            SerpienteSegura Security Dashboard
          </h1>
          <p className="text-slate-600">
            AI-powered cybersecurity platform protecting your digital assets
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Threats"
            value={stats.totalThreats}
            icon={AlertTriangle}
            isLoading={isLoading}
            change="+12% from last week"
            changeType="increase"
          />
          <StatCard
            title="Active Threats"
            value={stats.activeThreats}
            icon={Shield}
            isLoading={isLoading}
            change="-5% from yesterday"
            changeType="decrease"
          />
          <StatCard
            title="Protected Devices"
            value={stats.protectedDevices}
            icon={Users}
            isLoading={isLoading}
            change="+3 new devices"
            changeType="increase"
          />
          <StatCard
            title="Security Events"
            value={stats.securityEvents}
            icon={Activity}
            isLoading={isLoading}
            change="Normal activity"
            changeType="neutral"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ThreatTrendChart threats={threats} />
            <RecentThreats threats={threats} onRefresh={loadDashboardData} />
            <AutomatedResponseCenter threats={threats} onRefresh={loadDashboardData} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <SecurityScore score={securityScore} />
            <SystemStatus />
            <AIPredictionPanel threats={threats} events={events} />
            <AISecurityAssistant threats={threats} devices={devices} events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}