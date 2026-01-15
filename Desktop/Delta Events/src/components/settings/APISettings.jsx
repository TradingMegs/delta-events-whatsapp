import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Code, Plus, Star, CheckCircle, XCircle, Settings, Trash2,
  Eye, EyeOff, Sparkles, Zap, Brain, MessageSquare, Loader2
} from "lucide-react";
import { toast } from "sonner";

// Storage key for API configs
const STORAGE_KEY = 'apex_api_configs';

// Get saved configs
const getConfigs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save configs
const saveConfigs = (configs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
};

// Provider configurations
const PROVIDERS = {
  openai: {
    id: "openai",
    name: "OpenAI",
    icon: "🤖",
    color: "from-green-500 to-emerald-600",
    models: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
    description: "GPT-4 and GPT-3.5 models"
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    icon: "🧠",
    color: "from-orange-500 to-red-500",
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
    description: "Claude 3 models"
  },
  google: {
    id: "google",
    name: "Google AI",
    icon: "🔷",
    color: "from-blue-500 to-indigo-500",
    models: ["gemini-pro", "gemini-pro-vision"],
    description: "Gemini models"
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    icon: "🌀",
    color: "from-purple-500 to-pink-500",
    models: ["mistral-large", "mistral-medium", "mistral-small"],
    description: "Mistral models"
  },
  groq: {
    id: "groq",
    name: "Groq",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500",
    models: ["llama-3-70b", "mixtral-8x7b"],
    description: "Ultra-fast inference"
  }
};

const USE_CASES = [
  { id: "general", label: "General", description: "Default AI assistant" },
  { id: "email", label: "Email AI", description: "Email drafting and replies" },
  { id: "voice", label: "Voice", description: "Voice agents and calls" },
  { id: "chat", label: "Chat/Chatbot", description: "Customer chat support" },
  { id: "analytics", label: "Analytics", description: "Data analysis and insights" },
];

export default function APISettings() {
  const [configs, setConfigs] = useState(getConfigs);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showApiKey, setShowApiKey] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    provider: "openai",
    model: "",
    api_key: "",
    use_case: "general",
    settings: {
      temperature: 0.7,
      max_tokens: 2000
    },
    is_default: false
  });

  const handleAddProvider = async () => {
    if (!formData.api_key || !formData.model) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newConfig = {
      id: `config_${Date.now()}`,
      ...formData,
      is_active: true,
      createdAt: new Date().toISOString()
    };
    
    // If setting as default, unset other defaults for same use case
    let updatedConfigs = configs;
    if (formData.is_default) {
      updatedConfigs = configs.map(c => ({
        ...c,
        is_default: c.use_case === formData.use_case ? false : c.is_default
      }));
    }
    
    updatedConfigs = [...updatedConfigs, newConfig];
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
    
    setIsAdding(false);
    setShowAddDialog(false);
    setFormData({
      provider: "openai",
      model: "",
      api_key: "",
      use_case: "general",
      settings: { temperature: 0.7, max_tokens: 2000 },
      is_default: false
    });
    
    toast.success("AI Provider Added!", {
      description: `${PROVIDERS[formData.provider].name} is now configured.`
    });
  };

  const toggleDefault = (configId) => {
    const config = configs.find(c => c.id === configId);
    const updatedConfigs = configs.map(c => ({
      ...c,
      is_default: c.id === configId ? !c.is_default : (c.use_case === config.use_case ? false : c.is_default)
    }));
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
    toast.success("Default provider updated");
  };

  const toggleActive = (configId) => {
    const updatedConfigs = configs.map(c => 
      c.id === configId ? { ...c, is_active: !c.is_active } : c
    );
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
  };

  const deleteConfig = (configId) => {
    const updatedConfigs = configs.filter(c => c.id !== configId);
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
    toast.success("Provider removed");
  };

  const selectedProvider = PROVIDERS[formData.provider];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-[#27272A] bg-gradient-to-br from-[#1C1C22]/90 to-[#0A0A0F]/90 backdrop-blur-xl">
        <CardHeader className="border-b border-[#27272A]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                AI Provider Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Connect AI models to power your CRM features
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1C1C22] border-[#27272A] max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-white">Add AI Provider</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Configure a new AI model for your CRM
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Provider</Label>
                    <Select 
                      value={formData.provider} 
                      onValueChange={(v) => setFormData({...formData, provider: v, model: ""})}
                    >
                      <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                        {Object.values(PROVIDERS).map((p) => (
                          <SelectItem key={p.id} value={p.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <span>{p.icon}</span>
                              <span>{p.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Model</Label>
                    <Select 
                      value={formData.model} 
                      onValueChange={(v) => setFormData({...formData, model: v})}
                    >
                      <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                        {selectedProvider?.models.map((model) => (
                          <SelectItem key={model} value={model} className="text-white">
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">API Key</Label>
                    <Input
                      type="password"
                      value={formData.api_key}
                      onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                      placeholder="sk-..."
                      className="bg-[#0A0A0F] border-[#27272A] text-white font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Use Case</Label>
                    <Select 
                      value={formData.use_case} 
                      onValueChange={(v) => setFormData({...formData, use_case: v})}
                    >
                      <SelectTrigger className="bg-[#0A0A0F] border-[#27272A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C22] border-[#27272A]">
                        {USE_CASES.map((uc) => (
                          <SelectItem key={uc.id} value={uc.id} className="text-white">
                            {uc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Temperature</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={formData.settings.temperature}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, temperature: parseFloat(e.target.value)}
                        })}
                        className="bg-[#0A0A0F] border-[#27272A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Max Tokens</Label>
                      <Input
                        type="number"
                        value={formData.settings.max_tokens}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, max_tokens: parseInt(e.target.value)}
                        })}
                        className="bg-[#0A0A0F] border-[#27272A] text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#0A0A0F]/50 rounded-lg border border-[#27272A]">
                    <Label className="text-gray-300">Set as default for this use case</Label>
                    <Switch 
                      checked={formData.is_default}
                      onCheckedChange={(v) => setFormData({...formData, is_default: v})}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddProvider}
                    disabled={isAdding}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {isAdding ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" />Add Provider</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {configs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Brain className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No AI providers configured</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Connect AI models to enable smart features across your CRM.
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Provider
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configs.map((config) => {
                const provider = PROVIDERS[config.provider];
                return (
                  <motion.div
                    key={config.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className={`border-[#27272A] bg-[#0A0A0F]/50 h-full transition-all ${
                      !config.is_active ? 'opacity-60' : ''
                    }`}>
                      <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-2xl`}>
                              {provider.icon}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{provider.name}</h3>
                              <p className="text-gray-500 text-sm">{config.model}</p>
                            </div>
                          </div>
                          {config.is_default && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Star className="w-3 h-3 mr-1 fill-current" />Default
                            </Badge>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Use Case</span>
                            <Badge variant="outline" className="border-[#27272A] text-gray-400 capitalize">
                              {config.use_case.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            {config.is_active ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />Active
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                <XCircle className="w-3 h-3 mr-1" />Inactive
                              </Badge>
                            )}
                          </div>
                          <div className="p-2 bg-[#1C1C22] rounded text-xs font-mono text-gray-500 flex items-center justify-between">
                            <span>
                              {showApiKey[config.id] 
                                ? config.api_key 
                                : '•'.repeat(Math.min(20, config.api_key?.length || 20))
                              }
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowApiKey(prev => ({...prev, [config.id]: !prev[config.id]}))}
                              className="h-6 w-6 p-0 text-gray-500"
                            >
                              {showApiKey[config.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDefault(config.id)}
                            className="flex-1 border-[#27272A] text-gray-300"
                          >
                            {config.is_default ? 'Remove Default' : 'Set Default'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(config.id)}
                            className="text-gray-400"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteConfig(config.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Brain Connection */}
      <Card className="border-[#27272A] bg-[#1C1C22]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Knowledge Brain Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-[#0A0A0F]/50 rounded-xl border border-[#27272A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Connect to Knowledge Brain</h4>
                  <p className="text-gray-500 text-sm">AI providers will use your business knowledge for better responses</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
