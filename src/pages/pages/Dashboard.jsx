import React, { useState, useEffect } from "react";
import { Threat } from "@/api/entities";
import { Device } from "@/api/entities";
import { SecurityEvent } from "@/api/entities";
import { motion } from "framer-motion";
import { Shield, AlertCircle, Clock, Server, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import StatCard from "../components/dashboard/StatCard";
import SecurityScore from "../components/dashboard/SecurityScore";
import ThreatTrendChart from "../components/dashboard/ThreatTrendChart";
import RecentThreats from "../components/dashboard/RecentThreats";
import SystemStatus from "../components/dashboard/SystemStatus";
import AIPredictionPanel from "../components/dashboard/AIPredictionPanel";
import AISecurityAssistant from "../components/dashboard/AISecurityAssistant";
import AutomatedResponseCenter from "../components/dashboard/AutomatedResponseCenter";

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [devices, setDevices] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [threatsData, devicesData, eventsData] = await Promise.all([
        Threat.list("-created_date"),
        Device.list(),
        SecurityEvent.list("-created_date", 100),
      ]);
      setThreats(threatsData || []);
      setDevices(devicesData || []);
      setEvents(eventsData || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set empty arrays to prevent crashes
      setThreats([]);
      setDevices([]);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSpecificData = async (type) => {
    try {
      switch (type) {
        case 'threats':
          const newThreats = await Threat.list("-created_date");
          setThreats(newThreats || []);
          break;
        case 'devices':
          const newDevices = await Device.list();
          setDevices(newDevices || []);
          break;
        case 'events':
          const newEvents = await SecurityEvent.list("-created_date", 100);
          setEvents(newEvents || []);
          break;
      }
    } catch (error) {
      console.error(`Error refreshing ${type}:`, error);
    }
  };

  const stats = {
    activeThreats: threats.filter(t => t.status === 'active').length,
    protectedDevices: devices.filter(d => d.status === 'protected').length,
    eventsToday: events.filter(e => new Date(e.created_date) > new Date().setHours(0,0,0,0)).length,
    atRiskDevices: devices.filter(d => d.status === 'at_risk' || d.status === 'compromised').length,
  };

  const securityScore = Math.max(0, 95 - stats.activeThreats * 5 - stats.atRiskDevices * 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Security Dashboard</h1>
            <p className="text-slate-600">Welcome back. Here's a real-time overview of your security posture.</p>
            <p className="text-xs text-slate-500 mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
          </div>
          <Button onClick={loadData} disabled={isLoading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh All'}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Threats" 
            value={stats.activeThreats} 
            icon={AlertCircle} 
            change={`${stats.activeThreats > 0 ? '+' : ''}${stats.activeThreats} new`} 
            changeType={stats.activeThreats > 0 ? "increase" : "stable"} 
            isLoading={isLoading}
            onRefresh={() => refreshSpecificData('threats')}
          />
          <StatCard 
            title="Protected Devices" 
            value={stats.protectedDevices} 
            icon={Shield} 
            change={`${devices.length} total`} 
            changeType="stable" 
            isLoading={isLoading}
            onRefresh={() => refreshSpecificData('devices')}
          />
          <StatCard 
            title="Security Events (24h)" 
            value={stats.eventsToday} 
            icon={Clock} 
            change="vs last 24h" 
            changeType="stable" 
            isLoading={isLoading}
            onRefresh={() => refreshSpecificData('events')}
          />
          <StatCard 
            title="At-Risk Devices" 
            value={stats.atRiskDevices} 
            icon={Server} 
            change={`${stats.atRiskDevices > 0 ? 'Needs attention' : 'All secure'}`} 
            changeType={stats.atRiskDevices > 0 ? "increase" : "stable"} 
            isLoading={isLoading}
            onRefresh={() => refreshSpecificData('devices')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ThreatTrendChart threats={threats} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SecurityScore score={securityScore} />
          </motion.div>
        </div>
        
        {/* AI Enhanced Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AIPredictionPanel threats={threats} events={events} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AISecurityAssistant threats={threats} devices={devices} events={events} />
          </motion.div>
        </div>

        {/* Automated Response Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AutomatedResponseCenter threats={threats} onRefresh={loadData} />
        </motion.div>
        
        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <RecentThreats threats={threats.slice(0, 10)} onRefresh={loadData} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <SystemStatus />
          </motion.div>
        </div>
      </div>
    </div>
  );
}