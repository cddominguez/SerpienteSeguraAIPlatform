
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Zap, Fuel, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MempoolAnalyzer() {
    const [mempoolData, setMempoolData] = useState([]);
    const [isStreaming, setIsStreaming] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isStreaming) {
                generateMempoolData();
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [isStreaming]);

    const generateMempoolData = () => {
        const newTx = {
            id: `0x${[...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
            value: (Math.random() * 5).toFixed(2),
            gasPrice: (Math.random() * 50 + 20).toFixed(0),
            type: ['DEX Swap', 'NFT Mint', 'Liquidation', 'Arbitrage'][Math.floor(Math.random() * 4)],
            mevOpportunity: Math.random() > 0.8
        };
        setMempoolData(prev => [newTx, ...prev.slice(0, 14)]);
    };

    const getTxTypeColor = (type) => ({
        'DEX Swap': 'bg-blue-100 text-blue-800',
        'NFT Mint': 'bg-purple-100 text-purple-800',
        'Liquidation': 'bg-orange-100 text-orange-800',
        'Arbitrage': 'bg-emerald-100 text-emerald-800'
    }[type] || 'bg-slate-100 text-slate-800');

    const getTxTypeIcon = (type) => ({
        'DEX Swap': ArrowRightLeft,
        'NFT Mint': Zap,
        'Liquidation': Zap,
        'Arbitrage': ArrowRightLeft
    }[type] || Zap);

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    Live Mempool Analyzer
                </CardTitle>
                <Button onClick={() => setIsStreaming(!isStreaming)} variant="outline">
                    {isStreaming ? 'Pause Stream' : 'Resume Stream'}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-96 overflow-y-auto space-y-3 pr-2">
                    <AnimatePresence>
                        {mempoolData.map((tx, i) => {
                            const Icon = getTxTypeIcon(tx.type);
                            return (
                                <motion.div
                                    key={tx.id}
                                    layout
                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.5 }}
                                    className={`p-4 rounded-lg border flex items-center justify-between ${tx.mevOpportunity ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon className="w-6 h-6 text-slate-500"/>
                                        <div>
                                            <p className="font-mono text-sm text-slate-800">{tx.id}</p>
                                            <Badge className={getTxTypeColor(tx.type)}>{tx.type}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium">{tx.value} ETH</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Fuel className="w-4 h-4 text-orange-500" />
                                            <span className="font-medium">{tx.gasPrice} Gwei</span>
                                        </div>
                                        {tx.mevOpportunity && <Badge className="bg-red-500 text-white">MEV Opportunity</Badge>}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
