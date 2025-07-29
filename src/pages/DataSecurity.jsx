import React, { useState, useEffect } from 'react';
import { BackupJob, DLPEvent, DataInventory } from '@/api/entities';
import BackupManager from '@/components/data-security/BackupManager';
import DLPLog from '@/components/data-security/DLPLog';
import EncryptionStatus from '@/components/data-security/EncryptionStatus';
import DataClassificationEngine from '@/components/encryption/DataClassificationEngine';
import EncryptionPolicyManager from '@/components/encryption/EncryptionPolicyManager';
import KeyManagementSystem from '@/components/encryption/KeyManagementSystem';
import QuantumReadyEncryption from '@/components/encryption/QuantumReadyEncryption';

export default function DataSecurity() {
  const [backupJobs, setBackupJobs] = useState([]);
  const [dlpEvents, setDlpEvents] = useState([]);
  const [dataInventory, setDataInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDataSecurityData();
  }, []);

  const loadDataSecurityData = async () => {
    setIsLoading(true);
    try {
      const [backupsData, dlpData, inventoryData] = await Promise.all([
        BackupJob.list('-created_date', 20),
        DLPEvent.list('-created_date', 50),
        DataInventory.list('-created_date', 100)
      ]);
      
      setBackupJobs(backupsData);
      setDlpEvents(dlpData);
      setDataInventory(inventoryData);
    } catch (error) {
      console.error('Error loading data security data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Data Security Center
          </h1>
          <p className="text-slate-600">
            Comprehensive data protection and encryption management
          </p>
        </div>

        {/* Data Protection Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BackupManager backupJobs={backupJobs} isLoading={isLoading} />
          <DLPLog dlpEvents={dlpEvents} isLoading={isLoading} />
          <EncryptionStatus isLoading={isLoading} />
        </div>

        {/* Data Classification */}
        <DataClassificationEngine />

        {/* Encryption Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EncryptionPolicyManager />
          <KeyManagementSystem />
        </div>

        {/* Quantum-Ready Encryption */}
        <QuantumReadyEncryption />
      </div>
    </div>
  );
}