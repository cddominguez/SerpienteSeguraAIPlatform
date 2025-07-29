import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BrainCircuit, RefreshCw, Share2, TestTube2, ShieldCheck, Eye, Bot } from 'lucide-react';

export default function AIModelManagement({ models, isLoading, refreshModels }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    useEffect(() => {
        if (models && models.length > 0) {
            setSelectedModel(prevSelected => {
                return models.find(m => m.name === prevSelected?.name) || models[0];
            });
        } else {
            setSelectedModel(null);
        }
    }, [models]);

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        AI Model Management
                    </CardTitle>
                    <CardDescription className="mt-2">Oversee, train, and deploy all security AI models.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refreshModels} disabled={isLoading}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900 mb-3">Available Models</h3>
                        {models && models.length > 0 ? (
                            models.map(model => (
                                <div 
                                    key={model.name} 
                                    onClick={() => setSelectedModel(model)} 
                                    className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                                        selectedModel?.name === model.name 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'border-transparent hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium text-slate-900">{model.name}</p>
                                        <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                                            {model.status}
                                        </Badge>
                                    </div>
                                    <Progress value={model.accuracy} className="w-full h-2" />
                                    <p className="text-xs text-slate-500 mt-1 text-right">{model.accuracy}% Accuracy</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg">
                                No models available
                            </div>
                        )}
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                        {selectedModel ? (
                            <div className="space-y-6">
                                <div className="p-4 border rounded-lg bg-slate-50">
                                    <h3 className="font-bold text-lg text-slate-800 mb-4">{selectedModel.name}</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="font-semibold">Status:</span> {selectedModel.status}</div>
                                        <div><span className="font-semibold">Accuracy:</span> {selectedModel.accuracy}%</div>
                                        <div><span className="font-semibold">Last Update:</span> {selectedModel.last_training}</div>
                                        <div><span className="font-semibold">Type:</span> {selectedModel.type}</div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3">Model Features</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FeatureCard icon={RefreshCw} title="Continuous Learning" description="Models adapt to new threats in real-time." />
                                        <FeatureCard icon={Eye} title="Explainable AI" description="Understand the 'why' behind AI decisions." />
                                        <FeatureCard icon={Share2} title="Federated Learning" description="Collaborative training without data sharing." />
                                        <FeatureCard icon={TestTube2} title="Synthetic Data" description="Improve robustness with generated data." />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline">View Logs</Button>
                                    <Button>Retrain Model</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg">
                                <Bot className="mx-auto w-12 h-12 text-slate-400 mb-3" />
                                <h3 className="font-medium">No Model Selected</h3>
                                <p className="text-sm">Select a model to view its details and manage settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-3 border rounded-lg text-center bg-white">
        <Icon className="w-6 h-6 mx-auto text-purple-600 mb-2" />
        <p className="font-medium text-sm mb-1">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);