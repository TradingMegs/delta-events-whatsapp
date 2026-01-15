import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bell, Mail, MessageSquare, Phone, Calendar, TrendingUp,
  Users, AlertTriangle, Sparkles, Volume2, VolumeX
} from "lucide-react";

const notificationCategories = [
  {
    id: "deals",
    title: "Deals & Pipeline",
    icon: TrendingUp,
    color: "text-green-400",
    notifications: [
      { id: "deal_won", label: "Deal won", description: "When a deal is marked as won", email: true, push: true, inApp: true },
      { id: "deal_lost", label: "Deal lost", description: "When a deal is marked as lost", email: true, push: false, inApp: true },
      { id: "deal_stage", label: "Stage changes", description: "When a deal moves to a new stage", email: false, push: true, inApp: true },
      { id: "deal_reminder", label: "Follow-up reminders", description: "Scheduled follow-up notifications", email: true, push: true, inApp: true },
    ]
  },
  {
    id: "contacts",
    title: "Contacts & Communication",
    icon: Users,
    color: "text-blue-400",
    notifications: [
      { id: "new_contact", label: "New contact added", description: "When a new contact is created", email: false, push: false, inApp: true },
      { id: "email_reply", label: "Email replies", description: "When someone replies to your email", email: true, push: true, inApp: true },
      { id: "missed_call", label: "Missed calls", description: "Notification for missed phone calls", email: true, push: true, inApp: true },
    ]
  },
  {
    id: "calendar",
    title: "Calendar & Meetings",
    icon: Calendar,
    color: "text-purple-400",
    notifications: [
      { id: "meeting_reminder", label: "Meeting reminders", description: "Before scheduled meetings", email: true, push: true, inApp: true },
      { id: "meeting_cancelled", label: "Meeting cancelled", description: "When a meeting is cancelled", email: true, push: true, inApp: true },
      { id: "meeting_rescheduled", label: "Meeting rescheduled", description: "When a meeting time changes", email: true, push: true, inApp: true },
    ]
  },
  {
    id: "ai",
    title: "AI Insights",
    icon: Sparkles,
    color: "text-yellow-400",
    notifications: [
      { id: "ai_recommendation", label: "AI recommendations", description: "Smart suggestions from your AI assistants", email: false, push: true, inApp: true },
      { id: "churn_risk", label: "Churn risk alerts", description: "When a customer shows churn signals", email: true, push: true, inApp: true },
      { id: "opportunity", label: "Opportunity detection", description: "When AI detects new opportunities", email: true, push: true, inApp: true },
    ]
  },
  {
    id: "system",
    title: "System & Security",
    icon: AlertTriangle,
    color: "text-red-400",
    notifications: [
      { id: "login_alert", label: "New login alerts", description: "When your account is accessed from new device", email: true, push: true, inApp: true },
      { id: "integration_error", label: "Integration errors", description: "When a connected service has issues", email: true, push: false, inApp: true },
      { id: "billing", label: "Billing updates", description: "Payment and subscription notifications", email: true, push: false, inApp: true },
    ]
  }
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState(() => {
    const initial = {};
    notificationCategories.forEach(cat => {
      cat.notifications.forEach(n => {
        initial[n.id] = { email: n.email, push: n.push, inApp: n.inApp };
      });
    });
    return initial;
  });

  const [globalSettings, setGlobalSettings] = useState({
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    soundEnabled: true
  });

  const toggleSetting = (notificationId, channel) => {
    setSettings(prev => ({
      ...prev,
      [notificationId]: {
        ...prev[notificationId],
        [channel]: !prev[notificationId][channel]
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl">
        <CardHeader className="border-b border-[#27272A]">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-gray-400">
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
              <div className="flex items-center gap-3">
                {globalSettings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <h4 className="text-white font-medium">Sound Effects</h4>
                  <p className="text-gray-500 text-sm">Play sounds for notifications</p>
                </div>
              </div>
              <Switch 
                checked={globalSettings.soundEnabled}
                onCheckedChange={(v) => setGlobalSettings({...globalSettings, soundEnabled: v})}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="text-white font-medium">Quiet Hours</h4>
                  <p className="text-gray-500 text-sm">Pause notifications during set hours</p>
                </div>
              </div>
              <Switch 
                checked={globalSettings.quietHoursEnabled}
                onCheckedChange={(v) => setGlobalSettings({...globalSettings, quietHoursEnabled: v})}
              />
            </div>
          </div>
          
          {globalSettings.quietHoursEnabled && (
            <div className="mt-4 p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">From</span>
                <Select 
                  value={globalSettings.quietHoursStart} 
                  onValueChange={(v) => setGlobalSettings({...globalSettings, quietHoursStart: v})}
                >
                  <SelectTrigger className="w-28 bg-[#0A0A0F] border-[#27272A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                    {["20:00", "21:00", "22:00", "23:00"].map(t => (
                      <SelectItem key={t} value={t} className="text-white">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-gray-400 text-sm">to</span>
                <Select 
                  value={globalSettings.quietHoursEnd} 
                  onValueChange={(v) => setGlobalSettings({...globalSettings, quietHoursEnd: v})}
                >
                  <SelectTrigger className="w-28 bg-[#0A0A0F] border-[#27272A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                    {["06:00", "07:00", "08:00", "09:00"].map(t => (
                      <SelectItem key={t} value={t} className="text-white">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {notificationCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.id} className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Icon className={`w-5 h-5 ${category.color}`} />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Header Row */}
                <div className="flex items-center justify-end gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">
                  <span className="w-16 text-center">Email</span>
                  <span className="w-16 text-center">Push</span>
                  <span className="w-16 text-center">In-App</span>
                </div>
                
                {category.notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A] hover:border-[#3F3F46] transition-colors"
                  >
                    <div>
                      <h4 className="text-white font-medium">{notification.label}</h4>
                      <p className="text-gray-500 text-sm">{notification.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 flex justify-center">
                        <Switch 
                          checked={settings[notification.id]?.email}
                          onCheckedChange={() => toggleSetting(notification.id, 'email')}
                        />
                      </div>
                      <div className="w-16 flex justify-center">
                        <Switch 
                          checked={settings[notification.id]?.push}
                          onCheckedChange={() => toggleSetting(notification.id, 'push')}
                        />
                      </div>
                      <div className="w-16 flex justify-center">
                        <Switch 
                          checked={settings[notification.id]?.inApp}
                          onCheckedChange={() => toggleSetting(notification.id, 'inApp')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
