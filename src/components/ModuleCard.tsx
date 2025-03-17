
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  icon, 
  path,
  color = 'bg-ey-yellow/10' 
}) => {
  return (
    <Link to={path} className="block">
      <div className="ey-card p-6 h-full transition-all duration-300 hover:translate-y-[-5px] animate-slide-up">
        <div className="flex items-start mb-4">
          <div className={`p-3 rounded-full ${color} mr-4`}>
            {icon}
          </div>
          <h3 className="text-lg font-medium text-ey-darkGray">{title}</h3>
        </div>
        
        <p className="text-ey-lightGray mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center text-ey-yellow hover:underline text-sm font-medium">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default ModuleCard;
