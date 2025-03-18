
import React, { useState, useEffect } from 'react';
import { BellRing, CheckCircle, Clock, Filter, Search, Trash2, AlertTriangle, Info, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNotifications } from '@/services/dataService';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  read: boolean;
  module?: string;
}

const NotificationsCenter = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Mock data in case the API fails
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Production Yield Increased',
            message: 'The production yield has increased by 2.3% in the last week.',
            type: 'success',
            timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
            read: false,
            module: 'factory-planning'
          },
          {
            id: '2',
            title: 'Energy Consumption Alert',
            message: 'Energy consumption has exceeded the weekly threshold by 5%.',
            type: 'warning',
            timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000),
            read: true,
            module: 'factory-planning'
          },
          {
            id: '3',
            title: 'New AI Model Deployed',
            message: 'The steel prediction model has been updated with new algorithm.',
            type: 'info',
            timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
            read: false
          },
          {
            id: '4',
            title: 'Supply Chain Disruption',
            message: 'Potential supply chain disruption detected in raw materials delivery.',
            type: 'critical',
            timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            read: false,
            module: 'supply-planning'
          },
          {
            id: '5',
            title: 'Quality Inspection Completed',
            message: 'Monthly quality inspection has been completed with A+ rating.',
            type: 'success',
            timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
            read: true,
            module: 'quality-control'
          },
        ];
        setNotifications(mockNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    // Filter by search term
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'unread' && !notification.read) ||
                     (activeTab === notification.type);
    
    return matchesSearch && matchesTab;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle="Notifications Center" />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <BellRing className="h-6 w-6 mr-2 text-ey-yellow" />
                  Notifications
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark all as read
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search notifications..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-4">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                      Unread
                      <Badge className="ml-1 bg-ey-yellow text-ey-darkGray">
                        {notifications.filter(n => !n.read).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="warning">Warnings</TabsTrigger>
                    <TabsTrigger value="critical">Critical</TabsTrigger>
                    <TabsTrigger value="success">Success</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ey-yellow"></div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-10">
                  <BellRing className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No notifications found</h3>
                  <p className="text-gray-400 mt-1">
                    {searchTerm ? 'Try a different search term' : 'You\'re all caught up!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg border flex items-start ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                    >
                      <div className="mr-3 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{notification.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(notification.timestamp), 'MMM dd, h:mm a')}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex">
                            {notification.module && (
                              <Badge variant="outline" className="mr-2">
                                {notification.module.replace('-', ' ')}
                              </Badge>
                            )}
                            <Badge variant="outline" className={`
                              ${notification.type === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                              ${notification.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                              ${notification.type === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            `}>
                              {notification.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark as read
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {notification.module && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`/${notification.module}`}>
                                  View
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
