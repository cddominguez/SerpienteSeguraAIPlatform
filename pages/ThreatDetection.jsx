import React, { useState, useEffect } from "react";
import { Threat } from "@/api/entities";
import { SecurityEvent } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Search, Download, Shield } from "lucide-react";
import { motion } from "framer-motion";

import ThreatOverview from "../components/threats/ThreatOverview";
import ThreatList from "../components/threats/ThreatList";
import ThreatDetails from "../components/threats/ThreatDetails";
import ThreatFilters from "../components/threats/ThreatFilters";
import RealtimeMonitor from "../components/threats/RealtimeMonitor";

export default function ThreatDetection() {
  const [threats, setThreats] = useState([]);
  const [filteredThreats, setFilteredThreats] = useState([]);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [threatsData, eventsData] = await Promise.all([
      Threat.list("-created_date"),
      SecurityEvent.list("-created_date", 50)
    ]);
    setThreats(threatsData);
    setFilteredThreats(threatsData);
    setSecurityEvents(eventsData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Threat Detection & Intelligence</h1>
            <p className="text-slate-600">Real-time monitoring and advanced threat analysis</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Shield className="w-4 h-4 mr-2" />
              Run Deep Scan
            </Button>
          </div>
        </motion.div>

        <ThreatOverview threats={threats} isLoading={isLoading} />
        
        <RealtimeMonitor securityEvents={securityEvents} isLoading={isLoading} />
        
        <ThreatFilters threats={threats} setFilteredThreats={setFilteredThreats} />

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <ThreatList 
              threats={filteredThreats} 
              isLoading={isLoading}
              selectedThreat={selectedThreat}
              setSelectedThreat={setSelectedThreat}
            />
          </div>
          <div className="lg:col-span-2">
            <ThreatDetails 
              threat={selectedThreat} 
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}