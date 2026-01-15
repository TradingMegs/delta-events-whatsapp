import React, { useState } from 'react';
import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Commented out until api is generated
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Download, Search } from 'lucide-react';

// Mock API for now since we don't have the generated file
const api = { payments: { getAllPayments: "payments:getAllPayments" } };

export default function AdminPaymentHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // const payments = useQuery(api.payments.getAllPayments);
  const payments = []; // Placeholder until Convex is connected

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = 
      payment.payerName?.toLowerCase().includes(search.toLowerCase()) ||
      payment.payerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      payment.eventName?.toLowerCase().includes(search.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleExport = () => {
    if (filteredPayments.length === 0) return;
    
    const headers = ['Date', 'Payer Name', 'Payer Email', 'Event', 'Reference', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => [
        new Date(p._creationTime).toLocaleDateString(),
        p.payerName,
        p.payerEmail,
        p.eventName,
        p.reference,
        p.amount,
        p.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6 text-white">
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold mb-1">Payment History</h1>
            <p className="text-gray-400 text-sm">View and manage all payment transactions</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="bg-[#13131A] border-[#1F1F27]">
        <CardHeader>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                        placeholder="Search payments..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 bg-[#0A0A0F] border-[#2D2D39]"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-[#0A0A0F] border-[#2D2D39]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Payer</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPayments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No payments found
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredPayments.map((payment) => (
                            <TableRow key={payment._id}>
                                <TableCell>{new Date(payment._creationTime).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{payment.payerName}</div>
                                    <div className="text-xs text-gray-500">{payment.payerEmail}</div>
                                </TableCell>
                                <TableCell>{payment.eventName}</TableCell>
                                <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                                <TableCell>R {payment.amount}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        payment.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                        payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                        {payment.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
