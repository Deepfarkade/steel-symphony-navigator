
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle, LockKeyhole, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RestrictedModuleProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color?: string;
  completed?: string;
  restricted?: boolean;
}

const RestrictedModuleCard: React.FC<RestrictedModuleProps> = ({ 
  id, 
  title, 
  description, 
  icon, 
  path, 
  color = 'bg-blue-100',
  completed = '0',
  restricted = false
}) => {
  const { hasModuleAccess } = useAuth();
  const userHasAccess = hasModuleAccess(id);
  const [showAccessDialog, setShowAccessDialog] = React.useState(false);
  
  // Function to handle module card click
  const handleModuleClick = (e: React.MouseEvent) => {
    if (restricted) {
      e.preventDefault();
      setShowAccessDialog(true);
    }
  };
  
  return (
    <>
      <Link 
        to={path} 
        onClick={handleModuleClick}
        className={`block relative ${restricted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className={`${restricted ? 'opacity-70' : ''} ${color} p-6 rounded-lg transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 h-full`}>
          {restricted && (
            <div className="absolute top-2 right-2 bg-amber-500/80 text-white rounded-full p-1">
              <LockKeyhole className="h-4 w-4" />
            </div>
          )}
          
          <div className="flex items-start mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm mr-4">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Completion</span>
              <span>{completed}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${restricted ? 'bg-gray-400' : 'bg-yellow-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${completed}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <span className={`text-sm inline-flex items-center ${restricted ? 'text-gray-500' : 'text-yellow-600'}`}>
              {restricted ? 'Access Restricted' : 'Explore'} 
              <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </div>
        </div>
      </Link>
      
      <AlertDialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Access Restricted
            </AlertDialogTitle>
            <AlertDialogDescription>
              You don't have permission to access the {title} module.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-amber-50 rounded-md">
            <p className="text-sm text-amber-800">
              This module requires special permission. Please contact your administrator to request access.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAccessDialog(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RestrictedModuleCard;
