import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, Globe, Eye, Search, Database } from 'lucide-react';
import { ThreatIntelligence } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

export default function ThreatIntelligencePanel() {
  const [threatData, setThreatData] = useState([]);
  const [searchIP, setSearchIP] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [isLooking, setIsLooking] = useState(false);

  useEffect(() => {
    loadThreatIntelligence();
  }, []);

  const loadThreatIntelligence = async () => {
    const data = await ThreatIntelligence.list('-created_date', 50);
    setThreatData(data);
  };

  const lookupIP = async () => {
    if (!searchIP) return;
    
    setIsLooking(true);
    setLookupResult(null);

    try {
      const response = await InvokeLLM({
        prompt: `Perform a comprehensive threat intelligence lookup for IP address: ${searchIP}

Analyze this IP for:
1. Reputation and trust score
2. Blacklist status across major threat feeds
3. Geolocation and ISP information
4. Historical malicious activity
5. Association with known threat actors
6. VPN/Proxy/Tor usage
7. Datacenter vs residential classification

Provide a detailed security assessment.`,
        response_json_schema: {
          type: "object",
          properties: {
            ip_address: { type: "string" },
            reputation_score: { type: "number", minimum: 0, maximum: 100 },
            risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
            is_blacklisted: { type: "boolean" },
            blacklist_sources: { type: "array", items: { type: "string" } },
            is_vpn: { type: "boolean" },
            is_tor: { type: "boolean" },
            is_datacenter: { type: "boolean" },
            geolocation: { type: "object", properties: { country: { type: "string" }, city: { type: "string" }, isp: { type: "string" } } },
            threat_categories: { type: "array", items: { type: "string" } },
            malware_families: { type: "array", items: { type: "string" } },
            attack_types: { type: "array", items: { type: "string" } },
            abuse_reports: { type: "number" },
            first_seen: { type: "string" },
            last_seen: { type: "string" },
            summary: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      setLookupResult(response);
    } catch (error) {
      console.error("IP lookup failed:", error);
      setLookupResult({ error: "Failed to lookup IP address" });
    }
    setIsLooking(false);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* IP Lookup Tool */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            IP Threat Intelligence Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Enter IP address to analyze..."
              value={searchIP}
              onChange={(e) => setSearchIP(e.target.value)}
              className="flex-1"
            />
            <Button onClick={lookupIP} disabled={isLooking || !searchIP}>
              {isLooking ? 'Analyzing...' : 'Lookup'}
            </Button>
          </div>

          {lookupResult && !lookupResult.error && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg">Analysis: {lookupResult.ip_address}</h4>
                <Badge className={getRiskColor(lookupResult.risk_level)}>
                  {lookupResult.risk_level} Risk
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Reputation & Classification</h5>
                  <div className="space-y-2 text-sm">
                    <div>Reputation Score: <span className="font-bold">{lookupResult.reputation_score}/100</span></div>
                    <div>Location: {lookupResult.geolocation?.city}, {lookupResult.geolocation?.country}</div>
                    <div>ISP: {lookupResult.geolocation?.isp}</div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {lookupResult.is_vpn && <Badge variant="outline">VPN</Badge>}
                      {lookupResult.is_tor && <Badge variant="outline">Tor</Badge>}
                      {lookupResult.is_datacenter && <Badge variant="outline">Datacenter</Badge>}
                      {lookupResult.is_blacklisted && <Badge variant="destructive">Blacklisted</Badge>}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Threat Intelligence</h5>
                  <div className="space-y-2 text-sm">
                    <div>Abuse Reports: {lookupResult.abuse_reports || 0}</div>
                    <div>First Seen: {lookupResult.first_seen || 'Unknown'}</div>
                    <div>Last Seen: {lookupResult.last_seen || 'Unknown'}</div>
                  </div>
                </div>
              </div>

              {lookupResult.threat_categories?.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Threat Categories</h5>
                  <div className="flex gap-2 flex-wrap">
                    {lookupResult.threat_categories.map((category, i) => (
                      <Badge key={i} variant="destructive">{category}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {lookupResult.blacklist_sources?.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Blacklist Sources</h5>
                  <div className="flex gap-2 flex-wrap">
                    {lookupResult.blacklist_sources.map((source, i) => (
                      <Badge key={i} variant="outline">{source}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h5 className="font-semibold mb-2">Summary</h5>
                <p className="text-sm text-slate-700">{lookupResult.summary}</p>
              </div>

              {lookupResult.recommendations?.length > 0 && (
                <div>
                  <h5 className="font-semibold mb-2">Recommendations</h5>
                  <ul className="text-sm space-y-1">
                    {lookupResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Shield className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {lookupResult?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{lookupResult.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threat Intelligence Database */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Threat Intelligence Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threatData.slice(0, 10).map((threat) => (
              <div key={threat.id} className="p-3 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-sm">{threat.ip_address}</div>
                  <Badge className={threat.reputation_score < 30 ? 'bg-red-500 text-white' : threat.reputation_score < 70 ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}>
                    Score: {threat.reputation_score}
                  </Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap mb-2">
                  {threat.is_blacklisted && <Badge variant="destructive">Blacklisted</Badge>}
                  {threat.is_tor_node && <Badge variant="outline">Tor</Badge>}
                  {threat.is_vpn && <Badge variant="outline">VPN</Badge>}
                  {threat.is_datacenter && <Badge variant="outline">Datacenter</Badge>}
                </div>

                {threat.attack_types?.length > 0 && (
                  <div className="text-xs text-slate-600">
                    Attack Types: {threat.attack_types.join(', ')}
                  </div>
                )}

                {threat.abuse_reports > 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    {threat.abuse_reports} abuse reports
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}