import React, { useState, useEffect } from 'react';
import { Incident } from '@/api/entities';
import IncidentStats from '@/components/incidents/IncidentStats';
import IncidentList from '@/components/incidents/IncidentList';
import IncidentDetails from '@/components/incidents/IncidentDetails';
import AutomatedIncidentResponse from '@/components/security/AutomatedIncidentResponse';
import SOAROrchestrator from '@/components/automation/SOAROrchestrator';
import IncidentForensics from '@/components/forensics/IncidentForensics';

export default function IncidentResponse() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidentData();
  }, []);

  const loadIncidentData = async () => {
    setIsLoading(true);
    try {
      const incidentsData = await Incident.list('-detection_time', 50);
      setIncidents(incidentsData);
      if (incidentsData.length > 0 && !selectedIncident) {
        setSelectedIncident(incidentsData[0]);
      }
    } catch (error) {
      console.error('Error loading incident data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Incident Response Center
          </h1>
          <p className="text-slate-600">
            Automated incident detection, response, and forensics
          </p>
        </div>

        {/* Incident Stats */}
        <IncidentStats incidents={incidents} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incident List */}
          <div>
            <IncidentList
              incidents={incidents}
              isLoading={isLoading}
              selectedIncident={selectedIncident}
              setSelectedIncident={setSelectedIncident}
            />
          </div>

          {/* Incident Details */}
          <div className="lg:col-span-2">
            <IncidentDetails
              incident={selectedIncident}
              isLoading={isLoading}
              refreshIncidents={loadIncidentData}
            />
          </div>
        </div>

        {/* Automated Response */}
        <AutomatedIncidentResponse incidents={incidents} />

        {/* SOAR Orchestrator */}
        <SOAROrchestrator threats={[]} />

        {/* Forensics */}
        <IncidentForensics events={[]} threats={[]} />
      </div>
    </div>
  );
}