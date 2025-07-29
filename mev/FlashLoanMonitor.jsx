import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle, ArrowRightLeft, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashLoanMonitor() {
    const [flashLoans, setFlashLoans] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            generateFlashLoan();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const generateFlashLoan = () => {
        const newLoan = {
            id: `fl-${Date.now()}`,
            amount: (Math.random() * 10000 + 500).toFixed(0),
            asset: ['WETH', 'USDC', 'DAI'][Math.floor(Math.random() * 3)],
            protocol: ['Aave', 'dYdX', 'Balancer'][Math.floor(Math.random() * 3)],
            purpose: ['Arbitrage', 'Liquidation', 'Collateral Swap', 'Attack'][Math.floor(Math.random() * 4)],
            timestamp: new Date()
        };
        setFlashLoans(prev => [newLoan, ...prev.slice(0, 9)]);
    };

    const getPurposeColor = (purpose) => ({
        'Arbitrage': 'bg-emerald-100 text-emerald-800',
        'Liquidation': 'bg-blue-100 text-blue-800',
        'Collateral Swap': 'bg-purple-100 text-purple-800',
        'Attack': 'bg-red-100 text-red-800'
    }[purpose] || 'bg-slate-100 text-slate-800');

    const getPurposeIcon = (purpose) => ({
        'Arbitrage': ArrowRightLeft,
        'Liquidation': Zap,
        'Collateral Swap': ArrowRightLeft,
        'Attack': AlertTriangle
    }[purpose] || Zap);

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Live Flash Loan Monitor
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <AnimatePresence>
                        {flashLoans.map((loan, i) => {
                            const Icon = getPurposeIcon(loan.purpose);
                             return (
                                <motion.div
                                    key={loan.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="p-4 rounded-lg border bg-slate-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Icon className="w-6 h-6 text-slate-500" />
                                            <div>
                                                <p className="font-semibold text-slate-800">{loan.amount} {loan.asset} from {loan.protocol}</p>
                                                <p className="text-sm text-slate-600">{loan.timestamp.toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <Badge className={getPurposeColor(loan.purpose)}>{loan.purpose}</Badge>
                                    </div>
                                    {loan.purpose === 'Attack' && (
                                        <div className="mt-2 p-2 bg-red-100 border-l-4 border-red-500 text-red-800 text-sm flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Suspicious flash loan detected, potentially part of an attack.
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                    {flashLoans.length === 0 && (
                        <div className="text-center py-10">
                            <Zap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500">Monitoring for flash loan activity...</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}