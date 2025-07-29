import { useState, useEffect } from 'react';
import { INTEGRATIONS_CONFIG } from '@/components/config/integrations.config';

export function useIntegrations() {
    const [integrations, setIntegrations] = useState([]);
    const [activeIntegrations, setActiveIntegrations] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadIntegrations = () => {
        setLoading(true);
        
        // Convert config to integration list with status
        const integrationList = Object.entries(INTEGRATIONS_CONFIG).map(([key, config]) => ({
            id: key,
            key,
            ...config,
            status: getRandomStatus(), // Simulate different statuses
            lastSync: getRandomDate(),
            health: getRandomHealth()
        }));

        setIntegrations(integrationList);
        setActiveIntegrations(integrationList.filter(i => i.status === 'connected'));
        setLoading(false);
    };

    const connectIntegration = async (integrationKey, config) => {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update integration status
        setIntegrations(prev => prev.map(integration => 
            integration.key === integrationKey 
                ? { ...integration, status: 'connected', config, lastSync: new Date().toISOString() }
                : integration
        ));
        
        // Update active integrations
        setActiveIntegrations(prev => {
            const integration = integrations.find(i => i.key === integrationKey);
            if (integration && !prev.find(i => i.key === integrationKey)) {
                return [...prev, { ...integration, status: 'connected', config }];
            }
            return prev;
        });
        
        setLoading(false);
        return { success: true };
    };

    const disconnectIntegration = async (integrationKey) => {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIntegrations(prev => prev.map(integration => 
            integration.key === integrationKey 
                ? { ...integration, status: 'available' }
                : integration
        ));
        
        setActiveIntegrations(prev => prev.filter(i => i.key !== integrationKey));
        
        setLoading(false);
        return { success: true };
    };

    const testIntegration = async (integrationKey, config) => {
        setLoading(true);
        
        // Simulate connection test
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setLoading(false);
        
        // Random success/failure for demo
        const success = Math.random() > 0.3;
        return { 
            success, 
            message: success ? 'Connection successful!' : 'Connection failed. Please check your credentials.' 
        };
    };

    const syncIntegration = async (integrationKey) => {
        setLoading(true);
        
        // Simulate sync
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIntegrations(prev => prev.map(integration => 
            integration.key === integrationKey 
                ? { ...integration, lastSync: new Date().toISOString() }
                : integration
        ));
        
        setLoading(false);
        return { success: true };
    };

    // Helper functions for demo data
    const getRandomStatus = () => {
        const statuses = ['available', 'connected', 'pending', 'error'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // More likely to be available or connected
        
        const random = Math.random();
        let sum = 0;
        
        for (let i = 0; i < statuses.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                return statuses[i];
            }
        }
        
        return 'available';
    };

    const getRandomDate = () => {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        return date.toISOString();
    };

    const getRandomHealth = () => {
        const healths = ['healthy', 'warning', 'error'];
        const weights = [0.7, 0.2, 0.1];
        
        const random = Math.random();
        let sum = 0;
        
        for (let i = 0; i < healths.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                return healths[i];
            }
        }
        
        return 'healthy';
    };

    return {
        integrations,
        activeIntegrations,
        loading,
        loadIntegrations,
        connectIntegration,
        disconnectIntegration,
        testIntegration,
        syncIntegration
    };
}