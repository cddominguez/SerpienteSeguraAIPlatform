import React, { useState, useEffect } from 'react';
import { QuantumThreat } from '@/api/entities';
import QuantumReadinessScore from '@/components/quantum/QuantumReadinessScore';
import CryptographicInventory from '@/components/quantum/CryptographicInventory';
import QuantumThreatAssessment from '@/components/quantum/QuantumThreatAssessment';
import MigrationPlanner from '@/components/quantum/MigrationPlanner';

export default function QuantumSafety() {
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuantumData();
  }, []);

  const loadQuantumData = async () => {
    setIsLoading(true);
    try {
      const threatsData = await QuantumThreat.list('-created_date', 50);
      setThreats(threatsData);
    } catch (error) {
      console.error('Error loading quantum data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Quantum Safety Center
          </h1>
          <p className="text-slate-600">
            Prepare for the quantum computing era with post-quantum cryptography
          </p>
        </div>

        {/* Quantum Readiness Score */}
        <QuantumReadinessScore threats={threats} isLoading={isLoading} />

        {/* Cryptographic Inventory */}
        <CryptographicInventory threats={threats} isLoading={isLoading} />

        {/* Threat Assessment */}
        <QuantumThreatAssessment 
          threats={threats} 
          isLoading={isLoading} 
          refreshData={loadQuantumData} 
        />

        {/* Migration Planner */}
        <MigrationPlanner threats={threats} isLoading={isLoading} />
      </div>
    </div>
  );
}