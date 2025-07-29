import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function DeviceToolbar({ devices, setFilteredDevices }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [osFilter, setOsFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let filtered = devices;
    if (searchTerm) {
      filtered = filtered.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.ip_address.includes(searchTerm));
    }
    if (osFilter !== "all") {
      filtered = filtered.filter(d => d.operating_system === osFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    setFilteredDevices(filtered);
  }, [searchTerm, osFilter, statusFilter, devices, setFilteredDevices]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={osFilter} onValueChange={setOsFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Operating Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All OS</SelectItem>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="macos">macOS</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="protected">Protected</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="compromised">Compromised</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}