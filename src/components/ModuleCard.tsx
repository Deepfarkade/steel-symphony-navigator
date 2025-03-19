
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color?: string;
  completed?: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  icon, 
  path,
  color = 'bg-ey-yellow/10',
  completed
}) => {
  return (
    <Link to={path} className="block group">
      <div className="ey-card p-6 h-full transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg relative overflow-hidden">
        <div className="flex items-start mb-4">
          <div className={`p-3 rounded-full ${color} mr-4 transition-all duration-300 group-hover:scale-110`}>
            {icon}
          </div>
          <h3 className="text-lg font-medium text-ey-darkGray">{title}</h3>
        </div>
        
        <p className="text-ey-lightGray mb-4 line-clamp-2">{description}</p>
        
        {completed !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ey-lightGray">Completion</span>
              <span className="text-ey-darkGray font-medium">{completed}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-ey-yellow rounded-full"
                style={{ width: `${completed}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center text-ey-yellow group-hover:underline text-sm font-medium transition-all">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
        
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ey-yellow/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
      </div>
    </Link>
  );
};

export default ModuleCard;
