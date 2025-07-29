import React, { useState, useEffect } from 'react';
import { FirewallRule, ThreatIntelligence, VulnerabilityScan, RealTimeVisitor } from '@/api/entities';
import NetworkStats from '@/components/network/NetworkStats';
import FirewallManager from '@/components/network/FirewallManager';
import IDSLog from '@/components/network/IDSLog';
import RealtimeTrafficChart from '@/components/network/RealtimeTrafficChart';
import ThreatIntelligencePanel from '@/components/network/ThreatIntelligencePanel';
import VulnerabilityPrioritizer from '@/components/network/VulnerabilityPrioritizer';
import AutomatedPenTest from '@/components/network/AutomatedPenTest';
import RealTimeVisitorMonitor from '@/components/network/RealTimeVisitorMonitor';
import VisitorAuditTrail from '@/components/network/VisitorAuditTrail';

export default function NetworkSecurity() {
  const [firewallRules, setFirewallRules] = useState([]);
  const [threatIntel, setThreatIntel] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    setIsLoading(true);
    try {
      const [rulesData, intelData, vulnData] = await Promise.all([
        FirewallRule.list('-created_date', 50),
        ThreatIntelligence.list('-created_date', 30),
        VulnerabilityScan.list('-created_date', 20)
      ]);
      
      setFirewallRules(rulesData);
      setThreatIntel(intelData);
      setVulnerabilities(vulnData);
    } catch (error) {
      console.error('Error loading network data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Network Security Center
          </h1>
          <p className="text-slate-600">
            Advanced network protection and monitoring
          </p>
        </div>

        {/* Network Stats */}
        <NetworkStats rules={firewallRules} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RealtimeTrafficChart />
          <IDSLog />
        </div>

        {/* Firewall Management */}
        <FirewallManager
          initialRules={firewallRules}
          isLoading={isLoading}
          refreshRules={loadNetworkData}
        />

        {/* Threat Intelligence */}
        <ThreatIntelligencePanel />

        {/* Vulnerability Management */}
        <VulnerabilityPrioritizer />

        {/* Penetration Testing */}
        <AutomatedPenTest />

        {/* Visitor Monitoring */}
        <RealTimeVisitorMonitor />

        {/* Visitor Audit Trail */}
        <VisitorAuditTrail />
      </div>
    </div>
  );
}