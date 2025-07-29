import React from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, BrainCircuit, GitBranch, Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrialPage() {
  const handleStartTrial = async () => {
    try {
      await User.login();
      // After successful login, the layout will handle trial activation.
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const features = [
    { name: 'AI Security Center', icon: BrainCircuit },
    { name: 'DevSecOps & Environments', icon: GitBranch },
    { name: 'Real-Time Threat Intelligence', icon: Shield },
    { name: 'Full Feature Access during trial', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <Shield className="w-20 h-20 text-blue-400 mx-auto mb-4" />
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to SerpienteSegura</h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Experience the future of proactive, AI-driven cybersecurity. Start your free trial to unlock comprehensive protection for your entire digital ecosystem.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-lg border-blue-700/50 text-white max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
              <Clock className="w-7 h-7" />
              Start Your 7-Day Free Trial
            </CardTitle>
            <CardDescription className="text-center text-slate-400 pt-2">
              No credit card required. Get instant access to all Pro Tier features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3 text-slate-300">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleStartTrial}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
            >
              Sign Up & Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}