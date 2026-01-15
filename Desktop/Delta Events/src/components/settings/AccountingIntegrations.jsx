import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Link2, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings,
  ExternalLink, Loader2, Database, ArrowLeftRight, Clock, Zap
} from "lucide-react";
import { toast } from "sonner";

// Storage key for accounting integrations
const STORAGE_KEY = 'apex_accounting_integrations';

// Get saved integrations
const getIntegrations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save integrations
const saveIntegrations = (integrations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
};

// Accounting platform configurations
const PLATFORMS = {
  quickbooks: {
    id: "quickbooks",
    name: "QuickBooks Online",
    description: "Most popular small business accounting software",
    icon: "/icons/quickbooks.svg",
    iconFallback: "📊",
    color: "from-green-500 to-green-600",
    brandColor: "#2CA01C",
    features: ["Invoice sync", "Expense tracking", "Financial reports", "Bank reconciliation"],
    syncCapabilities: ["Invoices", "Payments", "Customers", "Expenses", "Products"]
  },
  xero: {
    id: "xero",
    name: "Xero",
    description: "Cloud-based accounting platform for growing businesses",
    icon: "/icons/xero.svg",
    iconFallback: "📈",
    color: "from-blue-400 to-blue-500",
    brandColor: "#13B5EA",
    features: ["Real-time sync", "Multi-currency", "Project tracking", "Payroll"],
    syncCapabilities: ["Invoices", "Payments", "Contacts", "Bank transactions"]
  },
  freshbooks: {
    id: "freshbooks",
    name: "FreshBooks",
    description: "Simple invoicing & accounting for freelancers",
    icon: "/icons/freshbooks.svg",
    iconFallback: "📝",
    color: "from-emerald-500 to-teal-500",
    brandColor: "#0DA83E",
    features: ["Time tracking", "Easy invoicing", "Expense management", "Proposals"],
    syncCapabilities: ["Invoices", "Time entries", "Expenses", "Clients"]
  },
  wave: {
    id: "wave",
    name: "Wave",
    description: "Free accounting software for small businesses",
    icon: "/icons/wave.svg",
    iconFallback: "🌊",
    color: "from-indigo-500 to-purple-500",
    brandColor: "#4C51BF",
    features: ["Free accounting", "Invoicing", "Receipt scanning", "Financial reports"],
    syncCapabilities: ["Invoices", "Transactions", "Customers", "Products"]
  },
  sage: {
    id: "sage",
    name: "Sage Business Cloud",
    description: "Enterprise-grade accounting and business management",
    icon: "/icons/sage.svg",
    iconFallback: "🏢",
    color: "from-green-600 to-green-700",
    brandColor: "#00D639",
    features: ["ERP integration", "Inventory management", "Payroll", "Advanced reporting"],
    syncCapabilities: ["Invoices", "Orders", "Inventory", "Payments", "Customers"]
  },
  zohobooks: {
    id: "zohobooks",
    name: "Zoho Books",
    description: "Part of the Zoho ecosystem for seamless integration",
    icon: "/icons/zoho.svg",
    iconFallback: "📚",
    color: "from-red-500 to-orange-500",
    brandColor: "#D32F2F",
    features: ["Zoho CRM sync", "Banking feeds", "Inventory", "Time billing"],
    syncCapabilities: ["Invoices", "Contacts", "Payments", "Items", "Projects"]
  }
};

export default function AccountingIntegrations() {
  const [integrations, setIntegrations] = useState(getIntegrations);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [syncingPlatform, setSyncingPlatform] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  // Connect to a platform (simulated OAuth)
  const connectPlatform = async (platformId) => {
    setConnectingPlatform(platformId);
    
    // Simulate OAuth redirect and callback
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const platform = PLATFORMS[platformId];
    const newIntegration = {
      id: `${platformId}_${Date.now()}`,
      platform: platformId,
      status: "active",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      syncStatus: "success",
      accountName: `My ${platform.name} Account`,
      syncedItems: {
        invoices: Math.floor(Math.random() * 100) + 20,
        customers: Math.floor(Math.random() * 50) + 10,
        payments: Math.floor(Math.random() * 80) + 15
      }
    };
    
    const updatedIntegrations = [...integrations, newIntegration];
    setIntegrations(updatedIntegrations);
    saveIntegrations(updatedIntegrations);
    setConnectingPlatform(null);
    
    toast.success(`Connected to ${platform.name}!`, {
      description: "Initial sync will begin automatically."
    });
  };

  // Disconnect from a platform
  const disconnectPlatform = (integrationId) => {
    const integration = integrations.find(i => i.id === integrationId);
    const platform = PLATFORMS[integration?.platform];
    
    const updatedIntegrations = integrations.filter(i => i.id !== integrationId);
    setIntegrations(updatedIntegrations);
    saveIntegrations(updatedIntegrations);
    setShowDetailsDialog(false);
    
    toast.success(`Disconnected from ${platform?.name}`, {
      description: "Data will remain in both systems."
    });
  };

  // Trigger a sync
  const syncPlatform = async (integrationId) => {
    setSyncingPlatform(integrationId);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const updatedIntegrations = integrations.map(i => {
      if (i.id === integrationId) {
        return {
          ...i,
          lastSyncAt: new Date().toISOString(),
          syncStatus: "success",
          syncedItems: {
            invoices: (i.syncedItems?.invoices || 0) + Math.floor(Math.random() * 5),
            customers: (i.syncedItems?.customers || 0) + Math.floor(Math.random() * 3),
            payments: (i.syncedItems?.payments || 0) + Math.floor(Math.random() * 4)
          }
        };
      }
      return i;
    });
    
    setIntegrations(updatedIntegrations);
    saveIntegrations(updatedIntegrations);
    setSyncingPlatform(null);
    
    toast.success("Sync completed!", {
      description: "All data is now up to date."
    });
  };

  const getConnectedPlatform = (platformId) => {
    return integrations.find(i => i.platform === platformId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      case "expired":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><AlertCircle className="w-3 h-3 mr-1" />Reconnect Required</Badge>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-[#27272A]">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            Accounting Integrations
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your bookkeeping platforms for seamless financial data sync
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(PLATFORMS).map((platform) => {
              const connected = getConnectedPlatform(platform.id);
              const isConnecting = connectingPlatform === platform.id;
              const isSyncing = syncingPlatform === connected?.id;
              
              return (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`border-[#27272A] bg-[#0A0A0F]/50 h-full transition-all ${
                    connected ? 'border-green-500/30' : 'hover:border-[#3F3F46]'
                  }`}>
                    <CardContent className="p-5 flex flex-col h-full">
                      {/* Platform Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl shrink-0`}>
                          {platform.iconFallback}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{platform.name}</h3>
                          <p className="text-gray-500 text-xs line-clamp-2">{platform.description}</p>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {platform.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="outline" className="border-[#27272A] text-gray-500 text-[10px] px-1.5 py-0.5">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Connection Status or Connect Button */}
                      <div className="mt-auto">
                        {connected ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              {getStatusBadge(connected.status)}
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(connected.lastSyncAt)}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => syncPlatform(connected.id)}
                                disabled={isSyncing}
                                className="flex-1 border-[#27272A] text-gray-300 hover:bg-[#1C1C22]"
                              >
                                {isSyncing ? (
                                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Syncing...</>
                                ) : (
                                  <><RefreshCw className="w-3 h-3 mr-1" />Sync</>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedIntegration(connected);
                                  setShowDetailsDialog(true);
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => connectPlatform(platform.id)}
                            disabled={isConnecting}
                            className={`w-full bg-gradient-to-r ${platform.color} hover:opacity-90`}
                          >
                            {isConnecting ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting...</>
                            ) : (
                              <><ExternalLink className="w-4 h-4 mr-2" />Connect</>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sync Overview */}
      {integrations.length > 0 && (
        <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-purple-400" />
              Sync Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                <div className="text-2xl font-bold text-white">
                  {integrations.reduce((sum, i) => sum + (i.syncedItems?.invoices || 0), 0)}
                </div>
                <div className="text-gray-500 text-sm">Invoices Synced</div>
              </div>
              <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                <div className="text-2xl font-bold text-white">
                  {integrations.reduce((sum, i) => sum + (i.syncedItems?.customers || 0), 0)}
                </div>
                <div className="text-gray-500 text-sm">Customers Synced</div>
              </div>
              <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                <div className="text-2xl font-bold text-white">
                  {integrations.reduce((sum, i) => sum + (i.syncedItems?.payments || 0), 0)}
                </div>
                <div className="text-gray-500 text-sm">Payments Synced</div>
              </div>
              <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                <div className="text-2xl font-bold text-green-400">
                  {integrations.filter(i => i.syncStatus === "success").length}/{integrations.length}
                </div>
                <div className="text-gray-500 text-sm">Healthy Connections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-[#1C1C22] border-[#27272A] max-w-md">
          {selectedIntegration && (() => {
            const platform = PLATFORMS[selectedIntegration.platform];
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-xl`}>
                      {platform.iconFallback}
                    </div>
                    {platform.name}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Manage your {platform.name} integration
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A] space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      {getStatusBadge(selectedIntegration.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connected</span>
                      <span className="text-white text-sm">
                        {new Date(selectedIntegration.connectedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Sync</span>
                      <span className="text-white text-sm">
                        {formatTimeAgo(selectedIntegration.lastSyncAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                    <h4 className="text-white font-medium mb-3">Synced Data</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xl font-bold text-white">{selectedIntegration.syncedItems?.invoices || 0}</div>
                        <div className="text-xs text-gray-500">Invoices</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{selectedIntegration.syncedItems?.customers || 0}</div>
                        <div className="text-xs text-gray-500">Customers</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{selectedIntegration.syncedItems?.payments || 0}</div>
                        <div className="text-xs text-gray-500">Payments</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => syncPlatform(selectedIntegration.id)}
                      disabled={syncingPlatform === selectedIntegration.id}
                      className="flex-1 border-[#27272A] text-gray-300"
                    >
                      {syncingPlatform === selectedIntegration.id ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Syncing...</>
                      ) : (
                        <><RefreshCw className="w-4 h-4 mr-2" />Sync Now</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => disconnectPlatform(selectedIntegration.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
