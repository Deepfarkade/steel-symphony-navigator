
import React, { useState, useEffect } from 'react';
import { BellRing, Check, ChevronRight, Filter, Search, Trash2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { getNotifications } from '@/services/dataService';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data as Notification[]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Failed to load notifications",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [toast]);
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    toast({
      title: "Notification marked as read",
      variant: "default"
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    
    toast({
      title: "All notifications marked as read",
      variant: "default"
    });
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    
    toast({
      title: "Notification deleted",
      variant: "default"
    });
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "All notifications cleared",
      variant: "default"
    });
  };
  
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Apply tab filter
    if (filter === 'unread') {
      filtered = filtered.filter(notification => !notification.read);
    } else if (filter === 'alerts') {
      filtered = filtered.filter(notification => notification.type === 'alert');
    } else if (filter === 'info') {
      filtered = filtered.filter(notification => notification.type === 'info');
    } else if (filter === 'warnings') {
      filtered = filtered.filter(notification => notification.type === 'warning');
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const filteredNotifications = getFilteredNotifications();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div data-main-content className="ml-64 p-8 transition-all duration-300">
        <Header pageTitle="Notifications Center" />
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-ey-darkGray to-ey-darkGray/90 text-white rounded-t-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <BellRing className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <p className="text-sm text-white/80 mt-1">
                  Manage your system and process notifications
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                onClick={markAllAsRead}
                disabled={!notifications.some(n => !n.read)}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button 
                variant="destructive"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-4 md:flex-nowrap">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search notifications..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Options
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
              <div className="px-4 border-b">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">
                    All
                    <Badge variant="outline" className="ml-2 bg-gray-100">
                      {notifications.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread
                    <Badge variant="outline" className="ml-2 bg-ey-yellow/10 text-ey-yellow">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="alerts">
                    Alerts
                    <Badge variant="outline" className="ml-2 bg-red-100 text-red-600">
                      {notifications.filter(n => n.type === 'alert').length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="warnings">
                    Warnings
                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-600">
                      {notifications.filter(n => n.type === 'warning').length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="info">
                    Info
                    <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-600">
                      {notifications.filter(n => n.type === 'info').length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={filter} className="m-0">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin h-8 w-8 rounded-full border-4 border-ey-yellow border-t-transparent"></div>
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <div>
                      {filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 border-b last:border-b-0 hover:bg-gray-50 group ${
                            !notification.read ? 'bg-ey-yellow/5' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`
                              h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0
                              ${notification.type === 'alert' ? 'bg-red-100 text-red-600' : 
                                notification.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                                'bg-blue-100 text-blue-600'
                              }
                            `}>
                              <BellRing className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-ey-darkGray">{notification.title}</h3>
                                  <p className="text-sm text-ey-lightGray mt-1">{notification.message}</p>
                                  <p className="text-xs text-ey-lightGray mt-2">{notification.timestamp}</p>
                                </div>
                                
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      <Check className="h-4 w-4 text-green-600" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronRight className="h-4 w-4 text-ey-lightGray" />
                                  </Button>
                                </div>
                              </div>
                              
                              {!notification.read && (
                                <Badge className="mt-2 bg-ey-yellow/10 text-ey-yellow border-ey-yellow/20">
                                  Unread
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <BellRing className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-ey-darkGray">No notifications found</h3>
                      <p className="text-ey-lightGray mt-2">
                        {searchTerm ? 'Try a different search term' : 'You\'re all caught up!'}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsCenter;
