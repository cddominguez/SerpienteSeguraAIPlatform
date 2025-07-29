import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrainCircuit, CheckCircle, Clock, Users, Percent } from 'lucide-react';
import { FederatedLearningJob } from '@/api/entities';
import { motion } from 'framer-motion';

export default function FederatedLearningManager() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    const jobData = await FederatedLearningJob.list('-created_date');
    setJobs(jobData);
    setIsLoading(false);
  };
  
  const createNewJob = async () => {
      await FederatedLearningJob.create({
          job_name: `Threat Detection Model - ${new Date().toLocaleDateString()}`,
          status: 'running',
          model_type: 'threat_detection',
          participants: 25, // Mock data
      });
      loadJobs();
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              Federated Learning
            </CardTitle>
            <CardDescription>Privacy-preserving, collaborative model training.</CardDescription>
        </div>
        <Button onClick={createNewJob}>Start New Training Job</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model Type</TableHead>
              <TableHead className="text-center">Participants</TableHead>
              <TableHead className="text-center">Accuracy Lift</TableHead>
              <TableHead>Completed On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map(job => (
              <motion.tr key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TableCell className="font-medium">{job.job_name}</TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell className="capitalize">{job.model_type.replace('_', ' ')}</TableCell>
                <TableCell className="text-center">{job.participants}</TableCell>
                <TableCell className="text-center font-semibold text-emerald-600">
                    {job.model_accuracy_improvement ? `+${job.model_accuracy_improvement}%` : 'N/A'}
                </TableCell>
                <TableCell>
                  {job.completion_date ? new Date(job.completion_date).toLocaleDateString() : 'In Progress'}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        {jobs.length === 0 && !isLoading && (
            <div className="text-center py-12 text-slate-500">
                No federated learning jobs found.
            </div>
        )}
      </CardContent>
    </Card>
  );
}