import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, Mail, Phone, MapPin, Building2, Globe, Camera,
  Shield, Key, Smartphone, CheckCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Apex Industries",
    role: "Sales Manager",
    timezone: "America/New_York",
    language: "en",
    avatar: null
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Profile updated successfully");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl">
        <CardHeader className="border-b border-[#27272A]">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your personal details and preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-[#27272A]">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-3xl">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <Button variant="outline" size="sm" className="border-[#27272A] text-gray-400">
                Change Photo
              </Button>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">First Name</Label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="bg-[#0A0A0F] border-[#27272A] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Last Name</Label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="bg-[#0A0A0F] border-[#27272A] text-white"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="bg-[#0A0A0F] border-[#27272A] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="bg-[#0A0A0F] border-[#27272A] text-white"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Company
                  </Label>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="bg-[#0A0A0F] border-[#27272A] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Role</Label>
                  <Input
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="bg-[#0A0A0F] border-[#27272A] text-white"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Timezone
                  </Label>
                  <Select value={profile.timezone} onValueChange={(v) => setProfile({...profile, timezone: v})}>
                    <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                      <SelectItem value="America/New_York" className="text-white">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago" className="text-white">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver" className="text-white">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles" className="text-white">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London" className="text-white">GMT (London)</SelectItem>
                      <SelectItem value="Europe/Paris" className="text-white">CET (Paris)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Language</Label>
                  <Select value={profile.language} onValueChange={(v) => setProfile({...profile, language: v})}>
                    <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                      <SelectItem value="en" className="text-white">English</SelectItem>
                      <SelectItem value="es" className="text-white">Español</SelectItem>
                      <SelectItem value="fr" className="text-white">Français</SelectItem>
                      <SelectItem value="de" className="text-white">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 pt-6 border-t border-[#27272A]">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 min-w-32"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Password</h4>
                <p className="text-gray-500 text-sm">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" className="border-[#27272A] text-gray-300">
              Change Password
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-gray-500 text-sm">Add an extra layer of security</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />Enabled
              </Badge>
              <Button variant="outline" size="sm" className="border-[#27272A] text-gray-300">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
