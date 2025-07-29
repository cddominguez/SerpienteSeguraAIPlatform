import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Zap, Target, AlertTriangle, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function CounterAttackModule({ activeThreats }) {
  const [isCounterAttacking, setIsCounterAttacking] = useState(false);
  const [activeDefenses, setActiveDefenses] = useState([]);

  const offensiveActions = [
    {
      id: 'ip_block',
      name: 'IP Address Blocking',
      description: 'Block all traffic from malicious IP addresses',
      severity: 'medium',
      automated: true
    },
    {
      id: 'geo_block',
      name: 'Geo-Location Blocking', 
      description: 'Block entire countries or regions showing hostile activity',
      severity: 'high',
      automated: false
    },
    {
      id: 'honeypot',
      name: 'Deploy Honeypots',
      description: 'Deploy decoy systems to trap and analyze attackers',
      severity: 'low',
      automated: true
    },
    {
      id: 'deception',
      name: 'Deception Network',
      description: 'Create fake network segments to mislead attackers',
      severity: 'medium',
      automated: false
    },
    {
      id: 'counter_intelligence',
      name: 'Counter Intelligence',
      description: 'Feed false information to identified attackers',
      severity: 'high',
      automated: false
    }
  ];

  const initiateCounterAttack = async (action) => {
    setIsCounterAttacking(true);
    
    // Simulate counter-attack initiation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDefense = {
      ...action,
      status: 'active',
      initiated_at: new Date(),
      effectiveness: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
    
    setActiveDefenses(prev => [...prev, newDefense]);
    setIsCounterAttacking(false);
  };

  const getSeverityColor = (severity) => ({
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    high: 'bg-red-100 text-red-800'
  }[severity]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-red-600" />
          Offensive Defense System
        </CardTitle>
        <p className="text-sm text-slate-600">
          Active counter-measures against live attacks
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Response Button */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-red-900">Emergency Response</h3>
              <p className="text-sm text-red-700">Immediate action against active threats</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 animate-pulse"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  ACTIVATE DEFENSES
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Confirm Offensive Defense Activation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will initiate automated counter-measures against detected threats. 
                    Active attacks will be met with immediate defensive responses including 
                    IP blocking, geo-blocking, and deception tactics.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => initiateCounterAttack(offensiveActions[0])}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Activate Defenses
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Available Actions */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Available Counter-Measures</h3>
          <div className="grid gap-3">
            {offensiveActions.map(action => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-4 h-4 text-slate-600" />
                      <h4 className="font-semibold text-slate-900">{action.name}</h4>
                      <Badge className={getSeverityColor(action.severity)}>
                        {action.severity}
                      </Badge>
                      {action.automated && (
                        <Badge variant="outline" className="text-xs">
                          Auto
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => initiateCounterAttack(action)}
                    disabled={isCounterAttacking}
                  >
                    {isCounterAttacking ? 'Initiating...' : 'Deploy'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Defenses */}
        {activeDefenses.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Active Defenses</h3>
            <div className="space-y-3">
              {activeDefenses.map((defense, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-900">{defense.name}</span>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {defense.effectiveness}% effective
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-emerald-700">
                      Active
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}