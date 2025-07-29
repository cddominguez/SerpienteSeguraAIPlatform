import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLanguage } from '@/components/utils/LanguageProvider';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Brain, 
  Target, 
  Users, 
  Monitor, 
  Shield, 
  FileCheck, 
  Hexagon, 
  Database, 
  AlertTriangle, 
  GitBranch, 
  Wifi, 
  Atom, 
  GraduationCap, 
  Settings 
} from 'lucide-react';

const menuItems = [
  {
    title: 'Core Platform',
    items: [
      { title: 'dashboard', icon: LayoutDashboard, url: '/' },
      { title: 'executiveDashboard', icon: TrendingUp, url: '/executive-dashboard' },
    ]
  },
  {
    title: 'AI Security',
    items: [
      { title: 'advancedAISecurityCenter', icon: Brain, url: '/ai-security-center' },
      { title: 'threatHunting', icon: Target, url: '/threat-hunting' },
    ]
  },
  {
    title: 'Security Operations',
    items: [
      { title: 'userSecurity', icon: Users, url: '/user-security' },
      { title: 'deviceManagement', icon: Monitor, url: '/device-management' },
      { title: 'networkSecurity', icon: Shield, url: '/network-security' },
      { title: 'complianceCenter', icon: FileCheck, url: '/compliance-center' },
    ]
  },
  {
    title: 'Advanced Platforms',
    items: [
      { title: 'web3Security', icon: Hexagon, url: '/web3-security' },
      { title: 'dataSecurity', icon: Database, url: '/data-security' },
      { title: 'incidentResponse', icon: AlertTriangle, url: '/incident-response' },
      { title: 'devSecOps', icon: GitBranch, url: '/devsecops' },
      { title: 'iotSecurity', icon: Wifi, url: '/iot-security' },
      { title: 'quantumSafety', icon: Atom, url: '/quantum-safety' },
    ]
  },
  {
    title: 'Platform',
    items: [
      { title: 'trainingCenter', icon: GraduationCap, url: '/training-center' },
      { title: 'settings', icon: Settings, url: '/settings' },
    ]
  }
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">SerpienteSegura</h2>
            <p className="text-xs text-muted-foreground">AI Security Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      isActive={location.pathname === item.url}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{t(item.title)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          © 2024 SerpienteSegura
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}