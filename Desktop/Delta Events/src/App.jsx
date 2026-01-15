import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Settings from './pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Routes>
        <Route path="/" element={<Navigate to="/settings" replace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </div>
  )
}

export default App
