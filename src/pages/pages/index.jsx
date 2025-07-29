import Layout from "./Layout.jsx";

import DeviceManagement from "./DeviceManagement";

import NetworkSecurity from "./NetworkSecurity";

import UserSecurity from "./UserSecurity";

import IncidentResponse from "./IncidentResponse";

import Settings from "./Settings";

import AISecurityCenter from "./AISecurityCenter";

import Dashboard from "./Dashboard";

import ThreatDetection from "./ThreatDetection";

import ComplianceCenter from "./ComplianceCenter";

import ClientCompliance from "./ClientCompliance";

import SmartContractSecurity from "./SmartContractSecurity";

import MEVProtection from "./MEVProtection";

import CrossChainSecurity from "./CrossChainSecurity";

import DeFiSecurityAnalysis from "./DeFiSecurityAnalysis";

import DataEncryptionCenter from "./DataEncryptionCenter";

import DevSecOps from "./DevSecOps";

import Resources from "./Resources";

import TrainingCenter from "./TrainingCenter";

import IntegrationHub from "./IntegrationHub";

import Web3Security from "./Web3Security";

import DataSecurity from "./DataSecurity";

import Trial from "./Trial";

import ThreatHunting from "./ThreatHunting";

import ExecutiveDashboard from "./ExecutiveDashboard";

import QuantumSafety from "./QuantumSafety";

import IoTSecurity from "./IoTSecurity";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    DeviceManagement: DeviceManagement,
    
    NetworkSecurity: NetworkSecurity,
    
    UserSecurity: UserSecurity,
    
    IncidentResponse: IncidentResponse,
    
    Settings: Settings,
    
    AISecurityCenter: AISecurityCenter,
    
    Dashboard: Dashboard,
    
    ThreatDetection: ThreatDetection,
    
    ComplianceCenter: ComplianceCenter,
    
    ClientCompliance: ClientCompliance,
    
    SmartContractSecurity: SmartContractSecurity,
    
    MEVProtection: MEVProtection,
    
    CrossChainSecurity: CrossChainSecurity,
    
    DeFiSecurityAnalysis: DeFiSecurityAnalysis,
    
    DataEncryptionCenter: DataEncryptionCenter,
    
    DevSecOps: DevSecOps,
    
    Resources: Resources,
    
    TrainingCenter: TrainingCenter,
    
    IntegrationHub: IntegrationHub,
    
    Web3Security: Web3Security,
    
    DataSecurity: DataSecurity,
    
    Trial: Trial,
    
    ThreatHunting: ThreatHunting,
    
    ExecutiveDashboard: ExecutiveDashboard,
    
    QuantumSafety: QuantumSafety,
    
    IoTSecurity: IoTSecurity,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<DeviceManagement />} />
                
                
                <Route path="/DeviceManagement" element={<DeviceManagement />} />
                
                <Route path="/NetworkSecurity" element={<NetworkSecurity />} />
                
                <Route path="/UserSecurity" element={<UserSecurity />} />
                
                <Route path="/IncidentResponse" element={<IncidentResponse />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/AISecurityCenter" element={<AISecurityCenter />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/ThreatDetection" element={<ThreatDetection />} />
                
                <Route path="/ComplianceCenter" element={<ComplianceCenter />} />
                
                <Route path="/ClientCompliance" element={<ClientCompliance />} />
                
                <Route path="/SmartContractSecurity" element={<SmartContractSecurity />} />
                
                <Route path="/MEVProtection" element={<MEVProtection />} />
                
                <Route path="/CrossChainSecurity" element={<CrossChainSecurity />} />
                
                <Route path="/DeFiSecurityAnalysis" element={<DeFiSecurityAnalysis />} />
                
                <Route path="/DataEncryptionCenter" element={<DataEncryptionCenter />} />
                
                <Route path="/DevSecOps" element={<DevSecOps />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/TrainingCenter" element={<TrainingCenter />} />
                
                <Route path="/IntegrationHub" element={<IntegrationHub />} />
                
                <Route path="/Web3Security" element={<Web3Security />} />
                
                <Route path="/DataSecurity" element={<DataSecurity />} />
                
                <Route path="/Trial" element={<Trial />} />
                
                <Route path="/ThreatHunting" element={<ThreatHunting />} />
                
                <Route path="/ExecutiveDashboard" element={<ExecutiveDashboard />} />
                
                <Route path="/QuantumSafety" element={<QuantumSafety />} />
                
                <Route path="/IoTSecurity" element={<IoTSecurity />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}