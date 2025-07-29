
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GitFork, MessageSquare, Code, Users } from 'lucide-react';

export default function DeveloperCommunityHub() {
    const resources = [
        { name: 'API Documentation', icon: BookOpen, url: '#' },
        { name: 'Contribute on GitHub', icon: GitFork, url: '#' },
        { name: 'Community Forum', icon: MessageSquare, url: '#' },
        { name: 'SDKs & Libraries', icon: Code, url: '#' },
    ];
    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Developer & Community Hub
                </CardTitle>
                <CardDescription>Access resources, contribute, and connect with other developers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {resources.map(resource => (
                        <Button key={resource.name} variant="outline" className="h-20 flex flex-col gap-2">
                            <resource.icon className="w-6 h-6" />
                            <span>{resource.name}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
