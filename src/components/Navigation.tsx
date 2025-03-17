
import React, { useState } from 'react';
import { 
  BarChart3, 
  Box, 
  Calendar, 
  ClipboardList, 
  Database, 
  Factory, 
  Home, 
  LayoutDashboard, 
  Orbit, 
  Package, 
  Settings, 
  Truck, 
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  { 
    name: 'Home', 
    icon: <Home className="h-5 w-5" />, 
    path: '/', 
    active: true 
  },
  { 
    name: 'Demand Planning', 
    icon: <BarChart3 className="h-5 w-5" />, 
    path: '/demand-planning',
    active: false 
  },
  { 
    name: 'Supply Planning', 
    icon: <Orbit className="h-5 w-5" />, 
    path: '/supply-planning',
    active: false 
  },
  { 
    name: 'Order Promising', 
    icon: <ClipboardList className="h-5 w-5" />, 
    path: '/order-promising',
    active: false 
  },
  { 
    name: 'Factory Planning', 
    icon: <Factory className="h-5 w-5" />, 
    path: '/factory-planning',
    active: false 
  },
  { 
    name: 'Inventory Optimization', 
    icon: <Package className="h-5 w-5" />, 
    path: '/inventory-optimization',
    active: false 
  },
  { 
    name: 'Inventory Liquidation', 
    icon: <Box className="h-5 w-5" />, 
    path: '/inventory-liquidation',
    active: false 
  },
  { 
    name: 'Logistics Management', 
    icon: <Truck className="h-5 w-5" />, 
    path: '/logistics',
    active: false 
  },
  { 
    name: 'Risk Management', 
    icon: <AlertTriangle className="h-5 w-5" />, 
    path: '/risk-management',
    active: false 
  },
  { 
    name: 'Analytics & Reporting', 
    icon: <Database className="h-5 w-5" />, 
    path: '/analytics',
    active: false 
  },
];

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-ey-lightGray/20 shadow-sm`}>
      <div className="h-full px-3 py-8 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            {isExpanded ? (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
                <span className="ml-2 text-lg font-semibold">Steel Co-Pilot</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
            )}
          </div>
          
          {/* Nav links */}
          <ul className="space-y-2">
            {modules.map((module) => (
              <li key={module.name}>
                <Link 
                  to={module.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                    module.active ? 'bg-ey-yellow/20 text-ey-darkGray' : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {module.icon}
                  </div>
                  {isExpanded && (
                    <span className="ml-3 whitespace-nowrap">{module.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bottom section */}
        <div>
          <div className="flex items-center p-3 mb-2 rounded-lg text-ey-darkGray/70 hover:bg-ey-yellow/10 transition-all duration-300 cursor-pointer">
            <Settings className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Settings</span>}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-darkGray/5 text-ey-darkGray hover:bg-ey-darkGray/10 transition-all duration-300"
          >
            {isExpanded ? '<<' : '>>'}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
