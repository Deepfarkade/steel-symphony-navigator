
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClockIcon, LogOutIcon } from 'lucide-react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 100 * 1000; // 100 seconds for warning

const UserInactivityHandler: React.FC = () => {
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(100);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Hide warning dialog if it's shown
    if (showWarning) {
      setShowWarning(false);
    }

    // Set new inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingTime(Math.floor(WARNING_TIMEOUT / 1000));
      
      // Set countdown timer
      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Clear the interval when reaching 0
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Set logout timer
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(false);
        logout();
      }, WARNING_TIMEOUT);
    }, INACTIVITY_TIMEOUT - WARNING_TIMEOUT);
  };

  // Event handler for session expired events from authService
  const handleSessionExpired = (event: CustomEvent) => {
    logout();
    
    // Display a notification to the user (could be enhanced with a toast)
    console.log(event.detail.message);
  };

  // Set event listeners to track user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners for user activity
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    // Listen for session expired events
    window.addEventListener('session-expired', handleSessionExpired as EventListener);
    
    // Initial setup of inactivity timer
    resetInactivityTimer();
    
    // Cleanup event listeners and timers
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      
      window.removeEventListener('session-expired', handleSessionExpired as EventListener);
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [logout]);
  
  // Handle stay signed in action
  const handleStaySignedIn = () => {
    resetInactivityTimer();
  };

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent className="max-w-md animate-scale-in">
        <AlertDialogHeader>
          <div className="flex items-center mb-2">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <ClockIcon className="h-6 w-6 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-xl">Session Expiring Soon</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Your session will expire in <span className="font-bold text-red-500 animate-pulse">{remainingTime}</span> seconds due to inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 space-y-3">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(remainingTime / 100) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            For security reasons, your session will automatically end after a period of inactivity.
          </p>
        </div>
        
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel 
            onClick={() => {
              if (warningTimerRef.current) {
                clearTimeout(warningTimerRef.current);
              }
              setShowWarning(false);
              logout();
            }}
            className="flex items-center"
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            Log Out
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleStaySignedIn}
            className="bg-ey-yellow hover:bg-ey-yellow/90 text-ey-darkGray"
          >
            Stay Signed In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserInactivityHandler;
