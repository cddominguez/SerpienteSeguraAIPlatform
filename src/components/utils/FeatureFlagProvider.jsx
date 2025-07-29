import React, { createContext, useContext, useState } from 'react';

const FeatureFlagContext = createContext();

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  return context;
};

export const FeatureFlagProvider = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState({
    // Core features (always enabled)
    basic_monitoring: true,
    
    // Advanced features
    ai_security: true,
    behavioral_analytics: true,
    automated_response: true,
    compliance_full: true,
    web3_security: true,
    devsecops: true,
    iot_security: true,
    quantum_safety: true,
    executive_reporting: true,
    
    // Enterprise features
    white_label: false,
    advanced_analytics: true,
    custom_integrations: true
  });

  const toggleFeatureFlag = (flagName) => {
    setFeatureFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const isFeatureEnabled = (flagName) => {
    return featureFlags[flagName] || false;
  };

  return (
    <FeatureFlagContext.Provider value={{ featureFlags, toggleFeatureFlag, isFeatureEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};