import React, { useMemo } from 'react';
// import { useQuery } from 'convex/react'; // Reserved
// import { api } from '@/convex/_generated/api'; // Reserved
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, PlayCircle, Calendar } from 'lucide-react';

// Mock Hooks to simulate the missing data hooks found in decompilation
const useUserData = () => ({ fullName: 'Attendee' }); // Replacement for ha()
const useUpcomingEvents = () => ({ upcomingEvents: [] }); // Replacement for wv()
const useMyRSVPs = () => ({ myRSVPs: [] }); // Replacement for b4()
const useVideoStats = () => ({ completed: 0, total: 0, percent: 0 }); // Replacement for $.videos.getUserStats

export default function Dashboard() {
  const { fullName } = useUserData();
  const { upcomingEvents } = useUpcomingEvents();
  const { myRSVPs } = useMyRSVPs();
  const videoStats = useVideoStats();

  // Logic restored from C4 component
  const getGreeting = () => {
    const hours = new Date().getHours();
    return hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  };

  const stats = useMemo(() => {
    const eventsAttended = myRSVPs?.filter(r => r.attended).length || 0;
    const upcoming = myRSVPs?.filter(r => r.status === 'yes' && new Date(r.event?.date) >= new Date()).length || 0;
    
    return {
      eventsAttended,
      upcoming,
      videoProgress: videoStats.percent || 0,
      videoRatio: `${videoStats.completed || 0}/${videoStats.total || 0}`
    };
  }, [myRSVPs, videoStats]);

  const pendingInvites = myRSVPs?.filter(r => r.status === 'pending').length || 0;

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6 text-white text-left">
      {/* Header Section */}
      <div className="mb-8">
        <p className="text-blue-400 text-sm font-medium mb-1">{getGreeting()}</p>
        <h1 className="text-3xl font-bold mb-1">{fullName}</h1>
        <p className="text-gray-400 text-sm">Here's what's happening with your events</p>
      </div>

      {/* Stats Grid (w4 component logic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#13131A] border-[#1F1F27] p-4 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.eventsAttended}</p>
              <p className="text-slate-400 text-sm">Events Attended</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#13131A] border-[#1F1F27] p-4 text-left">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.upcoming}</p>
              <p className="text-slate-400 text-sm">Upcoming Events</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#13131A] border-[#1F1F27] p-4 text-left">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.videoRatio}</p>
              <p className="text-slate-400 text-sm">Training Progress ({stats.videoProgress}%)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Required Section */}
      <Card className="bg-[#13131A] border-[#1F1F27] mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex justify-between items-center text-left">
            <span>Action Required</span>
            {pendingInvites > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                    {pendingInvites} Pending
                </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvites === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-white font-medium">All caught up!</p>
              <p className="text-slate-500 text-sm">You have no pending actions</p>
            </div>
          ) : (
            <div className="space-y-4">
                <p className="text-slate-400 text-sm">You have pending event invitations.</p>
                {/* List pending items here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
