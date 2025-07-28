
import React from "react";
import { motion } from "framer-motion";
import SecurityTrainingSimulator from "../components/resources/SecurityTrainingSimulator";
import DeveloperCommunityHub from "../components/resources/DeveloperCommunityHub";

export default function Resources() {
  // The documentation content provided in the outline.
  // This is embedded as a multi-line string within the component.
  const serpienteSeguraDocumentation = `
# SerpienteSegura Platform - Comprehensive Product Manager Documentation

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [Technical Architecture](#technical-architecture)
3. [Code Organization](#code-organization)
4. [Feature Documentation](#feature-documentation)
5. [Developer Onboarding Guide](#developer-onboarding-guide)
6. [Languages & Tools](#languages-tools)
7. [AI & Integrations](#ai-integrations)

---

## 3. Code Organization

This section provides a detailed file tree of the entire SerpienteSegura frontend application, designed to help developers quickly navigate the codebase.

\`\`\`
/
├── components/      # Reusable React components, organized by feature/domain.
│   ├── ai/           # Core AI and machine learning components.
│   │   ├── AIActionAuditLog.jsx
│   │   ├── AICompanion.jsx
│   │   ├── AIModelManagement.jsx
│   │   ├── AIModelPerformance.jsx
│   │   ├── AnomalyDetectionSystem.jsx
│   │   ├── BehavioralAnalytics.jsx
│   │   ├── ExplainableAIDecision.jsx
│   │   ├── FederatedLearningManager.jsx
│   │   ├── MLOpsMonitor.jsx
│   │   ├── PredictiveThreatIntelligence.jsx
│   │   └── ThreatPredictionEngine.jsx
│   │
│   ├── analytics/    # Components for data analytics and visualization.
│   │   ├── PredictiveRiskScoring.jsx
│   │   └── RealTimeAnalytics.jsx
│   │
│   ├── bridge/       # Components for cross-chain bridge security.
│   │   ├── BridgeMonitor.jsx
│   │   ├── BridgeRiskAssessment.jsx
│   │   ├── BridgeSecurityMonitor.jsx
│   │   ├── CrossChainIncidentResponse.jsx
│   │   ├── CrossChainValidator.jsx
│   │   └── InteroperabilitySecurityScanner.jsx
│   │
│   ├── client-compliance/ # Components for managing client-specific compliance.
│   │   ├── AutomatedComplianceDashboard.jsx
│   │   ├── ComplianceOnboarding.jsx
│   │   └── DataGovernanceCenter.jsx
│   │
│   ├── compliance/   # General compliance management components.
│   │   ├── AIRegulatoryIntelligence.jsx
│   │   ├── AuditTrail.jsx
│   │   ├── ComplianceOverview.jsx
│   │   ├── ComplianceReports.jsx
│   │   ├── ComplianceTrainingHub.jsx
│   │   ├── ExecutiveComplianceDashboard.jsx
│   │   ├── FrameworkManager.jsx
│   │   └── SecurityControls.jsx
│   │
│   ├── config/       # Configuration files for components.
│   │   └── integrations.js
│   │
│   ├── dashboard/    # Widgets and components for the main dashboard.
│   │   ├── AIPredictionPanel.jsx
│   │   ├── AISecurityAssistant.jsx
│   │   ├── AutomatedResponseCenter.jsx
│   │   ├── RecentThreats.jsx
│   │   ├── SecurityScore.jsx
│   │   ├── StatCard.jsx
│   │   ├── SystemStatus.jsx
│   │   └── ThreatTrendChart.jsx
│   │
│   ├── data-security/ # Components for data protection features.
│   │   ├── BackupManager.jsx
│   │   ├── DLPLog.jsx
│   │   └── EncryptionStatus.jsx
│   │
│   ├── defi/         # Components for Decentralized Finance (DeFi) security.
│   │   ├── DeFiGovernanceAnalysis.jsx
│   │   ├── DeFiProtocolAnalyzer.jsx
│   │   ├── DeFiRiskScoring.jsx
│   │   ├── LiquidityPoolMonitor.jsx
│   │   └── YieldFarmingSecurity.jsx
│   │
│   ├── devsecops/     # Components related to DevSecOps.
│   │   └── SupplyChainAnalyzer.jsx
│   │
│   ├── devices/      # Components for endpoint and device management.
│   │   ├── AIDeviceInsights.jsx
│   │   ├── DeviceAlerts.jsx
│   │   ├── DeviceDetails.jsx
│   │   ├── DeviceInventory.jsx
│   │   ├── DeviceList.jsx
│   │   ├── DeviceOverview.jsx
│   │   ├── DeviceStats.jsx
│   │   ├── DeviceToolbar.jsx
│   │   └── PolicyManagement.jsx
│   │
│   ├── encryption/   # Components for managing data encryption.
│   │   ├── DataClassificationEngine.jsx
│   │   ├── EncryptionOverview.jsx
│   │   ├── EncryptionPolicyManager.jsx
│   │   ├── KeyManagementSystem.jsx
│   │   └── QuantumReadyEncryption.jsx
│   │
│   ├── environments/ # Components for managing deployment environments.
│   │   ├── AIDeploymentAdvisor.jsx
│   │   ├── DeploymentHistoryTable.jsx
│   │   ├── DeploymentMap.jsx
│   │   ├── DeploymentPipelineView.jsx
│   │   └── EnvironmentsDashboard.jsx
│   │
│   ├── executive/    # Components for the Executive Dashboard.
│   │   ├── BusinessImpactPredictor.jsx
│   │   ├── ComplianceStatus.jsx
│   │   ├── IndustryBenchmark.jsx
│   │   ├── InvestmentBreakdown.jsx
│   │   ├── RiskOverview.jsx
│   │   ├── RiskScenarioModeler.jsx
│   │   ├── RiskTrendChart.jsx
│   │   └── SecurityROICalculator.jsx
│   │
│   ├── forensics/    # Components for digital forensics.
│   │   └── IncidentForensics.jsx
│   │
│   ├── hooks/        # Custom React hooks for shared logic.
│   │   ├── useAIModels.js
│   │   ├── useIntegrations.js
│   │   └── useWebSocket.js
│   │
│   ├── hunting/      # Components for threat hunting.
│   │   ├── BehavioralAnalyticsEngine.jsx
│   │   ├── CollaborativeHunting.jsx
│   │   ├── HuntingDashboard.jsx
│   │   ├── HuntingQueryBuilder.jsx
│   │   ├── InvestigationGraph.jsx
│   │   └── ThreatHuntingWorkbench.jsx
│   │
│   ├── incidents/    # Components for incident response management.
│   │   ├── IncidentDetails.jsx
│   │   ├── IncidentList.jsx
│   │   └── IncidentStats.jsx
│   │
│   ├── integrations/ # Components for managing third-party integrations.
│   │   ├── IntegrationCard.jsx
│   │   ├── IntegrationDashboard.jsx
│   │   └── IntegrationWizard.jsx
│   │
│   ├── intelligence/ # Components for threat intelligence.
│   │   ├── CyberNewsFeed.jsx
│   │   ├── DarkWebMonitor.jsx
│   │   └── ThreatIntelligenceFusion.jsx
│   │
│   ├── mev/          # Components for Maximum Extractable Value (MEV) protection.
│   │   ├── FlashLoanMonitor.jsx
│   │   ├── MempoolAnalyzer.jsx
│   │   ├── MEVAnalytics.jsx
│   │   ├── MEVDetectionEngine.jsx
│   │   └── MEVProtectionStrategies.jsx
│   │
│   ├── network/      # Components for network security monitoring.
│   │   ├── AutomatedPenTest.jsx
│   │   ├── FirewallManager.jsx
│   │   ├── IDSLog.jsx
│   │   ├── NetworkStats.jsx
│   │   ├── RealtimeTrafficChart.jsx
│   │   ├── RealTimeVisitorMonitor.jsx
│   │   ├── ThreatIntelligencePanel.jsx
│   │   ├── VisitorAuditTrail.jsx
│   │   └── VulnerabilityPrioritizer.jsx
│   │
│   ├── offensive/    # Components for offensive security measures.
│   │   ├── AutomatedPenetrationTesting.jsx
│   │   └── CounterAttackModule.jsx
│   │
│   ├── quantum/      # Components for Quantum Safety features.
│   │   ├── CryptographicInventory.jsx
│   │   ├── MigrationPlanner.jsx
│   │   ├── QuantumReadinessScore.jsx
│   │   └── QuantumThreatAssessment.jsx
│   │
│   ├── resources/    # Components for the Training Center and resources.
│   │   ├── DeveloperCommunityHub.jsx
│   │   └── SecurityTrainingSimulator.jsx
│   │
│   ├── security/     # General security components.
│   │   ├── AutomatedIncidentResponse.jsx
│   │   ├── vulnerability/
│   │   │   ├── ComplianceMapper.jsx
│   │   │   ├── ContainerSecurityScanner.jsx
│   │   │   ├── GitOpsIntegration.jsx
│   │   │   ├── PerformanceImpactAnalyzer.jsx
│   │   │   ├── PredictiveAnalytics.jsx
│   │   │   ├── RemediationOrchestrator.jsx
│   │   │   └── ThreatIntelligence.jsx
│   │   ├── VulnerabilityManagementDashboard.jsx
│   │   └── ZeroTrustValidator.jsx
│   │
│   ├── settings/     # Components for the Settings page.
│   │   ├── BrandingSettings.jsx
│   │   ├── CompanySettings.jsx
│   │   ├── DeveloperSettings.jsx
│   │   ├── FederatedLearningSettings.jsx
│   │   ├── IntegrationsSettings.jsx
│   │   ├── LicensingSettings.jsx
│   │   ├── LocalizationSettings.jsx
│   │   ├── NotificationSettings.jsx
│   │   ├── SecurityPolicySettings.jsx
│   │   └── UserManagementSettings.jsx
│   │
│   ├── threats/      # Components for threat detection and management.
│   │   ├── RealtimeMonitor.jsx
│   │   ├── ThreatDetails.jsx
│   │   ├── ThreatFilters.jsx
│   │   ├── ThreatList.jsx
│   │   └── ThreatOverview.jsx
│   │
│   ├── training/     # Components related to user training.
│   │   └── AdaptiveSecurityTraining.jsx
│   │
│   ├── user-security/ # Components for user identity and access management.
│   │   ├── AccessControlManager.jsx
│   │   ├── AdaptiveMFADashboard.jsx
│   │   ├── BehaviorAnalytics.jsx
│   │   ├── RiskBasedAuthenticator.jsx
│   │   ├── ThreatIntelligence.jsx
│   │   ├── UserActivityMonitor.jsx
│   │   └── UserSecurityOverview.jsx
│   │
│   ├── utils/        # Shared utilities, providers, and helpers.
│   │   ├── ContextSharingService.jsx
│   │   ├── FeatureFlagProvider.jsx
│   │   ├── i18n.js
│   │   ├── LanguageProvider.jsx
│   │   └── TrialWrapper.jsx
│   │
│   ├── voice/        # Components for voice command functionality.
│   │   └── VoiceCommandCenter.jsx
│   │
│   └── web3/         # High-level components for Web3 security features.
│       ├── BridgeMonitor.jsx
│       ├── ContractAuditReports.jsx
│       ├── ContractDeploymentSecurity.jsx
│       ├── ContractMonitoring.jsx
│       ├── ContractVulnerabilityScanner.jsx
│       ├── DecentralizedSecurityNetwork.jsx
│       ├── DeFiRiskAssessor.jsx
│       ├── InteroperabilityHub.jsx
│       ├── MEVProtectionDashboard.jsx
│       ├── SmartContractAnalyzer.jsx
│       ├── SmartContractGovernance.jsx
│       └── Web3SecuritySuite.jsx
│
├── entities/        # JSON schema definitions for all data models (database tables).
│   ├── AccessPolicy.json
│   ├── AIActionAudit.json
│   ├── AIModel.json
│   ├── AuditLog.json
│   ├── BackupJob.json
│   ├── ComplianceCheck.json
│   ├── ComplianceFramework.json
│   ├── ComplianceProfile.json
│   ├── ComplianceTask.json
│   ├── ConsentRecord.json
│   ├── DataInventory.json
│   ├── Deployment.json
│   ├── Device.json
│   ├── DeviceAlert.json
│   ├── DevicePolicy.json
│   ├── DLPEvent.json
│   ├── DoraMetrics.json
│   ├── ExecutiveSummary.json
│   ├── FirewallRule.json
│   ├── GeoThreat.json
│   ├── HuntingAnnotation.json
│   ├── Incident.json
│   ├── IoTDevice.json
│   ├── NewsItem.json
│   ├── OffensiveAction.json
│   ├── OTIncident.json
│   ├── QuantumThreat.json
|   ├── RealTimeVisitor.json
│   ├── SBOMComponent.json
│   ├── SecurityControl.json
│   ├── SecurityEvent.json
│   ├── Threat.json
│   ├── ThreatIntelligence.json
│   ├── User.json
│   ├── UserActivity.json
│   ├── UserRiskProfile.json
│   ├── VisitorAuditLog.json
│   └── VoiceCommand.json
│
├── pages/           # Top-level page components, each corresponding to a main route.
│   ├── AISecurityCenter.js
│   ├── ClientCompliance.js
│   ├── ComplianceCenter.js
│   ├── CrossChainSecurity.js
│   ├── Dashboard.js
│   ├── DataEncryptionCenter.js
│   ├── DataSecurity.js
│   ├── DeFiSecurityAnalysis.js
│   ├── DevSecOps.js
│   ├── DeviceManagement.js
│   ├── ExecutiveDashboard.js
│   ├── IncidentResponse.js
│   ├── IntegrationHub.js
│   ├── IoTSecurity.js
│   ├── MEVProtection.js
│   ├── NetworkSecurity.js
│   ├── QuantumSafety.js
│   ├── Resources.js
│   ├── Settings.js
│   ├── SmartContractSecurity.js
│   ├── ThreatDetection.js
│   ├── ThreatHunting.js
│   ├── TrainingCenter.js
│   ├── Trial.js
│   ├── UserSecurity.js
│   └── Web3Security.js
│
└── layout.jsx       # The main layout wrapper for the application, includes sidebar and top navigation.

\`\`\`

---
`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Resources & Training</h1>
          <p className="text-slate-600">Empower your team and engage with the developer community.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <SecurityTrainingSimulator />
            </motion.div>
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <DeveloperCommunityHub />
            </motion.div>
        </div>

        {/* New section for the detailed documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">SerpienteSegura Platform Documentation</h2>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md overflow-x-auto border border-gray-200">
            {serpienteSeguraDocumentation}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
