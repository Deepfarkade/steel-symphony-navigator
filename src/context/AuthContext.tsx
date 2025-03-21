import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuthStatus, logoutUser } from '../services/authService';
import { useToast } from '@/hooks/use-toast';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { User } from '@/types/auth';
import { SSOProvider, initiateSSOLogin } from '@/services/ssoService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  initiateSSO: (provider: SSOProvider) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  initiateSSO: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Set a long session timeout (7 days by default)
const SESSION_EXPIRY_DAYS = 7;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if current route is an SSO callback route
  const isSSOCallback = location.pathname === '/auth/callback';
  
  // Function to set a session expiry timestamp
  const setSessionExpiry = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + SESSION_EXPIRY_DAYS);
    localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
    console.log("Session expiry set to:", expiryDate);
  };
  
  // Function to check if the session is valid
  const isSessionValid = (): boolean => {
    const expiryStr = localStorage.getItem('ey-session-expiry');
    if (!expiryStr) return false;
    
    const expiry = new Date(expiryStr);
    const isValid = expiry > new Date();
    console.log("Session validity check:", isValid, "Expiry:", expiry);
    return isValid;
  };
  
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      
      // Check if we have a valid session and user data
      const currentUser = checkAuthStatus();
      const validSession = isSessionValid();
      
      console.log("Auth check - User:", !!currentUser, "Valid session:", validSession);
      
      if (currentUser && validSession) {
        // Type-safe assignment of the currentUser
        setUser(currentUser);
      } else {
        // Clear any invalid session data
        if (currentUser && !validSession) {
          logoutUser();
        }
        
        setUser(null);
        
        // Redirect to login if not authenticated and not already on login, signup or SSO callback
        const publicRoutes = ['/login', '/signup', '/auth/callback'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
      
      setIsLoading(false);
    };
    
    // If this is an SSO callback, don't redirect
    if (!isSSOCallback) {
      checkAuth();
    }
  }, [location.pathname, navigate, isSSOCallback]);
  
  const logout = async () => {
    try {
      // First call logoutUser to clear tokens and storage
      await logoutUser();
      
      // Then update state
      setUser(null);
      localStorage.removeItem('ey-session-expiry');
      
      // Display toast notification
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Navigate to login page - doing this last ensures all cleanup is done first
      navigate('/login');
      
      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force navigation to login even if there was an error
      navigate('/login');
    }
  };
  
  const initiateSSO = (provider: SSOProvider) => {
    try {
      // Use the actual SSO service function
      initiateSSOLogin(provider);
    } catch (error) {
      console.error(`SSO error with ${provider}:`, error);
      throw error;
    }
  };
  
  // When a user logs in, set the session expiry
  useEffect(() => {
    if (user && !isSessionValid()) {
      setSessionExpiry();
    }
  }, [user]);
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    initiateSSO,
  };

  // Use the inactivity timeout hook
  const { TimeoutWarningDialog } = useInactivityTimeout();
  
  return (
    <AuthContext.Provider value={value}>
      {children}
      <TimeoutWarningDialog />
    </AuthContext.Provider>
  );
};

// Auth guard component
export const RequireAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ey-yellow"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : null;
};
