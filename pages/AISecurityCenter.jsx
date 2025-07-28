import React, { useState, useEffect } from 'react';
import { Threat } from '@/api/entities';
import { AIModel } from '@/api/entities';
import { AIActionAudit } from '@/api/entities';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

// Components for the new layout
import AIModelPerformance from '../components/ai/AIModelPerformance';
import FederatedLearningManager from '../components/ai/FederatedLearningManager';
import AIActionAuditLog from '../components/ai/AIActionAuditLog';
import AnomalyDetectionSystem from '../components/ai/AnomalyDetectionSystem';
import MLOpsMonitor from '../components/ai/MLOpsMonitor';
import PredictiveThreatIntelligence from '../components/ai/PredictiveThreatIntelligence';

export default function AISecurityCenter() {
  const [threats, setThreats] = useState([]);
  const [aiModels, setAiModels] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [threatsData, modelsData, logsData] = await Promise.all([
        Threat.list('-created_date', 50),
        AIModel.list(),
        AIActionAudit.list('-created_date', 20)
      ]);
      setThreats(threatsData);
      setAiModels(modelsData);
      setAuditLogs(logsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <BrainCircuit className="w-10 h-10 text-blue-600" />
            Advanced AI Security Center
          </h1>
          <p className="text-slate-600">Monitor, manage, and analyze the platform's AI security models.</p>
        </motion.div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <PredictiveThreatIntelligence />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <AnomalyDetectionSystem />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <FederatedLearningManager />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AIModelPerformance models={aiModels} isLoading={isLoading} />
            <MLOpsMonitor models={aiModels} isLoading={isLoading} />
            <AIActionAuditLog auditLogs={auditLogs} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}