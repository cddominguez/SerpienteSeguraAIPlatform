import React, { useState, useEffect } from 'react';
import { AIModel, AIActionAudit } from '@/api/entities';
import AIModelManagement from '@/components/ai/AIModelManagement';
import AIModelPerformance from '@/components/ai/AIModelPerformance';
import BehavioralAnomalyDetector from '@/components/ai/BehavioralAnomalyDetector';
import ThreatPredictionML from '@/components/ai/ThreatPredictionML';
import ExplainableAIDecision from '@/components/ai/ExplainableAIDecision';
import AIActionAuditLog from '@/components/ai/AIActionAuditLog';
import FederatedLearningManager from '@/components/ai/FederatedLearningManager';
import MLOpsMonitor from '@/components/ai/MLOpsMonitor';

export default function AISecurityCenter() {
  const [models, setModels] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    setIsLoading(true);
    try {
      const [modelsData, auditData] = await Promise.all([
        AIModel.list('-created_date', 20),
        AIActionAudit.list('-created_date', 50)
      ]);
      
      setModels(modelsData);
      setAuditLogs(auditData);
    } catch (error) {
      console.error('Error loading AI data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            AI Security Center
          </h1>
          <p className="text-slate-600">
            Advanced AI-powered threat detection and response
          </p>
        </div>

        {/* AI Model Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIModelManagement 
            models={models} 
            isLoading={isLoading} 
            refreshModels={loadAIData} 
          />
          <AIModelPerformance models={models} isLoading={isLoading} />
        </div>

        {/* Behavioral Analytics */}
        <BehavioralAnomalyDetector />

        {/* Threat Prediction */}
        <ThreatPredictionML />

        {/* Federated Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FederatedLearningManager />
          <MLOpsMonitor models={models} isLoading={isLoading} />
        </div>

        {/* AI Audit Trail */}
        <AIActionAuditLog auditLogs={auditLogs} isLoading={isLoading} />
      </div>
    </div>
  );
}