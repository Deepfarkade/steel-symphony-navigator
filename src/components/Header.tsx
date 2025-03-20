
import React, { useState } from 'react';
import { Bell, Search, User, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  link: string;
}

interface HeaderProps {
  pageTitle: string;
  breadcrumbs?: Breadcrumb[];
}

const Header: React.FC<HeaderProps> = ({ pageTitle, breadcrumbs }) => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New production milestone reached", time: "10 min ago", read: false },
    { id: 2, title: "Supply chain alert: Potential delay", time: "1 hour ago", read: false },
    { id: 3, title: "Energy efficiency improved by 15%", time: "3 hours ago", read: true },
    { id: 4, title: "Weekly report generated", time: "Yesterday", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Helper function to get user's display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email.split('@')[0];
  };

  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-ey-darkGray">{pageTitle}</h1>
        
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center text-sm text-ey-lightGray mt-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-ey-darkGray">{crumb.label}</span>
                ) : (
                  <Link to={crumb.link} className="hover:text-ey-yellow transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        
        {!breadcrumbs && (
          <p className="text-ey-lightGray mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            className="pl-10 pr-4 py-2 rounded-lg border border-ey-lightGray/20 focus:outline-none focus:ring-2 focus:ring-ey-yellow/50 w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ey-lightGray h-5 w-5" />
        </div>
        
        {/* Notifications */}
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-ey-lightGray/10 transition-all duration-300">
              <Bell className="h-6 w-6 text-ey-darkGray" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs text-ey-yellow hover:text-ey-yellow/80"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-ey-yellow/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      {!notification.read && (
                        <span className="h-2 w-2 bg-ey-yellow rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      )}
                      <div className={!notification.read ? 'ml-0' : 'ml-4'}>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-ey-lightGray mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-ey-lightGray">
                  No notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="text-xs text-ey-yellow hover:text-ey-yellow/80 w-full">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* User profile */}
        <div className="flex items-center cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-ey-darkGray flex items-center justify-center text-white mr-2">
            <User className="h-5 w-5" />
          </div>
          <span className="font-medium text-ey-darkGray">{getUserDisplayName()}</span>
        </div>
      </div>

      {/* Search Results Dialog */}
      <Dialog open={searchOpen && searchQuery.length > 0} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              Results for "{searchQuery}"
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {searchQuery.length > 0 ? (
              <>
                <div className="p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                  <h4 className="text-sm font-medium">Supply Planning</h4>
                  <p className="text-xs text-gray-500">Module</p>
                </div>
                <div className="p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                  <h4 className="text-sm font-medium">Steel Production Report - Q1 2023</h4>
                  <p className="text-xs text-gray-500">Document</p>
                </div>
                <div className="p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                  <h4 className="text-sm font-medium">Production Yield KPI</h4>
                  <p className="text-xs text-gray-500">Analytics</p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No results found</p>
            )}
          </div>
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="absolute top-2 right-2"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
