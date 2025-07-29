import React, { useState, useEffect } from 'react';
import { Deployment } from '@/api/entities';
import { DoraMetrics } from '@/api/entities';
import { VulnerabilityScan } from '@/api/entities';
import { ComplianceCheck } from '@/api/entities';
import { SBOMComponent } from '@/api/entities';
import { GitBranch, Shield, Activity, BarChart, Clock, Package } from 'lucide-react';
import { motion } from 'framer-motion';

import EnvironmentsDashboard from '../components/environments/EnvironmentsDashboard';
import DeploymentPipelineView from '../components/environments/DeploymentPipelineView';
import DeploymentHistoryTable from '../components/environments/DeploymentHistoryTable';
import AIDeploymentAdvisor from '../components/environments/AIDeploymentAdvisor';
import SupplyChainAnalyzer from '../components/devsecops/SupplyChainAnalyzer';

export default function DevSecOps() {
  const [deployments, setDeployments] = useState([]);
  const [doraMetrics, setDoraMetrics] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [complianceChecks, setComplianceChecks] = useState([]);
  const [sbomComponents, setSbomComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [depData, doraData, vulnData, checkData, sbomData] = await Promise.all([
        Deployment.list('-start_time'),
        DoraMetrics.list('-date'),
        VulnerabilityScan.list(),
        ComplianceCheck.list(),
        SBOMComponent.list(),
      ]);
      setDeployments(depData || []);
      setDoraMetrics(doraData || []);
      setVulnerabilities(vulnData || []);
      setComplianceChecks(checkData || []);
      setSbomComponents(sbomData || []);
    } catch (error) {
      console.error("Failed to load DevSecOps data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-transparent p-0 md:p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-900">DevSecOps Cockpit</h1>
          </div>
          <p className="text-slate-600">Integrate security into every stage of your development lifecycle.</p>
        </motion.div>

        <EnvironmentsDashboard 
          deployments={deployments} 
          doraMetrics={doraMetrics} 
          isLoading={isLoading} 
        />
        
        <DeploymentPipelineView
          deployments={deployments}
          vulnerabilities={vulnerabilities}
          complianceChecks={complianceChecks}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DeploymentHistoryTable deployments={deployments} isLoading={isLoading} />
          </div>
          <div>
            <AIDeploymentAdvisor deployments={deployments} vulnerabilities={vulnerabilities} />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SupplyChainAnalyzer components={sbomComponents} isLoading={isLoading} />
        </motion.div>

      </div>
    </div>
  );
}