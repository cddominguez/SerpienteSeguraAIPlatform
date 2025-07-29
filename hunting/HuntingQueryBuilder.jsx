import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fieldOptions = {
  threats: [
    { value: 'title', label: 'Title' },
    { value: 'severity', label: 'Severity' },
    { value: 'type', label: 'Type' },
    { value: 'status', label: 'Status' },
    { value: 'source_ip', label: 'Source IP' },
    { value: 'risk_score', label: 'Risk Score' },
  ],
  userActivity: [
    { value: 'user_email', label: 'User Email' },
    { value: 'activity_type', label: 'Activity Type' },
    { value: 'resource_accessed', label: 'Resource' },
    { value: 'ip_address', label: 'IP Address' },
    { value: 'location', label: 'Location' },
    { value: 'risk_score', label: 'Risk Score' },
  ],
  devices: [
    { value: 'name', label: 'Name' },
    { value: 'device_type', label: 'Type' },
    { value: 'operating_system', label: 'OS' },
    { value: 'ip_address', label: 'IP Address' },
    { value: 'status', label: 'Status' },
    { value: 'trust_score', label: 'Trust Score' },
  ],
};

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
];

export default function HuntingQueryBuilder({ threats = [], userActivity = [], devices = [], onQueryExecute, isLoading }) {
  const [dataSource, setDataSource] = useState('threats');
  const [clauses, setClauses] = useState([{ field: '', operator: 'equals', value: '' }]);
  const [results, setResults] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);

  const dataSources = {
    threats,
    userActivity,
    devices,
  };

  const handleClauseChange = (index, key, value) => {
    const newClauses = [...clauses];
    newClauses[index][key] = value;
    setClauses(newClauses);
  };

  const addClause = () => {
    setClauses([...clauses, { field: '', operator: 'equals', value: '' }]);
  };

  const removeClause = (index) => {
    const newClauses = clauses.filter((_, i) => i !== index);
    setClauses(newClauses);
  };

  const executeQuery = () => {
    setIsQuerying(true);
    const sourceData = dataSources[dataSource] || [];
    
    const filteredResults = sourceData.filter(item => {
      return clauses.every(clause => {
        if (!clause.field || !clause.value) return true;

        const itemValue = item[clause.field];
        const clauseValue = clause.value;
        
        switch (clause.operator) {
          case 'equals': return String(itemValue).toLowerCase() === clauseValue.toLowerCase();
          case 'not_equals': return String(itemValue).toLowerCase() !== clauseValue.toLowerCase();
          case 'contains': return String(itemValue).toLowerCase().includes(clauseValue.toLowerCase());
          case 'greater_than': return Number(itemValue) > Number(clauseValue);
          case 'less_than': return Number(itemValue) < Number(clauseValue);
          default: return true;
        }
      });
    });

    setResults(filteredResults);
    setIsQuerying(false);
  };

  const currentFields = fieldOptions[dataSource];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            Advanced Query Builder
          </CardTitle>
          <CardDescription>
            Construct complex queries to search across security data sources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Data Source</label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="threats">Threats</SelectItem>
                <SelectItem value="userActivity">User Activity</SelectItem>
                <SelectItem value="devices">Devices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence>
            {clauses.map((clause, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col md:flex-row items-center gap-3 p-4 border rounded-lg bg-slate-50"
              >
                <Select value={clause.field} onValueChange={(v) => handleClauseChange(index, 'field', v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentFields.map(field => (
                      <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={clause.operator} onValueChange={(v) => handleClauseChange(index, 'operator', v)}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatorOptions.map(op => (
                      <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value..."
                  value={clause.value}
                  onChange={(e) => handleClauseChange(index, 'value', e.target.value)}
                  className="flex-1"
                />

                <Button variant="ghost" size="icon" onClick={() => removeClause(index)} className="text-slate-500 hover:text-red-500">
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={addClause}>
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
            <Button onClick={executeQuery} disabled={isQuerying}>
              <Search className="w-4 h-4 mr-2" />
              {isQuerying ? 'Executing...' : 'Execute Query'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Query Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(results[0]).slice(0, 7).map(key => (
                      <th key={key} className="p-2 text-left font-medium">{key.replace(/_/g, ' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 20).map((row, index) => (
                    <motion.tr 
                      key={index} 
                      className="border-b hover:bg-slate-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {Object.values(row).slice(0, 7).map((value, i) => (
                        <td key={i} className="p-2 truncate max-w-xs">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {results.length > 20 && <p className="text-center text-sm text-slate-500 mt-4">...and {results.length - 20} more results.</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !isQuerying && (
         <div className="text-center py-12 text-slate-500">
            <Table className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No results to display</h3>
            <p>Execute a query to see the results here.</p>
          </div>
      )}
    </div>
  );
}