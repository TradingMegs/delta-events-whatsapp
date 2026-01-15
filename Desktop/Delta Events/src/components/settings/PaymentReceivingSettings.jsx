import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard, Building2, Wallet, CheckCircle, XCircle, AlertCircle,
  Plus, Settings, ExternalLink, Loader2, Shield, DollarSign,
  Banknote, ArrowRight, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// Storage key for payment receiving methods
const STORAGE_KEY = 'apex_payment_receiving_methods';

// Get saved payment receiving methods
const getPaymentMethods = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save payment receiving methods
const savePaymentMethods = (methods) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
};

// Payment platform configurations
const PLATFORMS = {
  stripe: {
    id: "stripe",
    name: "Stripe Connect",
    description: "Accept credit cards, Apple Pay, Google Pay",
    icon: "💳",
    color: "from-purple-500 to-indigo-600",
    features: ["Card payments", "Recurring billing", "Instant payouts"],
    setupUrl: "https://connect.stripe.com/setup"
  },
  paypal: {
    id: "paypal",
    name: "PayPal Business",
    description: "Accept PayPal and Venmo payments",
    icon: "🅿️",
    color: "from-blue-500 to-blue-600",
    features: ["PayPal balance", "Venmo", "Pay Later"],
    setupUrl: "https://www.paypal.com/business"
  },
  bank: {
    id: "bank",
    name: "Bank Account (ACH)",
    description: "Direct deposits to your bank account",
    icon: "🏦",
    color: "from-green-500 to-emerald-600",
    features: ["ACH transfers", "Wire transfers", "Lower fees"],
    setupUrl: null
  }
};

export default function PaymentReceivingSettings() {
  const [methods, setMethods] = useState(getPaymentMethods);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking"
  });

  // Connect to Stripe
  const connectStripe = async () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMethod = {
      id: `stripe_${Date.now()}`,
      platform: "stripe",
      status: "active",
      accountId: "acct_" + Math.random().toString(36).substring(7),
      email: "business@example.com",
      connectedAt: new Date().toISOString(),
      isDefault: methods.length === 0
    };
    
    const updatedMethods = [...methods, newMethod];
    setMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setIsConnecting(false);
    setShowAddDialog(false);
    toast.success("Stripe Connected!", { description: "You can now accept card payments." });
  };

  // Connect to PayPal
  const connectPayPal = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMethod = {
      id: `paypal_${Date.now()}`,
      platform: "paypal",
      status: "active",
      email: "business@example.com",
      connectedAt: new Date().toISOString(),
      isDefault: methods.length === 0
    };
    
    const updatedMethods = [...methods, newMethod];
    setMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setIsConnecting(false);
    setShowAddDialog(false);
    toast.success("PayPal Connected!", { description: "You can now accept PayPal payments." });
  };

  // Add bank account
  const addBankAccount = async () => {
    if (!bankForm.accountName || !bankForm.routingNumber || !bankForm.accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newMethod = {
      id: `bank_${Date.now()}`,
      platform: "bank",
      status: "pending_verification",
      accountName: bankForm.accountName,
      routingNumber: bankForm.routingNumber.slice(-4),
      accountNumber: bankForm.accountNumber.slice(-4),
      accountType: bankForm.accountType,
      connectedAt: new Date().toISOString(),
      isDefault: methods.length === 0
    };
    
    const updatedMethods = [...methods, newMethod];
    setMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setIsConnecting(false);
    setShowAddDialog(false);
    setBankForm({ accountName: "", routingNumber: "", accountNumber: "", accountType: "checking" });
    toast.success("Bank Account Added!", { description: "Micro-deposits will be sent for verification." });
  };

  // Disconnect a payment method
  const disconnectMethod = (methodId) => {
    const updatedMethods = methods.filter(m => m.id !== methodId);
    // Set new default if needed
    if (updatedMethods.length > 0 && !updatedMethods.some(m => m.isDefault)) {
      updatedMethods[0].isDefault = true;
    }
    setMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    toast.success("Payment method disconnected");
  };

  // Set as default
  const setAsDefault = (methodId) => {
    const updatedMethods = methods.map(m => ({
      ...m,
      isDefault: m.id === methodId
    }));
    setMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    toast.success("Default payment method updated");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case "pending_verification":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><AlertCircle className="w-3 h-3 mr-1" />Pending Verification</Badge>;
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Payment Receiving Methods
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                Configure how you receive payments from customers
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1C1C22] border-[#27272A] max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">Connect Payment Platform</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Choose a platform to start receiving payments
                  </DialogDescription>
                </DialogHeader>
                
                {!selectedPlatform ? (
                  <div className="grid gap-4 py-4">
                    {Object.values(PLATFORMS).map((platform) => (
                      <motion.div
                        key={platform.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className="border-[#27272A] bg-[#0A0A0F]/50 hover:border-purple-500/30 cursor-pointer transition-all"
                          onClick={() => setSelectedPlatform(platform.id)}
                        >
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl`}>
                              {platform.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-semibold">{platform.name}</h3>
                              <p className="text-gray-400 text-sm">{platform.description}</p>
                              <div className="flex gap-2 mt-2">
                                {platform.features.map((f, i) => (
                                  <Badge key={i} variant="outline" className="border-[#27272A] text-gray-500 text-xs">
                                    {f}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : selectedPlatform === "bank" ? (
                  <div className="space-y-4 py-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedPlatform(null)}
                      className="text-gray-400 -ml-2"
                    >
                      ← Back to platforms
                    </Button>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Account Holder Name</Label>
                        <Input
                          value={bankForm.accountName}
                          onChange={(e) => setBankForm({...bankForm, accountName: e.target.value})}
                          placeholder="Business Name or Your Name"
                          className="bg-[#0A0A0F] border-[#27272A] text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Routing Number</Label>
                          <Input
                            value={bankForm.routingNumber}
                            onChange={(e) => setBankForm({...bankForm, routingNumber: e.target.value})}
                            placeholder="9 digits"
                            maxLength={9}
                            className="bg-[#0A0A0F] border-[#27272A] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Account Number</Label>
                          <Input
                            value={bankForm.accountNumber}
                            onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                            placeholder="Account number"
                            className="bg-[#0A0A0F] border-[#27272A] text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300">Account Type</Label>
                        <Select 
                          value={bankForm.accountType} 
                          onValueChange={(v) => setBankForm({...bankForm, accountType: v})}
                        >
                          <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                            <SelectItem value="checking" className="text-white">Checking</SelectItem>
                            <SelectItem value="savings" className="text-white">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
                          <p className="text-xs text-blue-300">
                            Your bank details are encrypted and securely stored. We'll send two micro-deposits to verify your account.
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={addBankAccount}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                      >
                        {isConnecting ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting...</>
                        ) : (
                          <><Building2 className="w-4 h-4 mr-2" />Add Bank Account</>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedPlatform(null)}
                      className="text-gray-400 -ml-2"
                    >
                      ← Back to platforms
                    </Button>
                    
                    <Card className="border-[#27272A] bg-[#0A0A0F]/50">
                      <CardContent className="p-6 text-center">
                        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${PLATFORMS[selectedPlatform].color} flex items-center justify-center text-4xl mb-4`}>
                          {PLATFORMS[selectedPlatform].icon}
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">
                          Connect {PLATFORMS[selectedPlatform].name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                          You'll be redirected to {PLATFORMS[selectedPlatform].name} to authorize the connection.
                        </p>
                        <Button 
                          onClick={selectedPlatform === "stripe" ? connectStripe : connectPayPal}
                          disabled={isConnecting}
                          className={`w-full bg-gradient-to-r ${PLATFORMS[selectedPlatform].color}`}
                        >
                          {isConnecting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting...</>
                          ) : (
                            <><ExternalLink className="w-4 h-4 mr-2" />Connect {PLATFORMS[selectedPlatform].name}</>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {methods.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Wallet className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No payment methods configured</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Connect a payment platform to start receiving funds from your customers.
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {methods.map((method) => {
                const platform = PLATFORMS[method.platform];
                return (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="border-[#27272A] bg-[#0A0A0F]/50 hover:border-[#3F3F46] transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-xl`}>
                            {platform.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-medium">{platform.name}</h3>
                              {method.isDefault && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-gray-500 text-sm">
                              {method.platform === "bank" 
                                ? `****${method.accountNumber} (${method.accountType})`
                                : method.email
                              }
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {getStatusBadge(method.status)}
                            
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAsDefault(method.id)}
                                className="border-[#27272A] text-gray-400 hover:text-white"
                              >
                                Set Default
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => disconnectMethod(method.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div>
              <h4 className="text-white font-medium">Automatic Payouts</h4>
              <p className="text-gray-500 text-sm">Automatically transfer funds to your default payment method</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div>
              <h4 className="text-white font-medium">Payout Schedule</h4>
              <p className="text-gray-500 text-sm">How often you receive payouts</p>
            </div>
            <Select defaultValue="daily">
              <SelectTrigger className="w-32 bg-[#0A0A0F] border-[#27272A] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                <SelectItem value="daily" className="text-white">Daily</SelectItem>
                <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div>
              <h4 className="text-white font-medium">Minimum Payout Amount</h4>
              <p className="text-gray-500 text-sm">Only payout when balance exceeds this amount</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <Input 
                type="number" 
                defaultValue="100" 
                className="w-24 bg-[#0A0A0F] border-[#27272A] text-white text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
