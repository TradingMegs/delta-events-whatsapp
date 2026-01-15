import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Same mapping (crucial to match)
const mapping = [
    { path: '/dashboard', component: 'Dashboard' },
    { path: '/events', component: 'Events' },
    { path: '/calendar', component: 'Calendar' },
    { path: '/courses', component: 'Courses' },
    { path: '/courses/:courseId', component: 'CourseDetails' },
    { path: '/events/:eventId', component: 'EventDetails' },
    { path: '/videos/:videoId', component: 'VideoDetails' },
    { path: '/assessments/:assessmentId/take', component: 'AssessmentTake' },
    { path: '/assessments/:assessmentId/results', component: 'AssessmentResults' },
    { path: '/notifications', component: 'Notifications' },
    { path: '/videos', component: 'Videos' },
    { path: '/assessments', component: 'Assessments' },
    { path: '/attendees', component: 'Attendees' },
    { path: '/groups', component: 'Groups' },
    { path: '/payments', component: 'Payments' },
    { path: '/my-payments', component: 'MyPayments' },
    { path: '/profile', component: 'Profile' },
    { path: '/check-in', component: 'CheckIn' },
    { path: '/resources', component: 'Resources' },
    { path: '/sponsorships', component: 'Sponsorships' },
    { path: '/shared/:token', component: 'SharedView' },
    { path: '/admin/dashboard', component: 'AdminDashboard' },
    { path: '/admin/calendar', component: 'AdminCalendar' },
    { path: '/admin/events', component: 'AdminEvents' },
    { path: '/admin/events/:id/edit', component: 'AdminEventEdit' },
    { path: '/admin/events/:eventId/attendees', component: 'AdminEventAttendees' },
    { path: '/admin/events/:eventId/checkin', component: 'AdminEventCheckin' },
    { path: '/admin/banking', component: 'AdminBanking' },
    { path: '/admin/notifications', component: 'AdminNotifications' },
    { path: '/admin/users', component: 'AdminUsers' },
    { path: '/admin/groups', component: 'AdminGroups' },
    { path: '/admin/organization', component: 'AdminOrganization' },
    { path: '/admin/system', component: 'AdminSystem' },
    { path: '/admin/system/email-templates', component: 'AdminEmailTemplates' },
    { path: '/admin/system/roles', component: 'AdminRoles' },
    { path: '/admin/whatsapp', component: 'AdminWhatsApp' },
    { path: '/admin/payments', component: 'AdminPayments' },
    { path: '/admin/payments/history', component: 'AdminPaymentHistory' },
    { path: '/admin/sponsorships', component: 'AdminSponsorships' },
    { path: '/eventmanager/dashboard', component: 'ManagerDashboard' },
    { path: '/eventmanager/messages', component: 'ManagerMessages' },
    { path: '/eventmanager/hub', component: 'ManagerHub' }
];

const imports = mapping.map(m => `import ${m.component} from './pages/${m.component}'`).join('\n');
const routes = mapping.map(m => `<Route path="${m.path}" element={<${m.component} />} />`).join('\n        ');

const appContent = `import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
${imports}
import WhatsAppConnection from './pages/WhatsAppConnection' // Keep my manual restore for now just in case

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Recovered Routes */}
        ${routes}
        
        {/* Manual Overrides/Restores */}
        <Route path="/admin/whatsapp" element={<WhatsAppConnection />} /> 
        
        <Route path="*" element={<div className="p-8">404 - Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App
`;

fs.writeFileSync(path.join(__dirname, 'src', 'App.jsx'), appContent);
console.log('Regenerated src/App.jsx');
