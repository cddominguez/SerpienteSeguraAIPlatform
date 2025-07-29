import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Shield, Activity } from 'lucide-react';

export default function IoTSecurity() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            IoT Security Center
          </h1>
          <p className="text-slate-600">
            Comprehensive IoT and OT network security monitoring
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-teal-600" />
              IoT Security Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                IoT Security Features Coming Soon
              </h3>
              <p className="text-slate-600 mb-6">
                Advanced IoT device discovery, vulnerability assessment, and network segmentation capabilities are in development.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-teal-50 rounded-lg">
                  <Activity className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Device Discovery</h4>
                  <p className="text-sm text-slate-600">Automatic IoT device identification</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <Shield className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Vulnerability Scanning</h4>
                  <p className="text-sm text-slate-600">IoT-specific security assessments</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <Wifi className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Network Segmentation</h4>
                  <p className="text-sm text-slate-600">Automated IoT network isolation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}