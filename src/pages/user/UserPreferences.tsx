
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Eye, Key, BrainCircuit, Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const UserPreferences = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    chatNotifications: true,
    aiAssistant: true,
    dataCollection: true,
    defaultModule: 'home',
    language: 'en',
    timeFormat: '24h',
    inactivityTimeout: '30',
  });
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your user preferences have been updated successfully.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="w-full min-h-screen bg-background">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle="User Preferences" />
        
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <User className="h-6 w-6 mr-2 text-ey-yellow" />
                  User Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="aiSettings">AI Settings</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name || 'John Doe'} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user?.email || 'john.doe@example.com'} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="defaultModule">Default Module</Label>
                        <Select value={preferences.defaultModule} onValueChange={(value) => setPreferences({...preferences, defaultModule: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Default Module" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home Dashboard</SelectItem>
                            <SelectItem value="demand-planning">Demand Planning</SelectItem>
                            <SelectItem value="supply-planning">Supply Planning</SelectItem>
                            <SelectItem value="factory-planning">Factory Planning</SelectItem>
                            <SelectItem value="inventory-optimization">Inventory Optimization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Theme Preference</Label>
                        <div className="flex space-x-4 pt-2">
                          <Button
                            variant={theme === 'light' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setTheme('light')}
                          >
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </Button>
                          <Button
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setTheme('dark')}
                          >
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </Button>
                          <Button
                            variant={theme === 'system' ? 'default' : 'outline'}
                            className="flex-1 bg-ey-yellow text-ey-black"
                            onClick={() => setTheme('system')}
                          >
                            <Monitor className="h-4 w-4 mr-2" />
                            System
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inactivityTimeout">Inactivity Timeout (minutes)</Label>
                        <Select value={preferences.inactivityTimeout} onValueChange={(value) => setPreferences({...preferences, inactivityTimeout: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="120">120 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={handleSavePreferences} className="bg-ey-yellow text-ey-black hover:bg-ey-yellow/90">Save General Preferences</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive email notifications for important alerts and updates</p>
                        </div>
                        <Switch 
                          id="emailNotifications" 
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications" className="text-base">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive browser notifications for real-time alerts</p>
                        </div>
                        <Switch 
                          id="pushNotifications" 
                          checked={preferences.pushNotifications}
                          onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="chatNotifications" className="text-base">Chat Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications when AI assistant has a new message</p>
                        </div>
                        <Switch 
                          id="chatNotifications" 
                          checked={preferences.chatNotifications}
                          onCheckedChange={(checked) => setPreferences({...preferences, chatNotifications: checked})}
                        />
                      </div>
                      
                      <Button onClick={handleSavePreferences}>Save Notification Preferences</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="aiSettings">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="aiAssistant" className="text-base">AI Co-Pilot</Label>
                          <p className="text-sm text-gray-500">Enable AI assistant to provide recommendations and insights</p>
                        </div>
                        <Switch 
                          id="aiAssistant" 
                          checked={preferences.aiAssistant}
                          onCheckedChange={(checked) => setPreferences({...preferences, aiAssistant: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dataCollection" className="text-base">AI Learning</Label>
                          <p className="text-sm text-gray-500">Allow AI assistant to learn from your interactions to improve recommendations</p>
                        </div>
                        <Switch 
                          id="dataCollection" 
                          checked={preferences.dataCollection}
                          onCheckedChange={(checked) => setPreferences({...preferences, dataCollection: checked})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aiModel">Default AI Model</Label>
                        <Select defaultValue="advanced">
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Advanced models provide more detailed analysis but may take longer to respond</p>
                      </div>
                      
                      <Button onClick={handleSavePreferences}>Save AI Settings</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      
                      <Button onClick={() => toast({
                        title: "Password Updated",
                        description: "Your password has been updated successfully.",
                      })}>Update Password</Button>
                      
                      <div className="pt-4 border-t mt-6">
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <Button variant="outline" className="mb-2 w-full justify-start">
                          <Key className="h-4 w-4 mr-2" />
                          Enable Two-Factor Authentication
                        </Button>
                        <p className="text-xs text-gray-500">Enhance your account security by requiring a second verification step when logging in</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
