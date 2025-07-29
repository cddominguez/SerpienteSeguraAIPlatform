import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, CheckCircle, X, AlertTriangle } from 'lucide-react';

export default function ExplainableAIDecision({ auditLog, onFeedback }) {
  if (!auditLog) return null;

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card className="bg-blue-50 border-blue-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          AI Decision Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-slate-700 mb-1">Action Taken</h4>
            <Badge variant="outline" className="capitalize">
              {auditLog.action_taken?.replace('_', ' ') || 'Unknown'}
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-1">Target</h4>
            <p className="text-sm text-slate-600">{auditLog.target || 'Unknown'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-1">Confidence</h4>
            <Badge className={getConfidenceColor(auditLog.confidence_score)}>
              {auditLog.confidence_score || 0}%
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-2">AI Reasoning</h4>
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm text-slate-700">
              {auditLog.reasoning || 'No reasoning provided'}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-slate-500">
            Was this AI decision helpful and accurate?
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-green-600 hover:bg-green-50"
              onClick={() => onFeedback?.('accurate')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Accurate
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:bg-red-50"
              onClick={() => onFeedback?.('inaccurate')}
            >
              <X className="w-4 h-4 mr-1" />
              Inaccurate
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onFeedback?.('unclear')}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Unclear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}