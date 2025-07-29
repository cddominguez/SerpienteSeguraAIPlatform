import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Shield, CheckCircle, Clock, AlertCircle, Zap, Cloud, DollarSign } from 'lucide-react';
import IntegrationCard from '../components/integrations/IntegrationCard';
import IntegrationWizard from '../components/integrations/IntegrationWizard';
import IntegrationDashboard from '../components/integrations/IntegrationDashboard';
import { useIntegrations } from '@/components/hooks/useIntegrations';

export default function IntegrationHub() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [showWizard, setShowWizard] = useState(false);
    
    const { integrations, activeIntegrations, loadIntegrations, connectIntegration } = useIntegrations();

    // Integration categories
    const categories = [
        { id: 'all', name: 'All Integrations', icon: Zap },
        { id: 'iam', name: 'Identity & Access', icon: Shield },
        { id: 'compliance', name: 'Compliance & GRC', icon: CheckCircle },
        { id: 'devops', name: 'DevOps & CI/CD', icon: Clock },
        { id: 'monitoring', name: 'Monitoring & SIEM', icon: AlertCircle },
        { id: 'cloud', name: 'Cloud Infrastructure', icon: Cloud },
        { id: 'billing', name: 'Billing & CRM', icon: DollarSign }
    ];

    useEffect(() => {
        loadIntegrations();
    }, []);

    const filteredIntegrations = integrations.filter(integration => {
        const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            integration.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-8xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Integration Hub</h1>
                    <p className="text-slate-600">Connect your security tools and streamline your workflow</p>
                </motion.div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Available Integrations"
                        value={integrations.length}
                        icon={Zap}
                        color="blue"
                    />
                    <StatCard
                        title="Active Integrations"
                        value={activeIntegrations.length}
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatCard
                        title="Pending Setup"
                        value={integrations.filter(i => i.status === 'pending').length}
                        icon={Clock}
                        color="yellow"
                    />
                    <StatCard
                        title="Failed Connections"
                        value={integrations.filter(i => i.status === 'error').length}
                        icon={AlertCircle}
                        color="red"
                    />
                </div>

                {/* Integration Dashboard */}
                <IntegrationDashboard activeIntegrations={activeIntegrations} />

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search integrations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <category.icon className="w-4 h-4" />
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Integration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredIntegrations.map((integration, index) => (
                        <IntegrationCard
                            key={integration.id}
                            integration={integration}
                            delay={index * 0.05}
                            onConnect={() => {
                                setSelectedIntegration(integration);
                                setShowWizard(true);
                            }}
                        />
                    ))}
                </div>

                {/* Integration Setup Wizard */}
                {showWizard && selectedIntegration && (
                    <IntegrationWizard
                        integration={selectedIntegration}
                        onClose={() => {
                            setShowWizard(false);
                            setSelectedIntegration(null);
                        }}
                        onComplete={(config) => {
                            connectIntegration(selectedIntegration.id, config);
                            setShowWizard(false);
                            setSelectedIntegration(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </motion.div>
    );
};