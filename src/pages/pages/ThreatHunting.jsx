import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Target, Users, Brain, FileText, Activity } from 'lucide-react';
import { Threat } from '@/api/entities';
import { UserActivity } from '@/api/entities';
import { Device } from '@/api/entities';
import { HuntingAnnotation } from '@/api/entities';
import { User } from '@/api/entities';

import ThreatHuntingWorkbench from '../components/hunting/ThreatHuntingWorkbench';
import InvestigationGraph from '../components/hunting/InvestigationGraph';
import BehavioralAnalyticsEngine from '../components/hunting/BehavioralAnalyticsEngine';
import HuntingQueryBuilder from '../components/hunting/HuntingQueryBuilder';
import CollaborativeHunting from '../components/hunting/CollaborativeHunting';
import HuntingDashboard from '../components/hunting/HuntingDashboard';

export default function ThreatHunting() {
  const [threats, setThreats] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [devices, setDevices] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeInvestigation, setActiveInvestigation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHuntingData();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadHuntingData = async () => {
    setIsLoading(true);
    try {
      const [threatsData, activityData, devicesData, annotationsData] = await Promise.all([
        Threat.list('-created_date', 100),
        UserActivity.list('-created_date', 200),
        Device.list(),
        HuntingAnnotation.list('-created_date')
      ]);
      
      setThreats(threatsData || []);
      setUserActivity(activityData || []);
      setDevices(devicesData || []);
      setAnnotations(annotationsData || []);
    } catch (error) {
      console.error('Error loading hunting data:', error);
      setThreats([]);
      setUserActivity([]);
      setDevices([]);
      setAnnotations([]);
    }
    setIsLoading(false);
  };

  const createInvestigation = (name, description) => {
    const newInvestigation = {
      id: `inv-${Date.now()}`,
      name,
      description,
      created_by: currentUser?.email || 'analyst@company.com',
      created_date: new Date().toISOString(),
      status: 'active'
    };
    setActiveInvestigation(newInvestigation);
    return newInvestigation;
  };

  const addAnnotation = async (nodeId, annotation) => {
    if (!activeInvestigation || !currentUser) return;
    
    try {
      const newAnnotation = await HuntingAnnotation.create({
        investigation_id: activeInvestigation.id,
        node_id: nodeId,
        annotation: annotation,
        analyst_email: currentUser.email
      });
      
      setAnnotations(prev => [newAnnotation, ...prev]);
      return newAnnotation;
    } catch (error) {
      console.error('Error adding annotation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Search className="w-10 h-10 text-purple-600" />
            Advanced Threat Hunting
          </h1>
          <p className="text-slate-600">Interactive workbench with behavioral analytics and collaborative investigation tools</p>
        </motion.div>

        <HuntingDashboard 
          threats={threats}
          userActivity={userActivity}
          devices={devices}
          activeInvestigation={activeInvestigation}
          isLoading={isLoading}
        />
        
        <Tabs defaultValue="workbench" className="w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm overflow-x-auto">
            <TabsList className="w-full min-w-max flex bg-transparent gap-1 p-0">
              <TabsTrigger value="workbench" className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                <Target className="w-4 h-4" />
                <span>Hunting Workbench</span>
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                <Activity className="w-4 h-4" />
                <span>Investigation Graph</span>
              </TabsTrigger>
              <TabsTrigger value="behavioral" className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                <Brain className="w-4 h-4" />
                <span>Behavioral Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="query" className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                <Search className="w-4 h-4" />
                <span>Query Builder</span>
              </TabsTrigger>
              <TabsTrigger value="collaborative" className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                <Users className="w-4 h-4" />
                <span>Collaborative</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-[600px] mt-6">
            <TabsContent value="workbench" className="mt-0">
              <ThreatHuntingWorkbench
                threats={threats}
                userActivity={userActivity}
                devices={devices}
                isLoading={isLoading}
                onCreateInvestigation={createInvestigation}
                activeInvestigation={activeInvestigation}
                refreshData={loadHuntingData}
              />
            </TabsContent>

            <TabsContent value="graph" className="mt-0">
              <InvestigationGraph
                threats={threats}
                userActivity={userActivity}
                devices={devices}
                annotations={annotations}
                activeInvestigation={activeInvestigation}
                onAddAnnotation={addAnnotation}
                currentUser={currentUser}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="behavioral" className="mt-0">
              <BehavioralAnalyticsEngine
                userActivity={userActivity}
                devices={devices}
                threats={threats}
                isLoading={isLoading}
                refreshData={loadHuntingData}
              />
            </TabsContent>

            <TabsContent value="query" className="mt-0">
              <HuntingQueryBuilder
                threats={threats}
                userActivity={userActivity}
                devices={devices}
                onQueryExecute={loadHuntingData}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="collaborative" className="mt-0">
              <CollaborativeHunting
                annotations={annotations}
                activeInvestigation={activeInvestigation}
                onAddAnnotation={addAnnotation}
                currentUser={currentUser}
                onCreateInvestigation={createInvestigation}
                refreshAnnotations={loadHuntingData}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}