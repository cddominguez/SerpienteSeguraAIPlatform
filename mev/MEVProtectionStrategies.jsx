import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Zap, EyeOff, Lock, SlidersHorizontal } from 'lucide-react';

export default function MEVProtectionStrategies() {
    const [strategies, setStrategies] = useState([
        { id: 'private-tx', name: 'Private Transactions', description: 'Send transactions directly to miners, bypassing the public mempool.', enabled: true, category: 'Privacy' },
        { id: 'gas-optimization', name: 'AI Gas Fee Optimization', description: 'Automatically adjusts gas fees to minimize MEV risk and cost.', enabled: true, category: 'Efficiency' },
        { id: 'transaction-batching', name: 'Transaction Batching', description: 'Combine multiple transactions into one to obscure individual actions.', enabled: false, category: 'Obfuscation' },
        { id: 'flashbots-protect', name: 'Flashbots Protect RPC', description: 'Utilize Flashbots network for front-running protection.', enabled: true, category: 'Front-running' },
        { id: 'anti-sandwich', name: 'Anti-Sandwich Attacks', description: 'Detects and mitigates sandwich attack patterns.', enabled: true, category: 'DEX Trading' },
    ]);

    const toggleStrategy = (id) => {
        setStrategies(strategies.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    };

    const getCategoryColor = (category) => ({
        'Privacy': 'bg-blue-100 text-blue-800',
        'Efficiency': 'bg-emerald-100 text-emerald-800',
        'Obfuscation': 'bg-purple-100 text-purple-800',
        'Front-running': 'bg-orange-100 text-orange-800',
        'DEX Trading': 'bg-pink-100 text-pink-800'
    }[category] || 'bg-slate-100 text-slate-800');
    
    const getCategoryIcon = (category) => ({
        'Privacy': EyeOff,
        'Efficiency': Zap,
        'Obfuscation': Lock,
        'Front-running': Shield,
        'DEX Trading': SlidersHorizontal
    }[category] || Shield);

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    MEV Protection Strategies
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {strategies.map(strategy => {
                    const Icon = getCategoryIcon(strategy.category);
                    return (
                        <div key={strategy.id} className="p-4 rounded-lg border bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Icon className="w-8 h-8 text-slate-500" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-slate-800">{strategy.name}</h4>
                                        <Badge className={getCategoryColor(strategy.category)}>{strategy.category}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-600">{strategy.description}</p>
                                </div>
                            </div>
                            <Switch
                                checked={strategy.enabled}
                                onCheckedChange={() => toggleStrategy(strategy.id)}
                            />
                        </div>
                    )
                })}
                <div className="pt-4 flex justify-end">
                    <Button>Save Strategies</Button>
                </div>
            </CardContent>
        </Card>
    );
}