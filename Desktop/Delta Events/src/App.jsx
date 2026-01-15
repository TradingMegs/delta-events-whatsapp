import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Settings from './pages/Settings'
import WhatsAppConnection from './pages/WhatsAppConnection'
// Placeholder imports for missing pages
const Placeholder = ({ title }) => <div className="p-8"><h1 className="text-2xl text-white">{title}</h1><p className="text-gray-400">Page content recovered from routing table.</p></div>

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/system" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/system" replace />} />
        
        <Route path="/admin/whatsapp" element={<WhatsAppConnection />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        {/* Recovered Routes */}
        <Route path="/admin/payments" element={<Placeholder title="Payments" />} />
        <Route path="/admin/payments/history" element={<Placeholder title="Payment History" />} />
        <Route path="/admin/sponsorships" element={<Placeholder title="Sponsorships" />} />
        <Route path="/admin/notifications" element={<Placeholder title="Notifications" />} />
        <Route path="/admin/system" element={<Placeholder title="System Status" />} />
        
        <Route path="*" element={<Navigate to="/admin/system" replace />} />
      </Routes>
    </div>
  )
}

export default App
