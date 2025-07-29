import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

export default function NotificationSettings() {
    // State represents user's notification preferences
    const [preferences, setPreferences] = useState({
        critical_incident: { email: true, slack: true, push: true },
        high_sev_threat: { email: true, slack: true, push: false },
        policy_violation: { email: true, slack: false, push: false },
        daily_summary: { email: true, slack: false, push: false }
    });
    const [isSaving, setIsSaving] = useState(false);

    const togglePreference = (event, channel) => {
        setPreferences(prev => ({
            ...prev,
            [event]: {
                ...prev[event],
                [channel]: !prev[event][channel]
            }
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // In a real app, this would be an API call.
        setTimeout(() => {
            setIsSaving(false);
            // Show toast notification on success
        }, 1000);
    };

    const notificationEvents = [
        { id: 'critical_incident', name: 'Critical Incident Alerts' },
        { id: 'high_sev_threat', name: 'High-Severity Threats' },
        { id: 'policy_violation', name: 'Compliance & Policy Violations' },
        { id: 'daily_summary', name: 'Daily Security Summary' }
    ];

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-slate-700" />
                    Notification Settings
                </CardTitle>
                <CardDescription>
                    Manage how you receive alerts and notifications from the platform.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-4 font-semibold text-sm text-center">
                        <div className="text-left">Alert Type</div>
                        <div><Mail className="w-4 h-4 mx-auto" /> Email</div>
                        <div><MessageSquare className="w-4 h-4 mx-auto" /> Slack</div>
                        <div><Smartphone className="w-4 h-4 mx-auto" /> Push</div>
                    </div>
                    {notificationEvents.map(event => (
                        <div key={event.id} className="grid grid-cols-4 items-center p-2 rounded-lg hover:bg-slate-100">
                            <Label htmlFor={`${event.id}-email`} className="font-medium">{event.name}</Label>
                            <div className="text-center">
                                <Switch 
                                    id={`${event.id}-email`} 
                                    checked={preferences[event.id].email}
                                    onCheckedChange={() => togglePreference(event.id, 'email')}
                                />
                            </div>
                            <div className="text-center">
                                <Switch 
                                    id={`${event.id}-slack`} 
                                    checked={preferences[event.id].slack}
                                    onCheckedChange={() => togglePreference(event.id, 'slack')}
                                />
                            </div>
                            <div className="text-center">
                                <Switch 
                                    id={`${event.id}-push`} 
                                    checked={preferences[event.id].push}
                                    onCheckedChange={() => togglePreference(event.id, 'push')}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}