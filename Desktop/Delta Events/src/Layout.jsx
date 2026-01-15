import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, CalendarDays, Calendar, Video, Bell, Users, 
  Award, CreditCard, FileText, Menu, X, ShieldAlert 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock hooks
const useUser = () => ({ fullName: 'Megan', role: 'attendee' });
const useSystemSettings = () => ({ logoUrl: '/assets/logo.png' });

export default function Layout() {
  const navigate = useNavigate();
  const { fullName } = useUser();
  const { logoUrl } = useSystemSettings();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { icon: LayoutGrid, label: 'Dashboard', to: '/dashboard' },
    { icon: CalendarDays, label: 'Events', to: '/events' },
    { icon: Calendar, label: 'Calendar', to: '/calendar' },
    { icon: Video, label: 'Check In', to: '/check-in' },
    { icon: Bell, label: 'Notifications', to: '/notifications' },
    { icon: Users, label: 'Groups', to: '/groups' },
    { icon: Award, label: 'Sponsorships', to: '/sponsorships' },
    { icon: CreditCard, label: 'Payments', to: '/payments' },
    { icon: FileText, label: 'Resources', to: '/resources' },
  ];

  // Logic for Admin/Manager view would go here (conditional link)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0A0A0F] border-r border-[#1F1F27]">
      <div className="p-4 flex items-center gap-3">
        <img src={logoUrl} alt="Delta Events" className="w-8 h-8 object-contain" />
        <span className="text-white font-bold text-sm tracking-wide">Delta Events</span>
        <span className="text-xs text-gray-500 block uppercase mt-0.5" style={{marginLeft: '-3px'}}>ATTENDEE</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#1F1F27] text-white border border-[#2D2D39]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1F1F27]/50'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1F1F27] mt-auto">
        <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#1F1F27] transition-colors text-left"
        >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                {fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{fullName}</p>
                <p className="text-xs text-gray-500 truncate">Your profile →</p>
            </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0A0A0F]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A0F] border-b border-[#1F1F27] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-sm">Delta Events</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-400">
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm pt-16">
            <div className="bg-[#0A0A0F] h-full w-64 border-r border-[#1F1F27]">
                <SidebarContent />
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <Outlet />
      </main>

       {/* Floating Admin Button (Restored from Screenshot) */}
       <div className="fixed bottom-6 right-6 z-50">
            <Button 
                variant="default" 
                className="rounded-full w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                onClick={() => navigate('/admin/dashboard')} // Mock action
            >
                <ShieldAlert className="w-6 h-6 text-white" />
            </Button>
       </div>
    </div>
  );
}
