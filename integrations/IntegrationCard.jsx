import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Settings, Trash2 } from 'lucide-react';

export default function IntegrationCard({ integration, delay, onConnect }) {
    const statusConfig = {
        connected: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
        available: { icon: null, color: 'text-gray-600', bg: 'bg-gray-100' }
    };

    const status = statusConfig[integration.status] || statusConfig.available;
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
        >
            <Card className="h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <img 
                                    src={integration.logo || '/integrations/default.svg'} 
                                    alt={integration.name}
                                    className="w-8 h-8"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{integration.name}</h3>
                                <p className="text-sm text-gray-500">{integration.category}</p>
                            </div>
                        </div>
                        {StatusIcon && (
                            <div className={`p-2 rounded-full ${status.bg}`}>
                                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {integration.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {integration.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                            </Badge>
                        ))}
                        {integration.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{integration.features.length - 3} more
                            </Badge>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {integration.status === 'connected' ? (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => onConnect(integration)}
                                >
                                    <Settings className="w-4 h-4 mr-1" />
                                    Configure
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => onConnect(integration)}
                            >
                                Connect
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}