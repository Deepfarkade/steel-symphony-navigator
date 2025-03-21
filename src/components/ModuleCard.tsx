
import React from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AccessDeniedDialog from './AccessDeniedDialog';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  moduleId: string; // Add moduleId prop for access control
  color?: string;
  completed?: string | number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  icon, 
  path,
  moduleId,
  color = 'bg-ey-yellow/10',
  completed
}) => {
  const { hasModuleAccess } = useAuth();
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = React.useState(false);
  const hasAccess = hasModuleAccess(moduleId);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasAccess) {
      // Navigate to the module page if user has access
      navigate(path);
    } else {
      // Show the access denied dialog if user doesn't have access
      setShowAccessDeniedDialog(true);
    }
  };

  return (
    <>
      <div className="block group">
        <div 
          onClick={handleClick} 
          className="ey-card p-6 h-full transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg relative overflow-hidden cursor-pointer"
        >
          {!hasAccess && (
            <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <LockKeyhole className="h-3 w-3 mr-1" />
              Restricted
            </div>
          )}
          
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
      </div>

      {/* Use our new AccessDeniedDialog component */}
      <AccessDeniedDialog 
        isOpen={showAccessDeniedDialog} 
        onClose={() => setShowAccessDeniedDialog(false)}
        resourceType="module"
        resourceName={`the ${title} module`}
      />
    </>
  );
};

export default ModuleCard;
