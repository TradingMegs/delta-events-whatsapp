import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Users, UserPlus, Crown, Shield, Settings, MoreHorizontal,
  Mail, CheckCircle, Clock, XCircle, Trash2, Edit, Loader2
} from "lucide-react";
import { toast } from "sonner";

const ROLES = {
  owner: { label: "Owner", color: "from-yellow-500 to-orange-500", permissions: "Full access" },
  admin: { label: "Admin", color: "from-purple-500 to-blue-500", permissions: "All except billing" },
  manager: { label: "Manager", color: "from-blue-500 to-cyan-500", permissions: "Manage team & data" },
  member: { label: "Member", color: "from-gray-500 to-gray-600", permissions: "View & edit assigned" },
  viewer: { label: "Viewer", color: "from-gray-600 to-gray-700", permissions: "Read-only access" },
};

export default function TeamSettings() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" });
  
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "owner", status: "active", avatar: null, joinedAt: "2023-06-15" },
    { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "admin", status: "active", avatar: null, joinedAt: "2023-08-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "manager", status: "active", avatar: null, joinedAt: "2023-10-05" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "member", status: "active", avatar: null, joinedAt: "2023-11-12" },
  ]);

  const [pendingInvites, setPendingInvites] = useState([
    { id: 101, email: "alex@example.com", role: "member", invitedAt: "2024-01-10", expiresAt: "2024-01-17" },
  ]);

  const handleInvite = async () => {
    if (!inviteForm.email) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsInviting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newInvite = {
      id: Date.now(),
      email: inviteForm.email,
      role: inviteForm.role,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setPendingInvites(prev => [...prev, newInvite]);
    setIsInviting(false);
    setShowInviteDialog(false);
    setInviteForm({ email: "", role: "member" });
    toast.success("Invitation sent!", { description: `Invite sent to ${inviteForm.email}` });
  };

  const cancelInvite = (inviteId) => {
    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    toast.success("Invitation cancelled");
  };

  const removeMember = (memberId) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success("Team member removed");
  };

  const updateRole = (memberId, newRole) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast.success("Role updated");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case "invited":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl">
        <CardHeader className="border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Team Members
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your team and their permissions
              </CardDescription>
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1C1C22] border-[#27272A]">
                <DialogHeader>
                  <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Send an invitation to join your team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email Address</Label>
                    <Input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                      placeholder="colleague@company.com"
                      className="bg-[#0A0A0F] border-[#27272A] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Role</Label>
                    <Select 
                      value={inviteForm.role} 
                      onValueChange={(v) => setInviteForm({...inviteForm, role: v})}
                    >
                      <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                        {Object.entries(ROLES).filter(([k]) => k !== 'owner').map(([key, role]) => (
                          <SelectItem key={key} value={key} className="text-white">
                            <div className="flex items-center gap-2">
                              <span>{role.label}</span>
                              <span className="text-gray-500 text-xs">- {role.permissions}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleInvite}
                    disabled={isInviting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {isInviting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                    ) : (
                      <><Mail className="w-4 h-4 mr-2" />Send Invitation</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-3">
            {teamMembers.map((member) => {
              const role = ROLES[member.role];
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-[#27272A] bg-[#0A0A0F]/50 hover:border-[#3F3F46] transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-[#27272A]">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className={`bg-gradient-to-br ${role.color} text-white`}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium">{member.name}</h3>
                            {member.role === "owner" && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">{member.email}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Select 
                            value={member.role} 
                            onValueChange={(v) => updateRole(member.id, v)}
                            disabled={member.role === "owner"}
                          >
                            <SelectTrigger className="w-32 bg-[#0A0A0F] border-[#27272A] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                              {Object.entries(ROLES).map(([key, r]) => (
                                <SelectItem 
                                  key={key} 
                                  value={key} 
                                  className="text-white"
                                  disabled={key === "owner"}
                                >
                                  {r.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {getStatusBadge(member.status)}
                          
                          {member.role !== "owner" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMember(member.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-yellow-400" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div 
                  key={invite.id}
                  className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{invite.email}</div>
                      <div className="text-gray-500 text-sm">
                        Invited as {ROLES[invite.role]?.label} • Expires {new Date(invite.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-[#27272A] text-gray-300">
                      Resend
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => cancelInvite(invite.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Permissions */}
      <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ROLES).filter(([k]) => k !== 'owner').map(([key, role]) => (
              <Card key={key} className="border-[#27272A] bg-[#0A0A0F]/50">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-3`}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">{role.label}</h4>
                  <p className="text-gray-500 text-sm">{role.permissions}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
