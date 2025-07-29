import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Maximize, MessageSquare, Plus } from 'lucide-react';
import { HuntingAnnotation } from '@/api/entities';
import { User } from '@/api/entities';

// This is a mock graph renderer. A real implementation would use a library like D3, react-flow, or cytoscape.
const MockGraphRenderer = ({ graphData, onNodeClick }) => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500">Run a query to build the investigation graph.</div>;
    }

    return (
        <div className="relative w-full h-full">
            {graphData.edges.map((edge, i) => {
                 const fromNode = graphData.nodes.find(n => n.id === edge.from);
                 const toNode = graphData.nodes.find(n => n.id === edge.to);
                 if (!fromNode || !toNode) return null;

                 // Simple positioning logic, not a real graph layout algorithm
                 const fromPos = { x: (fromNode.id.hashCode() % 100), y: (fromNode.id.hashCode() % 60) + 20 };
                 const toPos = { x: (toNode.id.hashCode() % 100), y: (toNode.id.hashCode() % 60) + 20 };

                return (
                     <svg key={i} className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
                        <line 
                            x1={`${fromPos.x}%`} y1={`${fromPos.y}%`}
                            x2={`${toPos.x}%`} y2={`${toPos.y}%`}
                            stroke="#cbd5e1" strokeWidth="2"
                        />
                    </svg>
                )
            })}
            {graphData.nodes.map((node, i) => {
                 const pos = { x: (node.id.hashCode() % 100), y: (node.id.hashCode() % 60) + 20 };
                return (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="absolute p-2 rounded-lg bg-white shadow-lg border cursor-pointer"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                        onClick={() => onNodeClick(node)}
                    >
                        <p className="text-sm font-medium truncate max-w-xs">{node.label}</p>
                        <p className="text-xs text-slate-500 capitalize">{node.type}</p>
                    </motion.div>
                )
            })}
        </div>
    );
};

// Helper to get a hash code for positioning
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};


export default function InvestigationGraph({ graphData, investigationId }) {
    const [selectedNode, setSelectedNode] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [newAnnotation, setNewAnnotation] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const user = await User.me();
            setCurrentUser(user);
        };
        loadUser();
    }, []);

    useEffect(() => {
        const loadAnnotations = async () => {
            if (selectedNode) {
                const fetchedAnnotations = await HuntingAnnotation.filter({ investigation_id: investigationId, node_id: selectedNode.id });
                setAnnotations(fetchedAnnotations);
            } else {
                setAnnotations([]);
            }
        };
        loadAnnotations();
    }, [selectedNode, investigationId]);

    const handleAddAnnotation = async () => {
        if (!newAnnotation.trim() || !selectedNode || !currentUser) return;
        const annotationData = {
            investigation_id: investigationId,
            node_id: selectedNode.id,
            annotation: newAnnotation,
            analyst_email: currentUser.email
        };
        await HuntingAnnotation.create(annotationData);
        setAnnotations([...annotations, annotationData]);
        setNewAnnotation("");
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full flex flex-col">
            <CardHeader className="flex-row justify-between items-center">
                <div>
                    <CardTitle>Investigation Graph</CardTitle>
                    <CardDescription>Visualize relationships between entities.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon"><Maximize className="w-4 h-4" /></Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 border rounded-lg p-2 h-[600px]">
                    <MockGraphRenderer graphData={graphData} onNodeClick={setSelectedNode} />
                </div>
                <div className="md:col-span-1 border rounded-lg p-4 flex flex-col">
                    <h3 className="font-semibold mb-2">Context & Collaboration</h3>
                    <AnimatePresence>
                    {selectedNode && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                            <div className="p-3 bg-slate-100 rounded-lg mb-4">
                                <h4 className="font-semibold">{selectedNode.label}</h4>
                                <p className="text-sm text-slate-600">Type: {selectedNode.type}</p>
                                <p className="text-xs text-slate-500 break-all">ID: {selectedNode.id}</p>
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto mb-2">
                                {annotations.map((note, i) => (
                                    <div key={i} className="p-2 bg-blue-50 rounded-lg text-sm">
                                        <p>{note.annotation}</p>
                                        <p className="text-xs text-blue-700 text-right">- {note.analyst_email.split('@')[0]}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input 
                                    value={newAnnotation}
                                    onChange={(e) => setNewAnnotation(e.target.value)}
                                    placeholder="Add annotation..."
                                />
                                <Button size="icon" onClick={handleAddAnnotation}><Plus className="w-4 h-4" /></Button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                     {!selectedNode && <p className="text-sm text-slate-500 text-center mt-10">Click on a node to see details and add annotations.</p>}
                </div>
            </CardContent>
        </Card>
    );
}