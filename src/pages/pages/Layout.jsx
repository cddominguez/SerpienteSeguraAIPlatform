
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Shield, BrainCircuit, Users, Network, FileCode, GitBranch, HardDrive, AlertTriangle, Settings, BookOpen, FileText, Database, Search, Briefcase, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DevSecOpsContextProvider } from './components/utils/ContextSharingService';
import TrialWrapper from './components/utils/TrialWrapper';
import { LanguageProvider, useLanguage } from './components/utils/LanguageProvider';
import { FeatureFlagProvider, useFeatureFlags } from './components/utils/FeatureFlagProvider';
import { User } from '@/api/entities';
import { add } from 'date-fns';
import AICompanion from './components/ai/AICompanion';
import { t } from './components/utils/i18n';

const navItems = [
  { name: 'dashboard', path: 'Dashboard', icon: Shield, featureFlag: 'basic_monitoring' },
  { name: 'executiveDashboard', path: 'ExecutiveDashboard', icon: Briefcase, featureFlag: 'executive_reporting' },
  { name: 'advancedAISecurityCenter', path: 'AISecurityCenter', icon: BrainCircuit, featureFlag: 'ai_security' },
  { name: 'threatHunting', path: 'ThreatHunting', icon: Search }, // Core feature
  { name: 'userSecurity', path: 'UserSecurity', icon: Users, featureFlag: 'behavioral_analytics' },
  { name: 'deviceManagement', path: 'DeviceManagement', icon: HardDrive }, // Core feature
  { name: 'networkSecurity', path: 'NetworkSecurity', icon: Network }, // Core feature
  { name: 'complianceCenter', path: 'ComplianceCenter', icon: FileText, featureFlag: 'compliance_full' },
  { name: 'web3Security', path: 'Web3Security', icon: FileCode, featureFlag: 'web3_security' },
  { name: 'dataSecurity', path: 'DataSecurity', icon: Database }, // Core feature
  { name: 'incidentResponse', path: 'IncidentResponse', icon: AlertTriangle, featureFlag: 'automated_response' },
  { name: 'devSecOps', path: 'DevSecOps', icon: GitBranch, featureFlag: 'devsecops' },
  { name: 'iotSecurity', path: 'IoTSecurity', icon: HardDrive, featureFlag: 'iot_security' },
  { name: 'quantumSafety', path: 'QuantumSafety', icon: Shield, featureFlag: 'quantum_safety' },
  { name: 'trainingCenter', path: 'TrainingCenter', icon: BookOpen }, // Core feature
  { name: 'settings', path: 'Settings', icon: Settings }, // Core feature
];

const NavLink = ({ item, currentPath, onClick }) => (
    <li>
        <Link to={createPageUrl(item.path)} onClick={onClick}>
            <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 p-3 my-1 rounded-lg transition-colors ${
                    currentPath === `/${item.path}` || (currentPath === '/' && item.path === 'Dashboard')
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{t(item.name)}</span>
            </motion.div>
        </Link>
    </li>
);

function LayoutContent({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { featureFlags } = useFeatureFlags();

  const currentPageName = navItems.find(item => `/${item.path}` === location.pathname)?.name || 
                        (location.pathname === '/' ? 'dashboard' : 
                         location.pathname.replace(/^\//, '') || 'dashboard');

  useEffect(() => {
    const activateTrialForNewUser = async () => {
      try {
        const currentUser = await User.me();
        if (currentUser && currentUser.license_tier === 'none' && !currentUser.trial_start_date) {
          const now = new Date();
          const trialEndDate = add(now, { days: 7 });
          
          await User.updateMyUserData({
            license_tier: 'trial',
            trial_start_date: now.toISOString(),
            trial_end_date: trialEndDate.toISOString(),
          });
          window.location.reload();
        }
      } catch (e) {
        // User not logged in, do nothing
      }
    };

    activateTrialForNewUser();
  }, []);

  if (location.pathname === '/Trial') {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
        <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600"/>
                <h1 className="text-xl font-bold text-slate-800">SerpienteSegura</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1">
                <X className="w-6 h-6 text-slate-600"/>
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
            <ul>
                {navItems.map((item) => 
                    (item.featureFlag === undefined || featureFlags[item.featureFlag]) && (
                      <NavLink key={item.name} item={item} currentPath={location.pathname} onClick={() => setIsSidebarOpen(false)} />
                    )
                )}
            </ul>
        </nav>
    </div>
  );

  return (
    <TrialWrapper>
      <DevSecOpsContextProvider>
        <div className="flex h-screen bg-slate-100">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 bg-white flex-shrink-0 p-4 border-r border-slate-200">
                <SidebarContent />
            </aside>
            
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
            {isSidebarOpen && (
                <motion.aside 
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 h-full w-64 bg-white z-50 p-4 border-r border-slate-200 lg:hidden"
                >
                    <SidebarContent />
                </motion.aside>
            )}
            </AnimatePresence>

          <main className="flex-1 flex flex-col overflow-y-auto">
            <header className="lg:hidden bg-white/80 backdrop-blur-sm p-4 border-b border-slate-200 flex items-center sticky top-0 z-30">
                <button onClick={() => setIsSidebarOpen(true)}>
                    <Menu className="w-6 h-6 text-slate-800" />
                </button>
                <div className="flex-grow text-center font-bold text-slate-800">
                    SerpienteSegura
                </div>
                <div className="w-6"></div> {/* Spacer */}
            </header>
            <div className="flex-1 p-4 md:p-6">
                {children}
            </div>
          </main>
          <AICompanion currentPageName={t(currentPageName)} />
        </div>
      </DevSecOpsContextProvider>
    </TrialWrapper>
  );
}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <FeatureFlagProvider>
        <LayoutContent>{children}</LayoutContent>
      </FeatureFlagProvider>
    </LanguageProvider>
  );
}
