
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

  // Set event listeners to track user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners for user activity
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    // Initial setup of inactivity timer
    resetInactivityTimer();
    
    // Cleanup event listeners and timers
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in <span className="font-bold text-red-500">{remainingTime}</span> seconds due to inactivity.
            Would you like to stay signed in?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            if (warningTimerRef.current) {
              clearTimeout(warningTimerRef.current);
            }
            setShowWarning(false);
            logout();
          }}>
            Log Out
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleStaySignedIn}>
            Stay Signed In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserInactivityHandler;
