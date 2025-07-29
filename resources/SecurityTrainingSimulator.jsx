import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, ShieldQuestion, Award } from 'lucide-react';

export default function SecurityTrainingSimulator() {
    const [simulation, setSimulation] = useState(null);
    
    const startPhishingSimulation = () => {
        setSimulation({
            type: 'Phishing',
            status: 'In Progress',
            email: {
                from: 'IT Support <support-team@yourcompany.net>',
                subject: 'Urgent: Password Reset Required',
                body: 'Dear employee, due to a recent security update, you are required to reset your password immediately. Please click the link below to continue: http://yourcompany-auth.com/reset'
            },
            results: null
        });
    };
    
    const completeSimulation = () => {
        setSimulation(prev => ({
            ...prev,
            status: 'Completed',
            results: {
                total_recipients: 150,
                clicked_link: 18,
                reported_phish: 95,
                success_rate: ((95/150)*100).toFixed(1) + '%'
            }
        }));
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldQuestion className="w-5 h-5 text-teal-600" />
                    Security Awareness Training
                </CardTitle>
                <CardDescription>Educate and test your team with simulated attacks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!simulation && <Button onClick={startPhishingSimulation}>Launch Phishing Simulation</Button>}
                
                {simulation && (
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{simulation.type} Simulation</h3>
                        <Badge>{simulation.status}</Badge>

                        <div className="mt-4 p-4 bg-slate-100 rounded-md text-sm">
                            <p><strong>From:</strong> {simulation.email.from}</p>
                            <p><strong>Subject:</strong> {simulation.email.subject}</p>
                            <hr className="my-2"/>
                            <p>{simulation.email.body}</p>
                        </div>
                        
                        {simulation.status === 'In Progress' && <Button onClick={completeSimulation} className="mt-4">End Simulation & View Results</Button>}
                        
                        {simulation.results && (
                             <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">Clicked Link</p>
                                    <p className="text-2xl font-bold">{simulation.results.clicked_link}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">Reported as Phishing</p>
                                    <p className="text-2xl font-bold">{simulation.results.reported_phish}</p>
                                </div>
                             </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}