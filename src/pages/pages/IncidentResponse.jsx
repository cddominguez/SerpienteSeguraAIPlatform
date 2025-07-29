
import React, { useState, useEffect } from "react";
import { Incident } from "@/api/entities";
import { motion } from "framer-motion";
import IncidentStats from "../components/incidents/IncidentStats";
import IncidentList from "../components/incidents/IncidentList";
import IncidentDetails from "../components/incidents/IncidentDetails";
import AutomatedIncidentResponse from "../components/security/AutomatedIncidentResponse";

export default function IncidentResponse() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    if (incidents.length > 0 && !selectedIncident) {
      setSelectedIncident(incidents[0]);
    }
  }, [incidents, selectedIncident]);

  const loadIncidents = async () => {
    setIsLoading(true);
    const data = await Incident.list("-detection_time");
    setIncidents(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI-Powered Incident Response</h1>
          <p className="text-slate-600">Automated triage, investigation, and response management.</p>
        </motion.div>

        <IncidentStats incidents={incidents} />

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <IncidentList
              incidents={incidents}
              isLoading={isLoading}
              selectedIncident={selectedIncident}
              setSelectedIncident={setSelectedIncident}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <IncidentDetails
              incident={selectedIncident}
              isLoading={isLoading}
              refreshIncidents={loadIncidents}
            />
            <AutomatedIncidentResponse incidents={incidents} />
          </div>
        </div>
      </div>
    </div>
  );
}
