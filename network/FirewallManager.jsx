import React, { useState } from "react";
import { FirewallRule } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const ruleTemplate = {
  name: "",
  action: "allow",
  direction: "inbound",
  protocol: "tcp",
  source_ip: "any",
  destination_port: "any",
  is_enabled: true
};

const RuleForm = ({ rule, onSave, onCancel }) => {
  const [formData, setFormData] = useState(rule || ruleTemplate);

  const handleSave = () => {
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Rule Name</Label>
        <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Action</Label>
          <Select value={formData.action} onValueChange={v => handleChange('action', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="allow">Allow</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="log">Log</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Direction</Label>
          <Select value={formData.direction} onValueChange={v => handleChange('direction', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Protocol</Label>
            <Select value={formData.protocol} onValueChange={v => handleChange('protocol', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="udp">UDP</SelectItem>
                <SelectItem value="icmp">ICMP</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="destination_port">Destination Port</Label>
            <Input id="destination_port" value={formData.destination_port} onChange={e => handleChange('destination_port', e.target.value)} />
          </div>
      </div>
      <div>
        <Label htmlFor="source_ip">Source IP/Range</Label>
        <Input id="source_ip" value={formData.source_ip} onChange={e => handleChange('source_ip', e.target.value)} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="is_enabled" checked={formData.is_enabled} onCheckedChange={v => handleChange('is_enabled', v)} />
        <Label htmlFor="is_enabled">Enabled</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="button" onClick={handleSave}>Save Rule</Button>
      </DialogFooter>
    </div>
  );
};


export default function FirewallManager({ initialRules, isLoading, refreshRules }) {
  const [rules, setRules] = useState(initialRules);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  React.useEffect(() => {
    setRules(initialRules);
  }, [initialRules]);

  const handleSaveRule = async (ruleData) => {
    if (editingRule) {
      await FirewallRule.update(editingRule.id, ruleData);
    } else {
      await FirewallRule.create(ruleData);
    }
    await refreshRules();
    setIsFormOpen(false);
    setEditingRule(null);
  };
  
  const handleToggleEnable = async (rule) => {
    await FirewallRule.update(rule.id, { is_enabled: !rule.is_enabled });
    await refreshRules();
  };

  const handleDeleteRule = async (ruleId) => {
    await FirewallRule.delete(ruleId);
    await refreshRules();
  };
  
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setIsFormOpen(true);
  }

  const getActionColor = (action) => ({
    'allow': 'bg-emerald-100 text-emerald-800',
    'block': 'bg-red-100 text-red-800',
    'log': 'bg-blue-100 text-blue-800',
  }[action]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900">Firewall Rule Manager</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit' : 'Create'} Firewall Rule</DialogTitle>
            </DialogHeader>
            <RuleForm 
              rule={editingRule} 
              onSave={handleSaveRule}
              onCancel={() => { setIsFormOpen(false); setEditingRule(null); }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center">Loading rules...</TableCell></TableRow>
            ) : rules.map(rule => (
              <motion.tr key={rule.id} layout>
                <TableCell>
                  <Switch checked={rule.is_enabled} onCheckedChange={() => handleToggleEnable(rule)} />
                </TableCell>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  {rule.direction === 'inbound' ? 
                    <ArrowRight className="w-4 h-4 text-blue-500" /> : 
                    <ArrowLeft className="w-4 h-4 text-orange-500" />
                  }
                </TableCell>
                <TableCell>
                  <Badge className={getActionColor(rule.action)}>{rule.action}</Badge>
                </TableCell>
                <TableCell>{rule.protocol.toUpperCase()}</TableCell>
                <TableCell>{rule.source_ip}</TableCell>
                <TableCell>:{rule.destination_port}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}