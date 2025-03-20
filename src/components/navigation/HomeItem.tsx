
import React from 'react';
import { Home } from 'lucide-react';
import SidebarItem from '../sidebar/SidebarItem';
import { useTheme } from '@/context/ThemeContext';

interface HomeItemProps {
  isCollapsed: boolean;
}

const HomeItem: React.FC<HomeItemProps> = ({ isCollapsed }) => {
  const { theme } = useTheme();
  
  return (
    <SidebarItem
      title="Home"
      icon={<Home className={`h-5 w-5 ${theme === 'light' ? 'text-gray-700' : 'text-white'}`} />}
      to="/"
      isCollapsed={isCollapsed}
      theme={theme}
    />
  );
};

export default HomeItem;
