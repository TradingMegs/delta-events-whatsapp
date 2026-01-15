import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User, CreditCard, Receipt, Link2, Code, Bell, Users,
  Settings as SettingsIcon
} from "lucide-react";

import ProfileSettings from "@/components/settings/ProfileSettings";
import PaymentReceivingSettings from "@/components/settings/PaymentReceivingSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import AccountingIntegrations from "@/components/settings/AccountingIntegrations";
import APISettings from "@/components/settings/APISettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import TeamSettings from "@/components/settings/TeamSettings";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User, description: "Manage your account" },
  { id: "payments", label: "Payment Receiving", icon: CreditCard, description: "Set up how you get paid" },
  { id: "billing", label: "Billing", icon: Receipt, description: "Subscriptions & invoices" },
  { id: "accounting", label: "Accounting", icon: Link2, description: "Connect bookkeeping platforms" },
  { id: "api", label: "API Config", icon: Code, description: "AI providers & integrations" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alert preferences" },
  { id: "team", label: "Team", icon: Users, description: "Members & permissions" },
];

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6 lg:p-8">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s'}} />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 px-3 py-1 text-xs uppercase tracking-widest font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 animate-pulse" />
            System Configuration
          </Badge>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon className="w-10 h-10 text-purple-400" />
          Settings
        </h1>
        <p className="text-gray-400 max-w-xl">
          Configure your account, payment methods, integrations, and team permissions.
        </p>
      </div>

      {/* Settings Content */}
      <div className="relative z-10">
        <Tabs defaultValue="profile" className="space-y-6">
          {/* Tab Navigation */}
          <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-2">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-transparent h-auto">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="group flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 bg-[#0A0A0F]/50 border border-transparent hover:border-[#27272A] hover:bg-[#1C1C22] data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border-purple-500/30 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/10"
                    >
                      <Icon className="w-5 h-5 text-gray-500 group-data-[state=active]:text-purple-400" />
                      <span className="text-xs font-medium text-gray-400 group-data-[state=active]:text-white">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </CardContent>
          </Card>

          {/* Tab Content Panels */}
          <TabsContent value="profile" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="payments" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <PaymentReceivingSettings />
          </TabsContent>

          <TabsContent value="billing" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <BillingSettings />
          </TabsContent>

          <TabsContent value="accounting" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <AccountingIntegrations />
          </TabsContent>

          <TabsContent value="api" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <APISettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="team" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
            <TeamSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
