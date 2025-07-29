import { useState, useEffect, useRef } from 'react';

export function useWebSocket(url) {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const websocket = useRef(null);

    useEffect(() => {
        // For demo purposes, simulate WebSocket connection
        setConnectionStatus('connected');
        
        // Simulate receiving messages
        const interval = setInterval(() => {
            const demoMessages = [
                { type: 'vulnerability', data: { severity: 'high', component: 'nginx' } },
                { type: 'integration', data: { status: 'connected', service: 'github' } },
                { type: 'scan', data: { progress: 75, target: 'production' } }
            ];
            
            const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
            setMessages(prev => [...prev.slice(-9), { 
                ...randomMessage, 
                timestamp: new Date().toISOString(),
                id: Math.random().toString(36).substr(2, 9)
            }]);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [url]);

    const sendMessage = (message) => {
        // Simulate sending message
        console.log('Sending message:', message);
    };

    return {
        messages,
        sendMessage,
        connectionStatus
    };
}