import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Send, Target, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

export default function CollaborativeHunting({
  annotations = [],
  activeInvestigation,
  onAddAnnotation,
  currentUser,
  onCreateInvestigation,
  refreshAnnotations
}) {
  const [newAnnotation, setNewAnnotation] = useState("");
  const [investigationName, setInvestigationName] = useState('');
  const [investigationDescription, setInvestigationDescription] = useState('');

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim() || !activeInvestigation) return;
    onAddAnnotation(activeInvestigation.id, newAnnotation);
    setNewAnnotation("");
  };

  const handleCreateInvestigation = () => {
    if (!investigationName.trim()) return;
    onCreateInvestigation(investigationName, investigationDescription);
    setInvestigationName('');
    setInvestigationDescription('');
  };
  
  const getInitials = (email) => {
    if (!email) return '??';
    const parts = email.split('@')[0].split(/[._-]/);
    return parts.map(p => p[0]).join('').toUpperCase();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Main Collaboration Panel */}
      <div className="lg:col-span-2">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Collaborative Hunting Channel
            </CardTitle>
            {activeInvestigation ? (
                <CardDescription>
                    Live annotations for investigation: <span className="font-semibold text-purple-700">{activeInvestigation.name}</span>
                </CardDescription>
            ) : (
                <CardDescription>
                    No active investigation. Start one to begin collaborating.
                </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="h-[400px] overflow-y-auto pr-4 space-y-4">
                <AnimatePresence>
                  {annotations
                    .filter(a => a.investigation_id === activeInvestigation?.id)
                    .map((note, index) => (
                    <motion.div
                      key={note.id || index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${note.analyst_email === currentUser?.email ? 'justify-end' : ''}`}
                    >
                      {note.analyst_email !== currentUser?.email && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{getInitials(note.analyst_email)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-md p-3 rounded-lg ${note.analyst_email === currentUser?.email ? 'bg-purple-100' : 'bg-slate-100'}`}>
                        <p className="text-sm text-slate-800">{note.annotation}</p>
                        <p className="text-xs text-slate-500 text-right mt-1">
                          {note.analyst_email.split('@')[0]} - {formatDistanceToNow(new Date(note.created_date), { addSuffix: true })}
                        </p>
                      </div>
                       {note.analyst_email === currentUser?.email && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-600 text-white">{getInitials(note.analyst_email)}</AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-3">
                <Input
                  placeholder={activeInvestigation ? "Add your finding..." : "Start an investigation first"}
                  value={newAnnotation}
                  onChange={(e) => setNewAnnotation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAnnotation()}
                  disabled={!activeInvestigation}
                />
                <Button onClick={handleAddAnnotation} disabled={!activeInvestigation || !newAnnotation.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Add
                </Button>
                 <Button variant="outline" onClick={refreshAnnotations}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investigation Control Panel */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Investigation Control</CardTitle>
          </CardHeader>
          <CardContent>
            {activeInvestigation ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Active Investigation</h4>
                    </div>
                    <p className="text-lg font-bold text-slate-800">{activeInvestigation.name}</p>
                    <p className="text-sm text-slate-600">{activeInvestigation.description}</p>
                    <div className="text-xs text-slate-500 mt-2">
                        <span>Created by: {activeInvestigation.created_by}</span><br/>
                        <span>{formatDistanceToNow(new Date(activeInvestigation.created_date), { addSuffix: true })}</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => onCreateInvestigation(null)}>End Investigation</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold">Start New Investigation</h4>
                <Input
                  placeholder="Investigation Name"
                  value={investigationName}
                  onChange={(e) => setInvestigationName(e.target.value)}
                />
                <Textarea
                  placeholder="Brief description..."
                  value={investigationDescription}
                  onChange={(e) => setInvestigationDescription(e.target.value)}
                />
                <Button className="w-full" onClick={handleCreateInvestigation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Investigation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}