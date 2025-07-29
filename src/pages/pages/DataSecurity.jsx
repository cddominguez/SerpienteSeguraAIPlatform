import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Database, Shield } from "lucide-react";
import { BackupJob } from "@/api/entities";
import { DLPEvent } from "@/api/entities";

import EncryptionStatus from "../components/data-security/EncryptionStatus";
import BackupManager from "../components/data-security/BackupManager";
import DLPLog from "../components/data-security/DLPLog";

export default function DataSecurity() {
  const [backupJobs, setBackupJobs] = useState([]);
  const [dlpEvents, setDlpEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [jobs, events] = await Promise.all([
      BackupJob.list("-created_date"),
      DLPEvent.list("-created_date")
    ]);
    setBackupJobs(jobs);
    setDlpEvents(events);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Data Security</h1>
          <p className="text-slate-600">Secure your traditional data with encryption, backups, and data loss prevention.</p>
        </motion.div>
        
        <Tabs defaultValue="encryption" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="encryption">
              <Lock className="w-4 h-4 mr-2" /> Data Encryption
            </TabsTrigger>
            <TabsTrigger value="backups">
              <Database className="w-4 h-4 mr-2" /> Backup & Recovery
            </TabsTrigger>
            <TabsTrigger value="dlp">
              <Shield className="w-4 h-4 mr-2" /> Data Loss Prevention
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encryption" className="mt-6">
            <EncryptionStatus isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="backups" className="mt-6">
            <BackupManager backupJobs={backupJobs} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="dlp" className="mt-6">
            <DLPLog dlpEvents={dlpEvents} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}