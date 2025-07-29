import React, { useState, useEffect } from 'react';
import { UserActivity, AccessPolicy, UserRiskProfile } from '@/api/entities';
import BehavioralAnalytics from '@/components/ai/BehavioralAnalytics';
import PredictiveRiskScoring from '@/components/analytics/PredictiveRiskScoring';
import ZeroTrustValidator from '@/components/security/ZeroTrustValidator';

export default function UserSecurity() {
  const [userActivity, setUserActivity] = useState([]);
  const [accessPolicies, setAccessPolicies] = useState([]);
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserSecurityData();
  }, []);

  const loadUserSecurityData = async () => {
    setIsLoading(true);
    try {
      const [activityData, policiesData, profilesData] = await Promise.all([
        UserActivity.list('-created_date', 100),
        AccessPolicy.list('-created_date', 20),
        UserRiskProfile.list('-created_date', 50)
      ]);
      
      setUserActivity(activityData);
      setAccessPolicies(policiesData);
      setRiskProfiles(profilesData);
    } catch (error) {
      console.error('Error loading user security data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            User Security Center
          </h1>
          <p className="text-slate-600">
            Advanced user behavior analysis and access control
          </p>
        </div>

        {/* Behavioral Analytics */}
        <BehavioralAnalytics />

        {/* Risk Scoring */}
        <PredictiveRiskScoring 
          assets={riskProfiles} 
          threats={[]} 
        />

        {/* Zero Trust Validation */}
        <ZeroTrustValidator 
          devices={[]} 
          events={userActivity} 
        />
      </div>
    </div>
  );
}