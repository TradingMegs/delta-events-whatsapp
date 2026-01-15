import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component Mapping
const mapping = [
    { path: '/dashboard', component: 'Dashboard' },
    { path: '/events', component: 'Events' },
    { path: '/calendar', component: 'Calendar' },
    // ... [Same list as above, abbreviated for brevity in prompt but I will include ALL in execution]
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

const baseDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
}

mapping.forEach(m => {
    let compName = m.component;
    let filePath = path.join(baseDir, compName + '.jsx');
    
    // Check if file exists. If so, DO NOT overwrite (User might have content in backup).
    // EXCEPTION: My backup was old. 
    // I will overwrite ONLY if it doesn't exist.
    
    const content = `import React from 'react';

export default function ${compName}() {
    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">${compName}</h1>
            <p className="text-gray-400">
                Route: ${m.path} <br/>
                Status: Recovered Placeholder
            </p>
        </div>
    );
};
`;

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`Created ${filePath}`);
    } else {
        console.log(`Skipped ${filePath} (already exists)`);
    }
});
