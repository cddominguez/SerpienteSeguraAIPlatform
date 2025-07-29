import React, { createContext, useContext, useState, useCallback } from 'react';
import { InvokeLLM } from '@/api/integrations';

// Context for sharing data between DevSecOps modules
const DevSecOpsContext = createContext();

export const useDevSecOpsContext = () => {
  const context = useContext(DevSecOpsContext);
  if (!context) {
    throw new Error('useDevSecOpsContext must be used within DevSecOpsContextProvider');
  }
  return context;
};

export const DevSecOpsContextProvider = ({ children }) => {
  const [sharedContext, setSharedContext] = useState({
    activeThreats: [],
    ongoingDeployments: [],
    vulnerabilityFindings: [],
    correlatedEvents: []
  });

  const updateContext = useCallback((action, data) => {
    setSharedContext(prev => {
      switch (action) {
        case 'UPDATE_THREATS':
          return { ...prev, activeThreats: data };
        case 'UPDATE_DEPLOYMENTS':
          return { ...prev, ongoingDeployments: data };
        case 'UPDATE_VULNERABILITIES':
          return { ...prev, vulnerabilityFindings: data };
        case 'UPDATE_AI_INSIGHTS':
          return { ...prev, aiInsights: data };
        default:
          return prev;
      }
    });
  }, []);

  const correlateEvents = useCallback(async (events) => {
    try {
      const response = await InvokeLLM({
        prompt: `Correlate these security events with existing context: ${JSON.stringify(events)}`,
        response_json_schema: {
          type: "object",
          properties: {
            correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  correlation_type: { type: "string" },
                  confidence: { type: "number" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      updateContext('UPDATE_CORRELATIONS', response.correlations);
    } catch (error) {
      console.error('Event correlation failed:', error);
    }
  }, [updateContext]);

  return (
    <DevSecOpsContext.Provider value={{ sharedContext, updateContext, correlateEvents }}>
      {children}
    </DevSecOpsContext.Provider>
  );
};

// Legacy context sharing service for backward compatibility
class ContextSharingService {
  static moduleContexts = new Map();
  static subscribers = new Map();

  static registerModuleContext(moduleName, context) {
    this.moduleContexts.set(moduleName, context);
    this.notifySubscribers(moduleName, context);
  }

  static subscribe(moduleName, callback) {
    if (!this.subscribers.has(moduleName)) {
      this.subscribers.set(moduleName, []);
    }
    this.subscribers.get(moduleName).push(callback);
    
    return () => {
      const callbacks = this.subscribers.get(moduleName);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  static notifySubscribers(moduleName, context) {
    const callbacks = this.subscribers.get(moduleName);
    if (callbacks) {
      callbacks.forEach(callback => callback(moduleName, context));
    }
  }

  static async validateThreat(threat, sourceModule) {
    try {
      const response = await InvokeLLM({
        prompt: `Validate this threat with cross-module context: ${JSON.stringify(threat)}`,
        response_json_schema: {
          type: "object",
          properties: {
            is_legitimate: { type: "boolean" },
            confidence_score: { type: "number" },
            false_positive_probability: { type: "number" },
            recommended_action: { type: "string" },
            supporting_evidence: { type: "array", items: { type: "string" } },
            contradicting_evidence: { type: "array", items: { type: "string" } },
            correlation_summary: { type: "string" }
          }
        }
      });
      return response;
    } catch (error) {
      console.error('Threat validation failed:', error);
      return null;
    }
  }
}

export default ContextSharingService;