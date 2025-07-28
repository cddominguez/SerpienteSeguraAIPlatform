import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Key, Shield, FileCheck, Database } from "lucide-react";

import EncryptionOverview from "../components/encryption/EncryptionOverview";
import KeyManagementSystem from "../components/encryption/KeyManagementSystem";
import DataClassificationEngine from "../components/encryption/DataClassificationEngine";
import EncryptionPolicyManager from "../components/encryption/EncryptionPolicyManager";
import QuantumReadyEncryption from "../components/encryption/QuantumReadyEncryption";

export default function DataEncryptionCenter() {
  const [encryptionData, setEncryptionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate loading encryption data
    setTimeout(() => {
      setEncryptionData([
        { id: 1, file: "customer_data.db", status: "encrypted", algorithm: "AES-256" },
        { id: 2, file: "financial_records.json", status: "pending", algorithm: "RSA-4096" }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Data Encryption Center</h1>
          <p className="text-slate-600">Advanced encryption management, key lifecycle, and quantum-ready protection for all data assets.</p>
        </motion.div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">
              <Lock className="w-4 h-4 mr-2" /> Encryption Overview
            </TabsTrigger>
            <TabsTrigger value="keys">
              <Key className="w-4 h-4 mr-2" /> Key Management
            </TabsTrigger>
            <TabsTrigger value="classification">
              <FileCheck className="w-4 h-4 mr-2" /> Data Classification
            </TabsTrigger>
            <TabsTrigger value="policies">
              <Database className="w-4 h-4 mr-2" /> Policy Manager
            </TabsTrigger>
            <TabsTrigger value="quantum">
              <Shield className="w-4 h-4 mr-2" /> Quantum-Ready
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <EncryptionOverview encryptionData={encryptionData} />
          </TabsContent>

          <TabsContent value="keys" className="mt-6">
            <KeyManagementSystem />
          </TabsContent>

          <TabsContent value="classification" className="mt-6">
            <DataClassificationEngine />
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <EncryptionPolicyManager />
          </TabsContent>

          <TabsContent value="quantum" className="mt-6">
            <QuantumReadyEncryption />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}