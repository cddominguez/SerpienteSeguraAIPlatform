import React, { useState, useEffect } from 'react';
import { Threat, UserActivity, Device, HuntingAnnotation } from '@/api/entities';
import HuntingDashboard from '@/components/hunting/HuntingDashboard';
import ThreatHuntingWorkbench from '@/components/hunting/ThreatHuntingWorkbench';
import BehavioralAnalyticsEngine from '@/components/hunting/BehavioralAnalyticsEngine';
import HuntingQueryBuilder from '@/components/hunting/HuntingQueryBuilder';
import CollaborativeHunting from '@/components/hunting/CollaborativeHunting';
import InvestigationGraph from '@/components/hunting/InvestigationGraph';

export default function ThreatHunting() {
  const [threats, setThreats] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [devices, setDevices] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [activeInvestigation, setActiveInvestigation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHuntingData();
  }, []);

  const loadHuntingData = async () => {
    setIsLoading(true);
    try {
      const [threatsData, activityData, devicesData, annotationsData] = await Promise.all([
        Threat.list('-created_date', 100),
        UserActivity.list('-created_date', 200),
        Device.list('-created_date', 50),
        HuntingAnnotation.list('-created_date', 50)
      ]);
      
      setThreats(threatsData);
      setUserActivity(activityData);
      setDevices(devicesData);
      setAnnotations(annotationsData);
    } catch (error) {
      console.error('Error loading hunting data:', error);
    }
    setIsLoading(false);
  };

  const handleCreateInvestigation = async (name, description) => {
    if (!name) {
      setActiveInvestigation(null);
      return;
    }

    const investigation = {
      id: Date.now().toString(),
      name,
      description,
      created_by: 'current_user@company.com',
      created_date: new Date().toISOString()
    };
    
    setActiveInvestigation(investigation);
    return investigation;
  };

  const handleAddAnnotation = async (investigationId, annotation) => {
    const newAnnotation = {
      id: Date.now().toString(),
      investigation_id: investigationId,
      annotation,
      analyst_email: 'current_user@company.com',
      created_date: new Date().toISOString()
    };
    
    setAnnotations(prev => [newAnnotation, ...prev]);
  };

  // Mock graph data for investigation
  const graphData = {
    nodes: [
      { id: 'user1', label: 'john.doe@company.com', type: 'user' },
      { id: 'device1', label: 'LAPTOP-001', type: 'device' },
      { id: 'threat1', label: 'Suspicious Login', type: 'threat' }
    ],
    edges: [
      { from: 'user1', to: 'device1' },
      { from: 'device1', to: 'threat1' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Threat Hunting Center
          </h1>
          <p className="text-slate-600">
            Proactive threat detection and investigation platform
          </p>
        </div>

        {/* Dashboard Overview */}
        <HuntingDashboard 
          threats={threats}
          userActivity={userActivity}
          devices={devices}
          activeInvestigation={activeInvestigation}
          isLoading={isLoading}
        />

        {/* Hunting Workbench */}
        <ThreatHuntingWorkbench
          threats={threats}
          userActivity={userActivity}
          devices={devices}
          isLoading={isLoading}
          onCreateInvestigation={handleCreateInvestigation}
          activeInvestigation={activeInvestigation}
          refreshData={loadHuntingData}
        />

        {/* Query Builder */}
        <HuntingQueryBuilder
          threats={threats}
          userActivity={userActivity}
          devices={devices}
          isLoading={isLoading}
        />

        {/* Behavioral Analytics */}
        <BehavioralAnalyticsEngine
          userActivity={userActivity}
          devices={devices}
          onAnomalyDetected={(anomalies) => console.log('Anomalies detected:', anomalies)}
        />

        {/* Collaborative Hunting */}
        <CollaborativeHunting
          annotations={annotations}
          activeInvestigation={activeInvestigation}
          onAddAnnotation={handleAddAnnotation}
          currentUser={{ email: 'current_user@company.com' }}
          onCreateInvestigation={handleCreateInvestigation}
          refreshAnnotations={loadHuntingData}
        />

        {/* Investigation Graph */}
        {activeInvestigation && (
          <InvestigationGraph
            graphData={graphData}
            investigationId={activeInvestigation.id}
          />
        )}
      </div>
    </div>
  );
}