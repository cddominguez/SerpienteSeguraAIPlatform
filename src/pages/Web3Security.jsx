import React from 'react';
import MEVProtectionDashboard from '@/components/web3/MEVProtectionDashboard';
import BridgeMonitor from '@/components/web3/BridgeMonitor';
import DeFiRiskAssessor from '@/components/web3/DeFiRiskAssessor';

export default function Web3Security() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Web3 Security Center
          </h1>
          <p className="text-slate-600">
            Advanced DeFi and blockchain security monitoring
          </p>
        </div>

        {/* MEV Protection */}
        <MEVProtectionDashboard />

        {/* Bridge Monitoring */}
        <BridgeMonitor />

        {/* DeFi Risk Assessment */}
        <DeFiRiskAssessor />
      </div>
    </div>
  );
}