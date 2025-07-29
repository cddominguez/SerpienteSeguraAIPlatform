import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, X } from 'lucide-react';
import { InvokeLLM } from "@/api/integrations";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../utils/LanguageProvider';

export default function AICompanion({ currentPageName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: 'ai',
          text: t('serpienteAIGreeting', { page: currentPageName || 'Dashboard' }),
        },
      ]);
    }
  }, [isOpen, currentPageName, t]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      const prompt = `
        You are Serpiente AI, the AI agent built into the SerpienteSegura cybersecurity platform. Your purpose is to assist the user by answering questions and executing tasks.

        You are currently on the "${currentPageName || 'Dashboard'}" page with the user.

        Your capabilities:
        1. Answer Questions: About the current page, its components, data, and general cybersecurity.
        2. Navigate: You can navigate to other pages. To do this, your response MUST be a JSON object with a "navigate" action.
        3. Suggest Actions: You can suggest actions the user can take.

        RESPONSE FORMAT:
        Your response MUST be a valid JSON object.

        - For a text-only response:
        { "response_text": "The answer to your question is..." }

        - To navigate:
        {
          "response_text": "Taking you to the Device Management page.",
          "action": { "type": "navigate", "payload": "DeviceManagement" }
        }
        
        Now, respond to the user's query: "${inputValue}"
      `;

      const response = await InvokeLLM({ 
        prompt: prompt, 
        response_json_schema: {
          type: "object",
          properties: {
            response_text: { type: "string" },
            action: { 
              type: "object",
              properties: {
                type: { type: "string" },
                payload: { type: "string" }
              }
            }
          },
          required: ["response_text"]
        }
      });
      
      const aiMessage = { sender: 'ai', text: response.response_text };
      setMessages(prev => [...prev, aiMessage]);

      if (response.action && response.action.type === 'navigate') {
        const pagePath = response.action.payload;
        if (pagePath) {
          navigate(createPageUrl(pagePath));
          setIsOpen(false);
        }
      }

    } catch (error) {
      console.error("AI Companion Error:", error);
      const errorMessage = { 
        sender: 'ai', 
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          className="rounded-full w-16 h-16 shadow-lg bg-blue-600 hover:bg-blue-700"
          aria-label="Open AI Assistant"
        >
          <AnimatePresence initial={false}>
            {isOpen ? (
              <motion.div 
                key="x" 
                initial={{ rotate: -90, opacity: 0 }} 
                animate={{ rotate: 0, opacity: 1 }} 
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div 
                key="bot" 
                initial={{ rotate: 90, opacity: 0 }} 
                animate={{ rotate: 0, opacity: 1 }} 
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Bot className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-24 right-6 w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col"
          >
            <header className="p-4 border-b flex items-center gap-3 bg-slate-50 rounded-t-2xl">
              <Bot className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900">Serpiente AI</h3>
                <p className="text-xs text-slate-500">Page: {currentPageName || 'Dashboard'}</p>
              </div>
            </header>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 items-end ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white">
                          <Bot className="w-5 h-5"/>
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-slate-900 text-white rounded-br-none' 
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex gap-3 items-end">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        <Bot className="w-5 h-5"/>
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-400"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <footer className="p-3 border-t">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('askSerpienteAI') || 'Ask Serpiente AI...'}
                  className="pr-10"
                  disabled={isThinking}
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={isThinking || !inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}