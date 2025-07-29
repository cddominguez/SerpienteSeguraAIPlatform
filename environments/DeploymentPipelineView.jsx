import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GitCommit, TestTube2, Server, ShieldCheck, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const environments = ['Build', 'Test', 'Staging', 'Production'];

export default function DeploymentPipelineView({ deployments, vulnerabilities, complianceChecks, isLoading }) {
    const latestDeployment = deployments[0] || {};
    
    const getStatusForEnv = (env) => {
        if (!latestDeployment || !latestDeployment.environment) return 'pending';

        const envIndex = environments.indexOf(env);
        const deployEnvIndex = environments.indexOf(latestDeployment.environment.charAt(0).toUpperCase() + latestDeployment.environment.slice(1));

        if (deployEnvIndex < envIndex) return 'pending';
        if (deployEnvIndex > envIndex) return 'success';
        
        return latestDeployment.status;
    };
    
    const getBadgeForStatus = (status, stage) => {
        let vulnStatus = 'passed', compStatus = 'passed';
        if (latestDeployment.id) {
            vulnStatus = latestDeployment.vulnerability_status;
            compStatus = latestDeployment.compliance_status;
        }

        const isCurrentStage = environments.indexOf(stage) === environments.indexOf(latestDeployment.environment?.charAt(0).toUpperCase() + latestDeployment.environment?.slice(1));

        if (status === 'success') return <Badge className="bg-emerald-500 text-white"><CheckCircle className="w-3 h-3 mr-1"/>Success</Badge>;
        if (status === 'failed') return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/>Failed</Badge>;
        if (status === 'in_progress') return <Badge className="bg-blue-500 text-white animate-pulse">In Progress</Badge>;
        if (status === 'pending') return <Badge variant="outline">Pending</Badge>;
        if (isCurrentStage && vulnStatus === 'failed') return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/>Vuln Scan Failed</Badge>;
        if (isCurrentStage && compStatus === 'failed') return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/>Compliance Failed</Badge>;

        return <Badge variant="secondary">{status}</Badge>;
    };

    const StageCard = ({ icon: Icon, title, status, commit, service }) => {
        const statusColor = status === 'success' ? 'border-emerald-500' : status === 'failed' ? 'border-red-500' : 'border-slate-200';
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
                <Card className={`bg-white/80 backdrop-blur-sm border-2 shadow-lg ${statusColor}`}>
                    <CardHeader className="text-center">
                        <Icon className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {status !== 'pending' ? (
                            <>
                                {getBadgeForStatus(status, title)}
                                <p className="text-sm font-mono text-slate-600 mt-2 truncate" title={commit}>{commit}</p>
                                <p className="text-xs text-slate-500 mt-1">{service}</p>
                            </>
                        ) : getBadgeForStatus('pending') }
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Live Deployment Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <StageCard icon={Package} title="Build" status={getStatusForEnv('Build')} commit={latestDeployment.commit_hash} service={latestDeployment.service_name} />
                    <div className="flex-grow h-1 bg-slate-300 rounded-full"></div>
                    <StageCard icon={TestTube2} title="Test" status={getStatusForEnv('Test')} commit={latestDeployment.commit_hash} service={latestDeployment.service_name} />
                    <div className="flex-grow h-1 bg-slate-300 rounded-full"></div>
                    <StageCard icon={Server} title="Staging" status={getStatusForEnv('Staging')} commit={latestDeployment.commit_hash} service={latestDeployment.service_name} />
                    <div className="flex-grow h-1 bg-slate-300 rounded-full"></div>
                    <StageCard icon={ShieldCheck} title="Production" status={getStatusForEnv('Production')} commit={latestDeployment.commit_hash} service={latestDeployment.service_name} />
                </div>
            </CardContent>
        </Card>
    );
}