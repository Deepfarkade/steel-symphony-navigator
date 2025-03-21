
import React from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, AlertCircle, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AccessDeniedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  resourceType?: 'module' | 'agent' | 'resource';
  resourceName?: string;
}

// Animation variants for dialog elements
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }
  }
};

const AccessDeniedDialog: React.FC<AccessDeniedDialogProps> = ({
  isOpen,
  onClose,
  title = "Access Restricted",
  resourceType = "resource",
  resourceName = "this resource"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header with animated lock icon */}
          <DialogHeader className="bg-red-50 p-6 border-b border-red-100">
            <motion.div variants={iconVariants} className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-center text-red-800 text-xl">{title}</DialogTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogDescription className="text-center text-red-700">
                You don't have permission to access {resourceName}.
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          {/* Dialog content */}
          <div className="p-6">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex gap-3 border-l-4 border-amber-500 pl-3 py-2 bg-amber-50 rounded-sm">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Access Required</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {resourceType === 'module' 
                      ? "This module requires specific permissions that are not currently assigned to your account." 
                      : resourceType === 'agent'
                      ? "This AI agent requires specific access rights that are not currently assigned to your account."
                      : "This resource requires specific permissions that are not currently assigned to your account."}
                  </p>
                </div>
              </div>
              
              <motion.p 
                variants={itemVariants} 
                className="text-sm text-gray-600"
              >
                To request access, please contact your administrator with details about why you need access to {resourceName}.
              </motion.p>
            </motion.div>
          </div>

          {/* Footer with animated button */}
          <DialogFooter className="bg-gray-50 p-4 border-t border-gray-100">
            <motion.div 
              variants={itemVariants}
              className="w-full flex justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onClose}
                className="w-full md:w-auto bg-ey-darkGray text-white hover:bg-ey-darkGray/90"
              >
                I Understand
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessDeniedDialog;
