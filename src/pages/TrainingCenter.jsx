import React from 'react';
import AdaptiveSecurityTraining from '@/components/training/AdaptiveSecurityTraining';
import SecurityTrainingSimulator from '@/components/resources/SecurityTrainingSimulator';
import DeveloperCommunityHub from '@/components/resources/DeveloperCommunityHub';

export default function TrainingCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Security Training Center
          </h1>
          <p className="text-slate-600">
            Adaptive security awareness training and skill development
          </p>
        </div>

        {/* Adaptive Training */}
        <AdaptiveSecurityTraining />

        {/* Training Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SecurityTrainingSimulator />
          <DeveloperCommunityHub />
        </div>
      </div>
    </div>
  );
}