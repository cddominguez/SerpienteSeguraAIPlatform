import React from "react";
import { motion } from "framer-motion";
import AdaptiveSecurityTraining from "../components/training/AdaptiveSecurityTraining";
import SecurityTrainingSimulator from "../components/resources/SecurityTrainingSimulator";
import DeveloperCommunityHub from "../components/resources/DeveloperCommunityHub";

export default function TrainingCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Security Training & Resources</h1>
          <p className="text-slate-600">Empower your team with adaptive training and developer-focused resources.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AdaptiveSecurityTraining />
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <SecurityTrainingSimulator />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <DeveloperCommunityHub />
            </motion.div>
        </div>

      </div>
    </div>
  );
}