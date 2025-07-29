import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Globe, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../utils/LanguageProvider';
import { getCurrentLanguage } from '../utils/i18n';

export default function LocalizationSettings() {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [localizationSettings, setLocalizationSettings] = useState({
    defaultLanguage: getCurrentLanguage(),
    defaultTimezone: 'UTC',
    defaultCurrency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: 'US',
    enableRTL: ['ar', 'he'].includes(getCurrentLanguage())
  });

  const [enabledLanguages, setEnabledLanguages] = useState(['en', 'es', 'fr', 'de']);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney', 'America/Sao_Paulo'
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  const toggleLanguage = (langCode) => {
    if (enabledLanguages.includes(langCode)) {
      setEnabledLanguages(enabledLanguages.filter(l => l !== langCode));
    } else {
      setEnabledLanguages([...enabledLanguages, langCode]);
    }
  };

  const handleLanguageChange = (langCode) => {
    setLocalizationSettings({...localizationSettings, defaultLanguage: langCode});
    changeLanguage(langCode);
  };

  return (
    <div className="space-y-8">
      {/* Default Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Default Localization Settings
          </CardTitle>
          <CardDescription>Configure default language, timezone, and formatting preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Language</label>
              <Select 
                value={localizationSettings.defaultLanguage} 
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Timezone</label>
              <Select 
                value={localizationSettings.defaultTimezone} 
                onValueChange={(value) => setLocalizationSettings({...localizationSettings, defaultTimezone: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Currency</label>
              <Select 
                value={localizationSettings.defaultCurrency} 
                onValueChange={(value) => setLocalizationSettings({...localizationSettings, defaultCurrency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Format</label>
              <Select 
                value={localizationSettings.dateFormat} 
                onValueChange={(value) => setLocalizationSettings({...localizationSettings, dateFormat: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (European)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Right-to-Left (RTL) Support</p>
              <p className="text-sm text-slate-600">Support for Arabic, Hebrew, and other RTL languages</p>
            </div>
            <Switch 
              checked={localizationSettings.enableRTL}
              onCheckedChange={(checked) => setLocalizationSettings({...localizationSettings, enableRTL: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Management */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Supported Languages</CardTitle>
          <CardDescription>Enable or disable languages for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((language) => (
              <div key={language.code} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <p className="font-medium text-slate-900">{language.name}</p>
                    <p className="text-sm text-slate-500">{language.code.toUpperCase()}</p>
                  </div>
                </div>
                <Switch 
                  checked={enabledLanguages.includes(language.code) || language.code === currentLanguage}
                  onCheckedChange={() => toggleLanguage(language.code)}
                  disabled={language.code === localizationSettings.defaultLanguage}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Regional Formatting
          </CardTitle>
          <CardDescription>Configure formatting preferences for different regions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Format</label>
              <Select 
                value={localizationSettings.timeFormat} 
                onValueChange={(value) => setLocalizationSettings({...localizationSettings, timeFormat: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Number Format</label>
              <Select 
                value={localizationSettings.numberFormat} 
                onValueChange={(value) => setLocalizationSettings({...localizationSettings, numberFormat: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">1,234.56 (US)</SelectItem>
                  <SelectItem value="EU">1.234,56 (European)</SelectItem>
                  <SelectItem value="IN">1,23,456.78 (Indian)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          {t('save')} Localization Settings
        </Button>
      </div>
    </div>
  );
}