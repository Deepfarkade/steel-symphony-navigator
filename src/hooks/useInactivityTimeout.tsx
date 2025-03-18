
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_DURATION = 100; // 100 seconds for the warning dialog

export const useInactivityTimeout = () => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_DURATION);
  const { logout } = useAuth();

  const resetTimer = useCallback(() => {
    if (!showTimeoutWarning) {
      window.localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, [showTimeoutWarning]);

  const staySignedIn = useCallback(() => {
    setShowTimeoutWarning(false);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const handleUserActivity = () => {
      resetTimer();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    // Set initial activity timestamp
    resetTimer();

    // Check for inactivity
    const inactivityCheck = setInterval(() => {
      const lastActivity = Number(window.localStorage.getItem('lastActivity') || Date.now());
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT && !showTimeoutWarning) {
        setShowTimeoutWarning(true);
        setTimeRemaining(WARNING_DURATION);
      }
    }, 10000); // Check every 10 seconds

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(inactivityCheck);
    };
  }, [resetTimer, showTimeoutWarning]);

  // Countdown timer for warning dialog
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (showTimeoutWarning && timeRemaining > 0) {
      countdownInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showTimeoutWarning, timeRemaining, logout]);

  const TimeoutWarningDialog = () => (
    <Dialog open={showTimeoutWarning} onOpenChange={setShowTimeoutWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Timeout Warning</DialogTitle>
          <DialogDescription>
            Your session will expire in {timeRemaining} seconds due to inactivity.
          </DialogDescription>
        </DialogHeader>
        <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-ey-yellow rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeRemaining / WARNING_DURATION) * 100}%` }}
          ></div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button 
            type="button" 
            onClick={staySignedIn}
            className="bg-ey-yellow hover:bg-ey-yellow/90 text-ey-darkGray"
          >
            Stay Signed In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { TimeoutWarningDialog };
};
