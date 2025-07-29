import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, BookOpen, Target, TrendingUp, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdaptiveSecurityTraining() {
    const [userProfile, setUserProfile] = useState({
        name: "Alex Doe",
        role: "Software Engineer",
        phishing_susceptibility: 75,
        password_hygiene: 90,
        social_eng_awareness: 60,
        completed_modules: 5,
        total_modules: 12
    });

    const [learningPath, setLearningPath] = useState([
        { title: "Advanced Phishing Recognition", status: "Recommended", type: "Interactive Simulation" },
        { title: "Secure Coding Practices for Web Apps", status: "In Progress", type: "Video Course" },
        { title: "Understanding Social Engineering Tactics", status: "Next Up", type: "Reading" },
        { title: "Introduction to Cryptography", status: "Completed", type: "Video Course" },
    ]);

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Adaptive Security Training
                </CardTitle>
                <CardDescription>Personalized learning paths powered by AI to strengthen security awareness.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-slate-500" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">{userProfile.name}</p>
                            <p className="text-slate-600">{userProfile.role}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Knowledge Gaps Analysis</h3>
                        <SkillProgress label="Phishing Susceptibility" value={userProfile.phishing_susceptibility} color="bg-red-500" />
                        <SkillProgress label="Password Hygiene" value={userProfile.password_hygiene} color="bg-green-500" />
                        <SkillProgress label="Social Engineering Awareness" value={userProfile.social_eng_awareness} color="bg-orange-500" />
                    </div>
                    <div className="text-center">
                        <Button variant="outline">View Full Profile</Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Your Personalized Learning Path</h3>
                    {learningPath.map((module, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 border rounded-lg flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                    {module.type.includes("Simulation") ? <Target className="w-4 h-4 text-blue-600"/> : 
                                     module.type.includes("Video") ? <Video className="w-4 h-4 text-blue-600"/> :
                                     <BookOpen className="w-4 h-4 text-blue-600"/>}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{module.title}</p>
                                    <p className="text-xs text-slate-500">{module.type}</p>
                                </div>
                            </div>
                            <Badge variant={module.status === 'Completed' ? 'default' : 'secondary'} className={module.status === "Recommended" ? "bg-blue-100 text-blue-800" : ""}>{module.status}</Badge>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

const SkillProgress = ({ label, value, color }) => (
    <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">{label}</span>
            <span className="font-semibold">{value}%</span>
        </div>
        <Progress value={value} className={`h-2 [&>div]:${color}`} />
    </div>
);