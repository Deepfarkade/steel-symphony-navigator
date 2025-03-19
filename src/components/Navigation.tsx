
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Box, 
  Calendar, 
  ClipboardList, 
  Database, 
  Factory, 
  Home, 
  Orbit, 
  Package, 
  Settings, 
  Truck, 
  AlertTriangle,
  LogOut,
  User,
  BrainCog
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const modules = [
  { 
    name: 'Home', 
    icon: <Home className="h-5 w-5" />, 
    path: '/'
  },
  { 
    name: 'Demand Planning', 
    icon: <BarChart3 className="h-5 w-5" />, 
    path: '/demand-planning'
  },
  { 
    name: 'Supply Planning', 
    icon: <Orbit className="h-5 w-5" />, 
    path: '/supply-planning'
  },
  { 
    name: 'Order Promising', 
    icon: <ClipboardList className="h-5 w-5" />, 
    path: '/order-promising'
  },
  { 
    name: 'Factory Planning', 
    icon: <Factory className="h-5 w-5" />, 
    path: '/factory-planning'
  },
  { 
    name: 'Inventory Optimization', 
    icon: <Package className="h-5 w-5" />, 
    path: '/inventory-optimization'
  },
  { 
    name: 'Inventory Liquidation', 
    icon: <Box className="h-5 w-5" />, 
    path: '/inventory-liquidation'
  },
  { 
    name: 'Logistics Management', 
    icon: <Truck className="h-5 w-5" />, 
    path: '/logistics'
  },
  { 
    name: 'Risk Management', 
    icon: <AlertTriangle className="h-5 w-5" />, 
    path: '/risk-management'
  },
  { 
    name: 'Analytics & Reporting', 
    icon: <Database className="h-5 w-5" />, 
    path: '/analytics'
  },
];

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Add effect to adjust main content area when sidebar collapses/expands
  useEffect(() => {
    // Select the main content container that needs to be adjusted
    const mainContent = document.querySelector('[data-main-content]');
    if (mainContent) {
      // Adjust margin based on sidebar state
      if (isExpanded) {
        mainContent.classList.remove('ml-20');
        mainContent.classList.add('ml-64');
      } else {
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-20');
      }
    }
  }, [isExpanded]);

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-ey-lightGray/20 shadow-sm`}>
      <div className="h-full px-3 py-8 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            {isExpanded ? (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
                <span className="ml-2 text-lg font-semibold">SECP</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
            )}
          </div>
          
          {/* User info when expanded */}
          {isExpanded && user && (
            <div className="px-4 py-3 mb-6 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-ey-yellow/30 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-ey-darkGray" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-ey-darkGray truncate">{user.name}</p>
                  <p className="text-xs text-ey-lightGray truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Nav links */}
          <div className="space-y-2">
            {modules.map((module) => (
              <Link 
                key={module.name}
                to={module.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  location.pathname === module.path 
                    ? 'bg-ey-yellow/20 text-ey-darkGray' 
                    : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                }`}
              >
                <div className="flex-shrink-0">
                  {module.icon}
                </div>
                {isExpanded && (
                  <span className="ml-3 whitespace-nowrap">{module.name}</span>
                )}
                {!isExpanded && location.pathname === module.path && (
                  <div className="absolute left-0 w-1 h-8 bg-ey-yellow rounded-r-full"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Bottom section */}
        <div>
          {isExpanded ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover:bg-ey-yellow/10 text-ey-darkGray/70">
                      <Settings className="h-5 w-5 mr-2" />
                      <span>Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-darkGray/5 text-ey-darkGray hover:bg-ey-darkGray/10 transition-all duration-300"
              >
                {'<<'}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-ey-yellow/10 text-ey-darkGray/70"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-ey-yellow/10 text-red-500"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-darkGray/5 text-ey-darkGray hover:bg-ey-darkGray/10 transition-all duration-300"
              >
                {'>>'}
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
