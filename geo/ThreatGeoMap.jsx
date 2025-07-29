import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ThreatGeoMap({ threats }) {
  const [geoThreats, setGeoThreats] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    processGeoThreats();
  }, [threats]);

  const processGeoThreats = () => {
    const geoData = {};
    
    threats.forEach(threat => {
      if (threat.source_ip) {
        // Simulate geo-location based on IP patterns
        const country = getCountryFromIP(threat.source_ip);
        const coords = getCoordinatesFromCountry(country);
        
        if (!geoData[country]) {
          geoData[country] = {
            country,
            ...coords,
            threat_count: 0,
            severity_levels: [],
            ips: []
          };
        }
        
        geoData[country].threat_count++;
        geoData[country].severity_levels.push(threat.severity);
        geoData[country].ips.push(threat.source_ip);
      }
    });

    const processed = Object.values(geoData).map(geo => ({
      ...geo,
      severity_level: getMostCommonSeverity(geo.severity_levels),
      is_blocked: geo.threat_count > 5
    }));

    setGeoThreats(processed);
  };

  const getCountryFromIP = (ip) => {
    // Simplified geo-mapping based on IP ranges
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 50) return 'United States';
    if (firstOctet >= 51 && firstOctet <= 100) return 'China';
    if (firstOctet >= 101 && firstOctet <= 150) return 'Russia';
    if (firstOctet >= 151 && firstOctet <= 200) return 'Germany';
    return 'Unknown';
  };

  const getCoordinatesFromCountry = (country) => {
    const coords = {
      'United States': { latitude: 39.8283, longitude: -98.5795 },
      'China': { latitude: 35.8617, longitude: 104.1954 },
      'Russia': { latitude: 61.5240, longitude: 105.3188 },
      'Germany': { latitude: 51.1657, longitude: 10.4515 },
      'Unknown': { latitude: 0, longitude: 0 }
    };
    return coords[country] || coords['Unknown'];
  };

  const getMostCommonSeverity = (severities) => {
    const counts = {};
    severities.forEach(s => counts[s] = (counts[s] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const getSeverityColor = (severity) => ({
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  }[severity] || 'bg-gray-500');

  const blockCountry = async (country) => {
    // Simulate blocking action
    setGeoThreats(prev => 
      prev.map(geo => 
        geo.country === country ? {...geo, is_blocked: true} : geo
      )
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Global Threat Intelligence Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* World Map Visualization */}
        <div className="bg-slate-100 rounded-lg p-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {geoThreats.map((geo, index) => (
              <motion.div
                key={geo.country}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedCountry === geo.country ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-slate-200'
                }`}
                onClick={() => setSelectedCountry(geo.country)}
              >
                <div className="flex items-center justify-between mb-2">
                  <MapPin className={`w-4 h-4 ${getSeverityColor(geo.severity_level).replace('bg-', 'text-')}`} />
                  {geo.is_blocked && <Shield className="w-4 h-4 text-emerald-600" />}
                </div>
                <h3 className="font-semibold text-sm">{geo.country}</h3>
                <p className="text-xs text-slate-600">{geo.threat_count} threats</p>
                <Badge className={`${getSeverityColor(geo.severity_level)} text-white text-xs`}>
                  {geo.severity_level}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Country Details */}
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-50 rounded-lg"
          >
            {(() => {
              const selected = geoThreats.find(g => g.country === selectedCountry);
              return (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">{selected.country}</h3>
                    <div className="flex gap-2">
                      {!selected.is_blocked && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => blockCountry(selected.country)}
                        >
                          Block Country
                        </Button>
                      )}
                      {selected.is_blocked && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Blocked
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">Total Threats</p>
                      <p className="text-slate-600">{selected.threat_count}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Severity Level</p>
                      <Badge className={`${getSeverityColor(selected.severity_level)} text-white`}>
                        {selected.severity_level}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-slate-700 mb-1">Source IPs</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.ips.slice(0, 5).map(ip => (
                          <Badge key={ip} variant="outline" className="text-xs">
                            {ip}
                          </Badge>
                        ))}
                        {selected.ips.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{selected.ips.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}