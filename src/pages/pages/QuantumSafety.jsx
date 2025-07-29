import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Shield, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { QuantumThreat } from '@/api/entities';

import QuantumThreatAssessment from '../components/quantum/QuantumThreatAssessment';
import CryptographicInventory from '../components/quantum/CryptographicInventory';
import MigrationPlanner from '../components/quantum/MigrationPlanner';
import QuantumReadinessScore from '../components/quantum/QuantumReadinessScore';

export default function QuantumSafety() {
  const [quantumThreats, setQuantumThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuantumData();
  }, []);

  const loadQuantumData = async () => {
    setIsLoading(true);
    try {
      const threats = await QuantumThreat.list();
      setQuantumThreats(threats || []);
    } catch (error) {
      console.error('Failed to load quantum threat data:', error);
      setQuantumThreats([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Zap className="w-10 h-10 text-yellow-600" />
            Quantum Safety Center
          </h1>
          <p className="text-slate-600">Prepare your cryptographic infrastructure for the quantum computing era</p>
        </motion.div>

        <QuantumReadinessScore threats={quantumThreats} isLoading={isLoading} />
        
        <Tabs defaultValue="assessment" className="w-full space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="assessment" 
                className="flex items-center gap-2 px-3 py-2 text-sm data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Assessment</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex items-center gap-2 px-3 py-2 text-sm data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="migration" 
                className="flex items-center gap-2 px-3 py-2 text-sm data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Migration</span>
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="flex items-center gap-2 px-3 py-2 text-sm data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-[600px]">
            <TabsContent value="assessment" className="mt-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <QuantumThreatAssessment threats={quantumThreats} isLoading={isLoading} refreshData={loadQuantumData} />
              </motion.div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CryptographicInventory threats={quantumThreats} isLoading={isLoading} />
              </motion.div>
            </TabsContent>

            <TabsContent value="migration" className="mt-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MigrationPlanner threats={quantumThreats} isLoading={isLoading} />
              </motion.div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-lg border-0 shadow-xl text-center"
              >
                <Clock className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Quantum Timeline</h3>
                <p className="text-slate-600 mb-6">Interactive timeline showing quantum computing milestones and migration deadlines</p>
                <div className="text-left max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold">2024: Assessment Phase</h4>
                      <p className="text-sm text-slate-600">Complete cryptographic inventory and vulnerability assessment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-yellow-50">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold">2025-2027: Migration Window</h4>
                      <p className="text-sm text-slate-600">Implement hybrid classical-quantum resistant systems</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <h4 className="font-semibold">2030+: Quantum Threat Reality</h4>
                      <p className="text-sm text-slate-600">Full quantum computers capable of breaking current encryption</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}