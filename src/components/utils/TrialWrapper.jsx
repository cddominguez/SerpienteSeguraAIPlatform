import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Crown, AlertTriangle } from 'lucide-react';

export default function TrialWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-lg font-semibold text-slate-700">Loading...</div>
      </div>
    );
  }

  // If no user or user has no license, show trial page
  if (!user || user.license_tier === 'none') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Welcome to SerpienteSegura</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience the future of AI-driven cybersecurity. Start your free trial to unlock comprehensive protection.
          </p>
        </div>
        <Button 
          onClick={() => User.login()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8"
        >
          Start Free Trial
        </Button>
      </div>
    );
  }

  // If user is on trial, show trial banner
  if (user.license_tier === 'trial') {
    const endDate = new Date(user.trial_end_date);
    const daysRemaining = Math.max(0, differenceInDays(endDate, new Date()));
    
    return (
      <div className="min-h-screen bg-slate-100">
        {daysRemaining <= 2 && (
          <div className="bg-amber-500 text-white p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                Trial expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </span>
              <Button size="sm" variant="secondary" className="ml-4">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Regular licensed user
  return children;
}