import React, { useState, useEffect } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rss, Search, ExternalLink, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberNewsFeed() {
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchLatestNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [newsItems, searchTerm, categoryFilter]);

  const fetchLatestNews = async () => {
    setIsLoading(true);
    try {
      const response = await InvokeLLM({
        prompt: `Provide the latest cybersecurity, hacking, and AI security news. 
        Include recent vulnerabilities, data breaches, new attack methods, AI security developments, 
        and important security advisories. Make it current and relevant for security professionals.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            news_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  category: { 
                    type: "string",
                    enum: ["cybersecurity", "hacking", "ai", "vulnerability", "breach"]
                  },
                  source: { type: "string" },
                  severity: {
                    type: "string", 
                    enum: ["informational", "advisory", "warning", "critical"]
                  },
                  tags: { 
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      setNewsItems(response.news_items || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback to sample data
      setNewsItems([
        {
          title: "Critical Zero-Day Vulnerability Discovered in Popular VPN Software",
          summary: "Security researchers have identified a critical RCE vulnerability affecting millions of users worldwide.",
          category: "vulnerability",
          source: "CyberSecurity Today",
          severity: "critical",
          tags: ["zero-day", "vpn", "rce"]
        },
        {
          title: "AI-Powered Ransomware Campaign Targets Financial Institutions",
          summary: "New strain of ransomware uses machine learning to evade traditional detection methods.",
          category: "ai",
          source: "Security Week",
          severity: "warning", 
          tags: ["ransomware", "ai", "financial"]
        }
      ]);
    }
    setIsLoading(false);
  };

  const filterNews = () => {
    let filtered = newsItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredNews(filtered);
  };

  const getSeverityColor = (severity) => ({
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-orange-100 text-orange-800 border-orange-200",
    advisory: "bg-yellow-100 text-yellow-800 border-yellow-200",
    informational: "bg-blue-100 text-blue-800 border-blue-200"
  }[severity] || "bg-slate-100 text-slate-800 border-slate-200");

  const getCategoryColor = (category) => ({
    cybersecurity: "bg-blue-50 text-blue-700",
    hacking: "bg-red-50 text-red-700", 
    ai: "bg-purple-50 text-purple-700",
    vulnerability: "bg-orange-50 text-orange-700",
    breach: "bg-red-50 text-red-700"
  }[category] || "bg-slate-50 text-slate-700");

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Rss className="w-5 h-5 text-orange-600" />
          Cyber Intelligence Feed
        </CardTitle>
        <Button 
          onClick={fetchLatestNews} 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? "Loading..." : "Refresh Feed"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              <SelectItem value="hacking">Hacking</SelectItem>
              <SelectItem value="ai">AI Security</SelectItem>
              <SelectItem value="vulnerability">Vulnerabilities</SelectItem>
              <SelectItem value="breach">Data Breaches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* News Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredNews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 flex-1 pr-4">
                    {item.title}
                  </h3>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(item.severity)}>
                      {item.severity}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{item.summary}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.source}
                    </span>
                    {item.tags && (
                      <div className="flex gap-1">
                        {item.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredNews.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Rss className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">No news found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}