
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AutomatedComplianceDashboard({ profile, tasks = [], isLoading, refreshData }) {
  const [aiInsights, setAiInsights] = useState(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    if (profile && (tasks || []).length > 0) {
      generateAIInsights();
    }
  }, [profile, tasks]);

  const generateAIInsights = async () => {
    if (!profile) {
      console.error("Cannot generate AI insights without a compliance profile.");
      return;
    }
    setIsGeneratingInsights(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze the compliance status for ${profile.organization_name} in the ${profile.industry} industry.

Organization Profile: ${JSON.stringify(profile)}
Current Tasks: ${JSON.stringify(tasks.slice(0, 20))}

Provide:
1. Overall compliance health score (0-100)
2. Key compliance achievements
3. Priority risk areas requiring attention
4. Automation opportunities
5. Next 30-day action items`,
        response_json_schema: {
          type: "object",
          properties: {
            compliance_health_score: { type: "number" },
            key_achievements: { type: "array", items: { type: "string" } },
            risk_areas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  risk_level: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            automation_opportunities: { type: "array", items: { type: "string" } },
            action_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  task: { type: "string" },
                  priority: { type: "string" },
                  deadline: { type: "string" }
                }
              }
            }
          }
        }
      });
      setAiInsights(response);
    } catch (error) {
      console.error("Error generating AI insights:", error);
    }
    setIsGeneratingInsights(false);
  };

  const safeTasks = tasks || [];
  const stats = {
    totalTasks: safeTasks.length,
    completedTasks: safeTasks.filter(t => t.status === 'completed').length,
    overdueTasks: safeTasks.filter(t => t.status === 'overdue').length,
    automatedTasks: safeTasks.filter(t => t.status === 'automated').length,
    automationLevel: profile?.automation_level || 0
  };

  const taskStatusData = [
    { name: 'Completed', value: stats.completedTasks },
    { name: 'In Progress', value: safeTasks.filter(t => t.status === 'in_progress').length },
    { name: 'Pending', value: safeTasks.filter(t => t.status === 'pending').length },
    { name: 'Overdue', value: stats.overdueTasks }
  ];

  const frameworkData = profile?.applicable_frameworks?.map(framework => ({
    name: framework,
    tasks: safeTasks.filter(t => t.framework === framework).length,
    completed: safeTasks.filter(t => t.framework === framework && t.status === 'completed').length
  })) || [];

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Compliance Health</CardTitle>
              <Shield className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {aiInsights?.compliance_health_score || 85}%
              </div>
              <Progress value={aiInsights?.compliance_health_score || 85} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Task Completion</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.completedTasks}/{stats.totalTasks}</div>
              <p className="text-xs text-slate-500">
                {isNaN(stats.completedTasks / stats.totalTasks) ? 0 : Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Automation Level</CardTitle>
              <Zap className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.automationLevel}%</div>
              <p className="text-xs text-slate-500">{stats.automatedTasks} automated tasks</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Overdue Tasks</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.overdueTasks}</div>
              <p className="text-xs text-slate-500">Require immediate attention</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Compliance Framework Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frameworkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="tasks" fill="#e2e8f0" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      {aiInsights && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                AI Compliance Insights
              </CardTitle>
              <Button onClick={generateAIInsights} disabled={isGeneratingInsights} size="sm">
                {isGeneratingInsights ? 'Analyzing...' : 'Refresh Insights'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Key Achievements
                  </h3>
                  <ul className="space-y-2">
                    {aiInsights.key_achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    Automation Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {aiInsights.automation_opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Priority Risk Areas
                </h3>
                <div className="space-y-3">
                  {aiInsights.risk_areas.map((risk, index) => (
                    <div key={index} className="p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{risk.area}</span>
                        <Badge variant="destructive">{risk.risk_level}</Badge>
                      </div>
                      <p className="text-sm text-slate-700">{risk.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Next 30 Days Action Items
                </h3>
                <div className="space-y-2">
                  {aiInsights.action_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900 text-sm">{item.task}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-slate-500">{item.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
