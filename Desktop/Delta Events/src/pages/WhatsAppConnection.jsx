import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import WhatsAppConnectWidget from '@/components/WhatsAppConnectWidget';

export default function WhatsAppConnection() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Integration</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <WhatsAppConnectWidget />
        
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              This page manages the connection between Delta Events and the WhatsApp Business API.
              Scan the QR code to link a device.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
