import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AISecurityAssistant({ threats, devices, events }) {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI Security Assistant. I can help you analyze threats, explain security metrics, generate reports, and provide security recommendations. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async (query) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const context = {
        threats: threats.slice(0, 10),
        devices: devices.slice(0, 10),
        events: events.slice(0, 20),
        stats: {
          totalThreats: threats.length,
          activeThreats: threats.filter(t => t.status === 'active').length,
          protectedDevices: devices.filter(d => d.status === 'protected').length,
          atRiskDevices: devices.filter(d => d.status === 'at_risk' || d.status === 'compromised').length
        }
      };

      const response = await InvokeLLM({
        prompt: `You are a cybersecurity AI assistant for SerpientSegura platform. Answer the user's question based on the security data provided. Be helpful, accurate, and provide actionable insights.

User Question: ${query}

Current Security Context:
${JSON.stringify(context)}

Provide a comprehensive, helpful response that addresses the user's question with specific data and recommendations when applicable.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            insights: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            urgency_level: { type: "string", enum: ["low", "medium", "high", "critical"] }
          }
        }
      });

      const aiMessage = {
        type: 'ai',
        content: response.response,
        insights: response.insights,
        recommendations: response.recommendations,
        urgency: response.urgency_level
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsProcessing(false);
  };

  const suggestedQueries = [
    "What are the current top security threats?",
    "Generate a security posture summary",
    "Which devices need immediate attention?",
    "Analyze unusual activity patterns",
    "Recommend security improvements"
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          AI Security Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-80 w-full pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-emerald-600 text-white' 
                      : message.error 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-slate-50 border border-slate-200'
                  }`}>
                    <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-slate-900'}`}>
                      {message.content}
                    </p>
                    
                    {message.insights && message.insights.length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                        <h4 className="font-semibold text-xs text-blue-900 mb-1">Key Insights:</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          {message.insights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-600">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-3 p-2 bg-emerald-50 rounded border border-emerald-200">
                        <h4 className="font-semibold text-xs text-emerald-900 mb-1">Recommendations:</h4>
                        <ul className="text-xs text-emerald-800 space-y-1">
                          {message.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-sm text-slate-600 ml-2">Analyzing...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about your security posture..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery(input)}
              disabled={isProcessing}
            />
            <Button 
              onClick={() => handleQuery(input)} 
              disabled={isProcessing || !input.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleQuery(query)}
                disabled={isProcessing}
                className="text-xs"
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}