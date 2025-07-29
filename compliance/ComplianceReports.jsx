import React, { useState } from "react";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function ComplianceReports({ frameworks, controls, isLoading }) {
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExecutiveReport = async () => {
    setIsGenerating(true);
    try {
      const response = await InvokeLLM({
        prompt: `Generate a comprehensive executive compliance report based on the following data:

Compliance Frameworks: ${JSON.stringify(frameworks)}
Security Controls: ${JSON.stringify(controls)}

Provide:
1. Executive summary of overall compliance posture
2. Key achievements and certifications maintained
3. Risk areas that need attention
4. Recommendations for improving compliance
5. Compliance trend analysis
6. Action items for leadership`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            key_achievements: { type: "array", items: { type: "string" } },
            risk_areas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  risk_level: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            recommendations: { type: "array", items: { type: "string" } },
            action_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: { type: "string" },
                  priority: { type: "string" },
                  timeline: { type: "string" }
                }
              }
            }
          }
        }
      });
      setReport(response);
    } catch (error) {
      console.error("Error generating report:", error);
    }
    setIsGenerating(false);
  };

  const complianceData = frameworks.map(f => ({
    name: f.name,
    score: f.compliance_score,
    status: f.status
  }));

  const controlsData = [
    { name: 'Implemented', value: controls.filter(c => c.implementation_status === 'implemented').length },
    { name: 'Partial', value: controls.filter(c => c.implementation_status === 'partial').length },
    { name: 'Planned', value: controls.filter(c => c.implementation_status === 'planned').length },
    { name: 'Not Implemented', value: controls.filter(c => c.implementation_status === 'not_implemented').length }
  ];

  return (
    <div className="space-y-8">
      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Compliance Scores by Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Security Controls Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={controlsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {controlsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Report Generation */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            AI-Generated Executive Compliance Report
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={generateExecutiveReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
            {report && (
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {report && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-2">Executive Summary</h3>
                  <p className="text-slate-700">{report.executive_summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Key Achievements
                    </h3>
                    <ul className="space-y-2">
                      {report.key_achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      Action Items
                    </h3>
                    <div className="space-y-2">
                      {report.action_items.map((item, index) => (
                        <div key={index} className="p-3 border border-slate-200 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900 text-sm">{item.item}</span>
                            <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                              {item.priority}
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-600">Timeline: {item.timeline}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Risk Areas Requiring Attention</h3>
                  <div className="space-y-3">
                    {report.risk_areas.map((risk, index) => (
                      <div key={index} className="p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">{risk.area}</span>
                          <Badge variant="destructive">{risk.risk_level}</Badge>
                        </div>
                        <p className="text-sm text-slate-700">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!report && !isGenerating && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Generate an AI-powered executive compliance report</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}