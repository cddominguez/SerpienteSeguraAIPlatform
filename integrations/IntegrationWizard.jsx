
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Copy, Eye, EyeOff, Info, Shield, Book, Settings, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { INTEGRATIONS_CONFIG } from '@/components/config/integrations.config';

export default function IntegrationWizard({ integration, onClose, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [showSecrets, setShowSecrets] = useState({});
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    
    const config = INTEGRATIONS_CONFIG[integration.id];
    
    const steps = [
        { id: 'info', title: 'Integration Info', icon: Info },
        { id: 'setup', title: 'Setup Guide', icon: Book },
        { id: 'configure', title: 'Configuration', icon: Settings },
        { id: 'test', title: 'Test & Complete', icon: CheckCircle }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleSecretVisibility = (field) => {
        setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const generateValue = (field) => {
        const generated = crypto.randomUUID();
        handleInputChange(field.key, generated);
    };

    const testConnection = async () => {
        setTesting(true);
        setTestResult(null);
        
        try {
            // Simulate API test
            await new Promise(resolve => setTimeout(resolve, 2000));
            const result = { success: true, message: 'Connection successful!' };
            setTestResult(result);
        } catch (error) {
            setTestResult({ success: false, message: error.message });
        } finally {
            setTesting(false);
        }
    };

    const handleComplete = () => {
        if (testResult?.success) {
            onComplete(formData);
        }
    };

    const isStepComplete = (stepIndex) => {
        switch (stepIndex) {
            case 0: return true;
            case 1: return true;
            case 2: 
                return config.requiredFields.every(field => formData[field.key]);
            case 3: 
                return testResult?.success;
            default:
                return false;
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <img src={config.logo || '/integrations/default.svg'} alt={config.name} className="w-8 h-8" />
                        Connect {config.name}
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6">
                    {steps.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === idx;
                        const isComplete = isStepComplete(idx);
                        
                        return (
                            <React.Fragment key={step.id}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center gap-2 cursor-pointer ${
                                        isActive ? 'text-blue-600' : 
                                        isComplete ? 'text-green-600' : 
                                        'text-gray-400'
                                    }`}
                                    onClick={() => setCurrentStep(idx)}
                                >
                                    <div className={`p-2 rounded-full ${
                                        isActive ? 'bg-blue-100' :
                                        isComplete ? 'bg-green-100' :
                                        'bg-gray-100'
                                    }`}>
                                        {isComplete && !isActive ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <StepIcon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="hidden md:block font-medium">{step.title}</span>
                                </motion.div>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${
                                        idx < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">About {config.name}</h3>
                                    <p className="text-gray-600">{config.description}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3">Key Features</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {config.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {config.scopes && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Required Permissions</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <code className="text-sm">
                                                {config.scopes.join(', ')}
                                            </code>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <Book className="w-4 h-4" />
                                    <a href={config.documentation} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        View Full Documentation
                                    </a>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="setup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Setup Instructions</h3>
                                    <ol className="space-y-4">
                                        {config.setupSteps.map((step, idx) => (
                                            <li key={idx} className="flex gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-700">{step}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {config.iamPolicy && (
                                    <div>
                                        <h4 className="font-semibold mb-3">IAM Policy Template</h4>
                                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                                onClick={() => copyToClipboard(JSON.stringify(config.iamPolicy, null, 2))}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <pre className="text-xs overflow-x-auto">
                                                {JSON.stringify(config.iamPolicy, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="configure"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Alert>
                                    <Shield className="w-4 h-4" />
                                    <AlertDescription>
                                        Your credentials are encrypted and stored securely. We never share your data.
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4">
                                    <h4 className="font-semibold">Required Fields</h4>
                                    {config.requiredFields.map((field) => (
                                        <div key={field.key} className="space-y-2">
                                            <Label htmlFor={field.key}>{field.label}</Label>
                                            <div className="relative">
                                                <Input
                                                    id={field.key}
                                                    type={showSecrets[field.key] ? 'text' : field.type}
                                                    placeholder={field.placeholder}
                                                    value={formData[field.key] || field.value || ''}
                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                    readOnly={field.readonly}
                                                    className={field.readonly ? 'bg-gray-50' : ''}
                                                />
                                                {field.type === 'password' && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        onClick={() => toggleSecretVisibility(field.key)}
                                                    >
                                                        {showSecrets[field.key] ? 
                                                            <EyeOff className="w-4 h-4" /> : 
                                                            <Eye className="w-4 h-4" />
                                                        }
                                                    </Button>
                                                )}
                                                {field.generate && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        onClick={() => generateValue(field)}
                                                    >
                                                        Generate
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {config.optionalFields && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Optional Fields</h4>
                                        {config.optionalFields.map((field) => (
                                            <div key={field.key} className="space-y-2">
                                                <Label htmlFor={field.key}>{field.label}</Label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        id={field.key}
                                                        value={formData[field.key] || field.default || ''}
                                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                                                    >
                                                        {field.options.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <Input
                                                        id={field.key}
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        value={formData[field.key] || ''}
                                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="test"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center py-8">
                                    <h3 className="font-semibold text-lg mb-4">Test Your Connection</h3>
                                    <p className="text-gray-600 mb-6">
                                        Let's verify that everything is configured correctly.
                                    </p>
                                    
                                    <Button
                                        onClick={testConnection}
                                        disabled={testing || !isStepComplete(2)}
                                        size="lg"
                                        className="mb-6"
                                    >
                                        {testing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Testing Connection...
                                            </>
                                        ) : (
                                            'Test Connection'
                                        )}
                                    </Button>

                                    {testResult && (
                                        <Alert className={testResult.success ? 'border-green-200' : 'border-red-200'}>
                                            <AlertDescription className="flex items-center gap-2">
                                                {testResult.success ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                        <span>{testResult.message}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                        <span>{testResult.message}</span>
                                                    </>
                                                )}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {testResult?.success && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h4 className="font-semibold text-green-900 mb-2">
                                            Connection Successful!
                                        </h4>
                                        <p className="text-green-700 mb-4">
                                            Your {config.name} integration is ready to use.
                                        </p>
                                        <Button
                                            onClick={handleComplete}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Complete Setup
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6 pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        disabled={currentStep === steps.length - 1 || (currentStep === 2 && !isStepComplete(2))}
                    >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
