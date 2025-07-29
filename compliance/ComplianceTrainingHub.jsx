import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Users, Award, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComplianceTrainingHub() {
    const [personalizedTraining, setPersonalizedTraining] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const trainingModules = [
        { id: 1, title: 'GDPR Fundamentals', framework: 'GDPR', duration: '45 min', progress: 100, status: 'completed' },
        { id: 2, title: 'Data Classification & Handling', framework: 'General', duration: '30 min', progress: 75, status: 'in-progress' },
        { id: 3, title: 'HIPAA Privacy Rules', framework: 'HIPAA', duration: '60 min', progress: 0, status: 'not-started' },
        { id: 4, title: 'PCI DSS Requirements', framework: 'PCI DSS', duration: '50 min', progress: 0, status: 'not-started' },
        { id: 5, title: 'ISO 27001 Controls', framework: 'ISO 27001', duration: '40 min', progress: 25, status: 'in-progress' },
        { id: 6, title: 'AI Ethics in Compliance', framework: 'AI/ML', duration: '35 min', progress: 0, status: 'not-started' }
    ];

    const simulationScenarios = [
        { id: 1, title: 'Data Breach Incident Response', type: 'Incident Response', difficulty: 'Advanced', completed: true },
        { id: 2, title: 'GDPR Data Subject Request', type: 'Data Rights', difficulty: 'Intermediate', completed: false },
        { id: 3, title: 'Compliance Audit Preparation', type: 'Audit', difficulty: 'Advanced', completed: false },
        { id: 4, title: 'Phishing Attack Recognition', type: 'Security Awareness', difficulty: 'Beginner', completed: true }
    ];

    const generatePersonalizedTraining = async () => {
        setIsGenerating(true);
        try {
            const response = await InvokeLLM({
                prompt: `Based on a user's role as a Compliance Manager with intermediate knowledge of GDPR and basic knowledge of HIPAA, create a personalized training plan. Include specific modules, timeline, and learning objectives tailored to their compliance responsibilities.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        recommended_modules: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    priority: { type: "string", enum: ["High", "Medium", "Low"] },
                                    estimated_time: { type: "string" },
                                    learning_objectives: { type: "array", items: { type: "string" } },
                                    prerequisites: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        learning_path: { type: "string" },
                        timeline: { type: "string" },
                        skills_gap: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setPersonalizedTraining(response);
        } catch (error) {
            console.error("Error generating personalized training:", error);
        }
        setIsGenerating(false);
    };

    const getStatusBadge = (status) => {
        const styles = {
            'completed': 'bg-emerald-500 text-white',
            'in-progress': 'bg-blue-500 text-white',
            'not-started': 'bg-slate-500 text-white'
        };
        return styles[status] || 'bg-slate-500 text-white';
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            'High': 'bg-red-500 text-white',
            'Medium': 'bg-amber-500 text-white',
            'Low': 'bg-blue-500 text-white'
        };
        return styles[priority] || 'bg-slate-500 text-white';
    };

    return (
        <div className="space-y-8">
            {/* AI-Powered Personalized Training */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-600" />
                            AI-Powered Personalized Training
                        </CardTitle>
                        <CardDescription>Get customized training recommendations based on your role and knowledge level.</CardDescription>
                    </div>
                    <Button onClick={generatePersonalizedTraining} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate Training Plan'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {personalizedTraining && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="p-4 bg-white rounded-lg border border-purple-200">
                                <h3 className="font-semibold text-slate-900 mb-2">Recommended Learning Path</h3>
                                <p className="text-slate-700 mb-4">{personalizedTraining.learning_path}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <span><strong>Timeline:</strong> {personalizedTraining.timeline}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 mb-3">Skills Gap Analysis</h4>
                                <div className="flex flex-wrap gap-2">
                                    {personalizedTraining.skills_gap?.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="text-amber-700 border-amber-300">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 mb-3">Recommended Modules</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {personalizedTraining.recommended_modules?.map((module, i) => (
                                        <div key={i} className="p-4 bg-white rounded-lg border">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium text-slate-900">{module.title}</h5>
                                                <Badge className={getPriorityBadge(module.priority)}>
                                                    {module.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-2">Duration: {module.estimated_time}</p>
                                            <div className="text-sm">
                                                <strong>Learning Objectives:</strong>
                                                <ul className="list-disc list-inside mt-1 text-slate-600">
                                                    {module.learning_objectives?.map((objective, j) => (
                                                        <li key={j}>{objective}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Training Modules */}
            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-emerald-600" />
                            Training Modules
                        </CardTitle>
                        <CardDescription>Interactive compliance training modules tailored to different frameworks.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {trainingModules.map(module => (
                                <div key={module.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{module.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                                <span>Framework: {module.framework}</span>
                                                <span>Duration: {module.duration}</span>
                                            </div>
                                        </div>
                                        <Badge className={getStatusBadge(module.status)} variant="secondary">
                                            {module.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span>Progress</span>
                                            <span>{module.progress}%</span>
                                        </div>
                                        <Progress value={module.progress} className="h-2" />
                                    </div>
                                    <div className="flex justify-end mt-3">
                                        <Button size="sm" variant={module.status === 'completed' ? 'outline' : 'default'}>
                                            {module.status === 'completed' ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Review
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    {module.status === 'not-started' ? 'Start' : 'Continue'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Simulation Scenarios */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Compliance Simulations
                        </CardTitle>
                        <CardDescription>Practice real-world compliance scenarios in a safe environment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {simulationScenarios.map(scenario => (
                                <div key={scenario.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{scenario.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                                <span>Type: {scenario.type}</span>
                                                <Badge variant="outline" className={
                                                    scenario.difficulty === 'Advanced' ? 'border-red-300 text-red-700' :
                                                    scenario.difficulty === 'Intermediate' ? 'border-amber-300 text-amber-700' :
                                                    'border-green-300 text-green-700'
                                                }>
                                                    {scenario.difficulty}
                                                </Badge>
                                            </div>
                                        </div>
                                        {scenario.completed && (
                                            <Badge className="bg-emerald-500 text-white">
                                                <Award className="w-3 h-3 mr-1" />
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button size="sm" variant={scenario.completed ? 'outline' : 'default'}>
                                            <Play className="w-4 h-4 mr-2" />
                                            {scenario.completed ? 'Retry' : 'Start Simulation'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Training Analytics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900">Training Analytics & Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">6</div>
                            <p className="text-sm text-slate-600">Modules Completed</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">4.2h</div>
                            <p className="text-sm text-slate-600">Total Training Time</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
                            <p className="text-sm text-slate-600">Average Score</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-amber-600 mb-2">3</div>
                            <p className="text-sm text-slate-600">Certifications Earned</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}