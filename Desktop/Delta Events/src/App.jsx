import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Calendar from './pages/Calendar'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import EventDetails from './pages/EventDetails'
import VideoDetails from './pages/VideoDetails'
import AssessmentTake from './pages/AssessmentTake'
import AssessmentResults from './pages/AssessmentResults'
import Notifications from './pages/Notifications'
import Videos from './pages/Videos'
import Assessments from './pages/Assessments'
import Attendees from './pages/Attendees'
import Groups from './pages/Groups'
import Payments from './pages/Payments'
import MyPayments from './pages/MyPayments'
import Profile from './pages/Profile'
import CheckIn from './pages/CheckIn'
import Resources from './pages/Resources'
import Sponsorships from './pages/Sponsorships'
import SharedView from './pages/SharedView'
import AdminDashboard from './pages/AdminDashboard'
import AdminCalendar from './pages/AdminCalendar'
import AdminEvents from './pages/AdminEvents'
import AdminEventEdit from './pages/AdminEventEdit'
import AdminEventAttendees from './pages/AdminEventAttendees'
import AdminEventCheckin from './pages/AdminEventCheckin'
import AdminBanking from './pages/AdminBanking'
import AdminNotifications from './pages/AdminNotifications'
import AdminUsers from './pages/AdminUsers'
import AdminGroups from './pages/AdminGroups'
import AdminOrganization from './pages/AdminOrganization'
import AdminSystem from './pages/AdminSystem'
import AdminEmailTemplates from './pages/AdminEmailTemplates'
import AdminRoles from './pages/AdminRoles'
import AdminWhatsApp from './pages/AdminWhatsApp'
import AdminPayments from './pages/AdminPayments'
import AdminPaymentHistory from './pages/AdminPaymentHistory'
import AdminSponsorships from './pages/AdminSponsorships'
import ManagerDashboard from './pages/ManagerDashboard'
import ManagerMessages from './pages/ManagerMessages'
import ManagerHub from './pages/ManagerHub'
import WhatsAppConnection from './pages/WhatsAppConnection' // Keep my manual restore for now just in case

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Recovered Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/videos/:videoId" element={<VideoDetails />} />
        <Route path="/assessments/:assessmentId/take" element={<AssessmentTake />} />
        <Route path="/assessments/:assessmentId/results" element={<AssessmentResults />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/attendees" element={<Attendees />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/my-payments" element={<MyPayments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/sponsorships" element={<Sponsorships />} />
        <Route path="/shared/:token" element={<SharedView />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/events/:id/edit" element={<AdminEventEdit />} />
        <Route path="/admin/events/:eventId/attendees" element={<AdminEventAttendees />} />
        <Route path="/admin/events/:eventId/checkin" element={<AdminEventCheckin />} />
        <Route path="/admin/banking" element={<AdminBanking />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/groups" element={<AdminGroups />} />
        <Route path="/admin/organization" element={<AdminOrganization />} />
        <Route path="/admin/system" element={<AdminSystem />} />
        <Route path="/admin/system/email-templates" element={<AdminEmailTemplates />} />
        <Route path="/admin/system/roles" element={<AdminRoles />} />
        <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/payments/history" element={<AdminPaymentHistory />} />
        <Route path="/admin/sponsorships" element={<AdminSponsorships />} />
        <Route path="/eventmanager/dashboard" element={<ManagerDashboard />} />
        <Route path="/eventmanager/messages" element={<ManagerMessages />} />
        <Route path="/eventmanager/hub" element={<ManagerHub />} />
        
        {/* Manual Overrides/Restores */}
        <Route path="/admin/whatsapp" element={<WhatsAppConnection />} /> 
        
        <Route path="*" element={<div className="p-8">404 - Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App
