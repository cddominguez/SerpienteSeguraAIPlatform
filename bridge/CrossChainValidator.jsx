import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle, AlertTriangle, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CrossChainValidator() {
    const [transactionHash, setTransactionHash] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const validateTransaction = async () => {
        setIsValidating(true);
        setValidationResult(null);
        
        try {
            const response = await InvokeLLM({
                prompt: `Validate cross-chain transaction security:

Transaction Hash: ${transactionHash || '0xabc123...def456'}

Perform comprehensive validation:
1. Transaction authenticity verification
2. Bridge protocol compliance
3. Multi-signature validation
4. Oracle data consistency
5. Slashing condition checks
6. Finality confirmation
7. Gas optimization analysis
8. MEV protection verification

Provide detailed validation report with security scores.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        transaction_info: {
                            type: "object",
                            properties: {
                                hash: { type: "string" },
                                source_chain: { type: "string" },
                                destination_chain: { type: "string" },
                                amount: { type: "string" },
                                token: { type: "string" },
                                timestamp: { type: "string" }
                            }
                        },
                        validation_results: {
                            type: "object",
                            properties: {
                                authenticity: { type: "boolean" },
                                protocol_compliance: { type: "boolean" },
                                signature_validity: { type: "boolean" },
                                oracle_consistency: { type: "boolean" },
                                finality_confirmed: { type: "boolean" },
                                mev_protected: { type: "boolean" }
                            }
                        },
                        security_score: { type: "number" },
                        risk_factors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    factor: { type: "string" },
                                    severity: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        },
                        recommendations: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                }
            });
            setValidationResult(response);
        } catch (error) {
            console.error("Error validating transaction:", error);
        }
        setIsValidating(false);
    };

    const getValidationIcon = (isValid) => {
        return isValid ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
            <XCircle className="w-5 h-5 text-red-600" />
        );
    };

    const getValidationColor = (isValid) => {
        return isValid ? 'text-green-600' : 'text-red-600';
    };

    const getSeverityColor = (severity) => ({
        High: 'bg-red-500 text-white',
        Medium: 'bg-yellow-500 text-white',
        Low: 'bg-blue-500 text-white'
    }[severity] || 'bg-slate-500 text-white');

    return (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Cross-Chain Transaction Validator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Transaction Hash
                        </label>
                        <Input
                            placeholder="0x1234567890abcdef..."
                            value={transactionHash}
                            onChange={(e) => setTransactionHash(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <Button 
                        onClick={validateTransaction}
                        disabled={isValidating}
                        className="w-full"
                    >
                        {isValidating ? 'Validating...' : 'Validate Transaction'}
                    </Button>
                </CardContent>
            </Card>

            {validationResult && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Transaction Info */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-indigo-600" />
                                Transaction Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Source Chain</p>
                                    <p className="font-semibold">{validationResult.transaction_info.source_chain}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Destination Chain</p>
                                    <p className="font-semibold">{validationResult.transaction_info.destination_chain}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Amount</p>
                                    <p className="font-semibold">{validationResult.transaction_info.amount} {validationResult.transaction_info.token}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Security Score</p>
                                    <p className="text-2xl font-bold text-green-600">{validationResult.security_score}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Validation Results */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Validation Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(validationResult.validation_results).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="font-medium capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {getValidationIcon(value)}
                                            <span className={`font-semibold ${getValidationColor(value)}`}>
                                                {value ? 'Valid' : 'Invalid'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Factors */}
                    {validationResult.risk_factors.length > 0 && (
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                    Risk Factors
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {validationResult.risk_factors.map((risk, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-semibold">{risk.factor}</h5>
                                                <Badge className={getSeverityColor(risk.severity)}>
                                                    {risk.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-600">{risk.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recommendations */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Security Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {validationResult.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <span className="text-slate-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}