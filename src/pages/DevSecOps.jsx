import React from 'react';
import DevSecOpsHub from '@/components/development/DevSecOpsHub';

export default function DevSecOps() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            DevSecOps Center
          </h1>
          <p className="text-slate-600">
            Integrated security throughout the development lifecycle
          </p>
        </div>

        {/* DevSecOps Hub */}
        <DevSecOpsHub />
      </div>
    </div>
  );
}