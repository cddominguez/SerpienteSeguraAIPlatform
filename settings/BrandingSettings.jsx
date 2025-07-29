import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, Eye } from 'lucide-react';

export default function BrandingSettings() {
  const [brandingSettings, setBrandingSettings] = useState({
    companyName: 'Acme Corporation',
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    customCSS: '',
    showPoweredBy: true,
    customFavicon: '',
    loginPageMessage: 'Welcome to our security platform'
  });

  const [theme, setTheme] = useState({
    mode: 'light',
    customColors: {
      background: '#FFFFFF',
      foreground: '#0F172A',
      sidebar: '#F8FAFC',
      accent: '#3B82F6'
    }
  });

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Source Sans Pro'
  ];

  const presetThemes = [
    { name: 'Default Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    { name: 'Professional Gray', primary: '#6B7280', secondary: '#374151', accent: '#059669' },
    { name: 'Security Red', primary: '#DC2626', secondary: '#991B1B', accent: '#F59E0B' },
    { name: 'Tech Purple', primary: '#7C3AED', secondary: '#5B21B6', accent: '#EC4899' }
  ];

  const applyPresetTheme = (preset) => {
    setBrandingSettings({
      ...brandingSettings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    });
  };

  return (
    <div className="space-y-8">
      {/* Company Branding */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            Company Branding
          </CardTitle>
          <CardDescription>Customize your platform's appearance with your company branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input 
                value={brandingSettings.companyName}
                onChange={(e) => setBrandingSettings({...brandingSettings, companyName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Family</label>
              <select 
                value={brandingSettings.fontFamily}
                onChange={(e) => setBrandingSettings({...brandingSettings, fontFamily: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  {brandingSettings.logoUrl ? (
                    <img src={brandingSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Login Page Message</label>
              <Textarea 
                value={brandingSettings.loginPageMessage}
                onChange={(e) => setBrandingSettings({...brandingSettings, loginPageMessage: e.target.value})}
                rows={3}
                placeholder="Enter a custom message for the login page"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Color Scheme</CardTitle>
          <CardDescription>Customize the platform's color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Themes */}
          <div>
            <label className="text-sm font-medium mb-3 block">Preset Themes</label>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {presetThemes.map((preset, i) => (
                <div 
                  key={i}
                  className="p-4 border border-slate-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => applyPresetTheme(preset)}
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }}></div>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }}></div>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }}></div>
                  </div>
                  <p className="text-sm font-medium">{preset.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Custom Colors */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color"
                  value={brandingSettings.primaryColor}
                  onChange={(e) => setBrandingSettings({...brandingSettings, primaryColor: e.target.value})}
                  className="w-12 h-10 rounded border border-slate-300"
                />
                <Input 
                  value={brandingSettings.primaryColor}
                  onChange={(e) => setBrandingSettings({...brandingSettings, primaryColor: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color"
                  value={brandingSettings.secondaryColor}
                  onChange={(e) => setBrandingSettings({...brandingSettings, secondaryColor: e.target.value})}
                  className="w-12 h-10 rounded border border-slate-300"
                />
                <Input 
                  value={brandingSettings.secondaryColor}
                  onChange={(e) => setBrandingSettings({...brandingSettings, secondaryColor: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex gap-2">
                <input 
                  type="color"
                  value={brandingSettings.accentColor}
                  onChange={(e) => setBrandingSettings({...brandingSettings, accentColor: e.target.value})}
                  className="w-12 h-10 rounded border border-slate-300"
                />
                <Input 
                  value={brandingSettings.accentColor}
                  onChange={(e) => setBrandingSettings({...brandingSettings, accentColor: e.target.value})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Customization */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Advanced Customization</CardTitle>
          <CardDescription>Advanced styling options for complete customization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom CSS</label>
            <Textarea 
              value={brandingSettings.customCSS}
              onChange={(e) => setBrandingSettings({...brandingSettings, customCSS: e.target.value})}
              rows={8}
              placeholder="/* Custom CSS styles */
.sidebar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  border-bottom: 2px solid var(--primary-color);
}"
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show "Powered by SerpienteSegura"</p>
              <p className="text-sm text-slate-600">Display attribution in the footer</p>
            </div>
            <Switch 
              checked={brandingSettings.showPoweredBy}
              onCheckedChange={(checked) => setBrandingSettings({...brandingSettings, showPoweredBy: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            Preview
          </CardTitle>
          <CardDescription>Preview how your branding will appear</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: brandingSettings.primaryColor }}
              >
                {brandingSettings.companyName.charAt(0)}
              </div>
              <h3 className="font-bold text-lg" style={{ fontFamily: brandingSettings.fontFamily }}>
                {brandingSettings.companyName}
              </h3>
            </div>
            <div className="flex gap-2 mb-4">
              <div 
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: brandingSettings.primaryColor }}
              >
                Primary
              </div>
              <div 
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: brandingSettings.secondaryColor }}
              >
                Secondary
              </div>
              <div 
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: brandingSettings.accentColor }}
              >
                Accent
              </div>
            </div>
            <p className="text-sm text-slate-600" style={{ fontFamily: brandingSettings.fontFamily }}>
              {brandingSettings.loginPageMessage}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview Changes
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Branding Settings
        </Button>
      </div>
    </div>
  );
}