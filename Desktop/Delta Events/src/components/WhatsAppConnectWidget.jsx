import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import io from 'socket.io-client';

export default function WhatsAppConnectWidget() {
  const [status, setStatus] = useState('disconnected');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const serviceUrl = import.meta.env.VITE_WHATSAPP_SERVICE_URL || 'http://localhost:3000';
    const newSocket = io(serviceUrl);

    newSocket.on('connect', () => {
      console.log('Connected to WhatsApp Service');
      setLoading(false);
    });

    newSocket.on('status', (data) => {
      console.log('Status update:', data);
      setStatus(data.status);
      if (data.status === 'scan_qr') {
        setQrCode(data.qr);
      } else {
        setQrCode(null);
      }
      setLoading(false);
    });

    setSocket(newSocket);

    // Fetch initial status via HTTP as backup
    fetch(`${serviceUrl}/status`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
        if (data.qr) setQrCode(data.qr);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch status:', err);
        setLoading(false);
      });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const serviceUrl = import.meta.env.VITE_WHATSAPP_SERVICE_URL || 'http://localhost:3000';
      await fetch(`${serviceUrl}/disconnect`, { method: 'POST' });
    } catch (error) {
        console.error('Error disconnecting:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          WhatsApp Connection
          {status === 'connected' && <CheckCircle2 className="text-green-500 h-6 w-6" />}
          {status === 'disconnected' && <XCircle className="text-gray-400 h-6 w-6" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>}
        
        {!loading && status === 'connected' && (
            <div className="text-center space-y-4">
                <p className="text-green-600 font-medium">Device Connected Successfully</p>
                <Button variant="destructive" onClick={handleDisconnect}>Disconnect Device</Button>
            </div>
        )}

        {!loading && status === 'scan_qr' && qrCode && (
            <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <QRCodeSVG value={qrCode} size={256} />
                </div>
                <p className="text-sm text-gray-500 text-center">Open WhatsApp on your phone > Settings > Linked Devices > Link a Device</p>
            </div>
        )}

        {!loading && status === 'disconnected' && !qrCode && (
             <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Service is disconnected or initializing...</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
