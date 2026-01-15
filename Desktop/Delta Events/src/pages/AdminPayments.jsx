import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { History, CreditCard, ChevronRight } from 'lucide-react';

export default function AdminPayments() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6 text-white space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Payments</h1>
        <p className="text-gray-400 text-sm">Manage payment records and banking settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
            className="bg-[#13131A] border-[#1F1F27] hover:bg-[#1A1A24] transition-colors cursor-pointer group"
            onClick={() => navigate('/admin/payments/history')}
        >
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                        <History className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-400" />
                </div>
                <CardTitle className="mt-4">Payment History</CardTitle>
                <CardDescription>View all transactions, verify payments, and export records.</CardDescription>
            </CardHeader>
        </Card>

        <Card 
            className="bg-[#13131A] border-[#1F1F27] hover:bg-[#1A1A24] transition-colors cursor-pointer group"
            onClick={() => navigate('/admin/banking')}
        >
             <CardHeader>
                <div className="flex justify-between items-start">
                     <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500/20 transition-colors">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-400" />
                </div>
                <CardTitle className="mt-4">Banking Settings</CardTitle>
                <CardDescription>Update bank account details for receiving payments.</CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}
