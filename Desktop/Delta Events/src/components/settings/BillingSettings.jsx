import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Receipt, CreditCard, Download, Calendar, CheckCircle, 
  AlertTriangle, Sparkles, ArrowUpRight, FileText
} from "lucide-react";

export default function BillingSettings() {
  const [currentPlan] = useState({
    name: "Pro",
    price: 79,
    interval: "month",
    usedSeats: 4,
    totalSeats: 10,
    nextBillingDate: "2024-02-15",
    features: ["Unlimited contacts", "AI-powered insights", "Advanced analytics", "Priority support"]
  });

  const [invoices] = useState([
    { id: 1, date: "2024-01-15", amount: 79, status: "paid" },
    { id: 2, date: "2023-12-15", amount: 79, status: "paid" },
    { id: 3, date: "2023-11-15", amount: 79, status: "paid" },
    { id: 4, date: "2023-10-15", amount: 79, status: "paid" },
  ]);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl" />
        <CardHeader className="border-b border-[#27272A] relative z-10">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Current Plan
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg px-4 py-1">
                  {currentPlan.name}
                </Badge>
                <span className="text-gray-400">
                  <span className="text-3xl font-bold text-white">${currentPlan.price}</span>
                  /{currentPlan.interval}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button variant="outline" className="border-[#27272A] text-gray-300">
                  Compare Plans
                </Button>
              </div>
            </div>
            
            <div className="lg:w-72 space-y-4">
              <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Team Seats</span>
                  <span className="text-white font-medium">{currentPlan.usedSeats}/{currentPlan.totalSeats}</span>
                </div>
                <Progress value={(currentPlan.usedSeats / currentPlan.totalSeats) * 100} className="h-2" />
              </div>
              
              <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Next Billing Date
                </div>
                <div className="text-white font-medium">
                  {new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <div className="text-white font-medium">•••• •••• •••• 4242</div>
                <div className="text-gray-500 text-sm">Expires 12/26</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Default</Badge>
              <Button variant="outline" size="sm" className="border-[#27272A] text-gray-300">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-400" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A] hover:border-[#3F3F46] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Invoice #{invoice.id.toString().padStart(4, '0')}</div>
                    <div className="text-gray-500 text-sm">
                      {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">${invoice.amount}.00</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />Paid
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
