
import React from 'react';
import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, userName = 'John Smith' }) => {
  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-ey-darkGray">{pageTitle}</h1>
        <p className="text-ey-lightGray mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 rounded-lg border border-ey-lightGray/20 focus:outline-none focus:ring-2 focus:ring-ey-yellow/50 w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ey-lightGray h-5 w-5" />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-ey-lightGray/10 transition-all duration-300">
          <Bell className="h-6 w-6 text-ey-darkGray" />
          <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User profile */}
        <div className="flex items-center cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-ey-darkGray flex items-center justify-center text-white mr-2">
            <User className="h-5 w-5" />
          </div>
          <span className="font-medium text-ey-darkGray">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
