import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { api } from '@/convex/_generated/api'; // Reserved for real integration

export default function AdminBanking() {
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    branchCode: '',
    accountType: 'Cheque/Current'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving banking details:", formData);
    // TODO: Call Convex mutation
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6 text-white flex justify-center items-start">
      <Card className="w-full max-w-2xl bg-[#13131A] border-[#1F1F27]">
        <CardHeader>
            <CardTitle>Banking Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input 
                    value={formData.bankName} 
                    onChange={e => handleChange('bankName', e.target.value)}
                    className="bg-[#0A0A0F] border-[#2D2D39]"
                    placeholder="e.g. FNB, Standard Bank"
                />
            </div>
            <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input 
                    value={formData.accountHolderName} 
                    onChange={e => handleChange('accountHolderName', e.target.value)}
                    className="bg-[#0A0A0F] border-[#2D2D39]"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input 
                        value={formData.accountNumber} 
                        onChange={e => handleChange('accountNumber', e.target.value)}
                        className="bg-[#0A0A0F] border-[#2D2D39]"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Branch Code</Label>
                    <Input 
                        value={formData.branchCode} 
                        onChange={e => handleChange('branchCode', e.target.value)}
                        className="bg-[#0A0A0F] border-[#2D2D39]"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={formData.accountType} onValueChange={v => handleChange('accountType', v)}>
                    <SelectTrigger className="bg-[#0A0A0F] border-[#2D2D39]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cheque/Current">Cheque/Current</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Transmission">Transmission</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSave} className="w-full">Save Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
