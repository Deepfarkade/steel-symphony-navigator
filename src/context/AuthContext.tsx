
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuthStatus, logoutUser } from '../services/authService';
import { useToast } from '@/hooks/use-toast';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { User } from '@/types/auth';
import { SSOProvider } from '@/services/ssoService';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if current route is an SSO callback route
  const isSSOCallback = location.pathname === '/auth/callback';
  
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const currentUser = checkAuthStatus();
      
      if (currentUser) {
        setUser(currentUser);
      } else {
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

  // Handle SSO callback
  useEffect(() => {
    if (isSSOCallback) {
      const handleCallback = async () => {
        setIsLoading(true);
        try {
          // Parse the URL parameters
          const params = new URLSearchParams(location.search);
          const code = params.get('code');
          const state = params.get('state');
          const error = params.get('error');
          
          if (error) {
            throw new Error(error);
          }
          
          if (!code || !state) {
            throw new Error('Missing required parameters');
          }
          
          // In a real app, you would call a function to handle the SSO callback
          // For now, we'll simulate a successful login
          const user = {
            id: '1',
            name: 'SSO User',
            email: 'user@example.com',
            role: 'user'
          };
          
          localStorage.setItem('ey-user', JSON.stringify(user));
          setUser(user);
          
          toast({
            title: "SSO Login Successful",
            description: "You have been successfully logged in.",
          });
          
          // Redirect to home page
          navigate('/');
        } catch (error) {
          console.error('SSO login error:', error);
          toast({
            variant: "destructive",
            title: "SSO Login Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred",
          });
          navigate('/login');
        } finally {
          setIsLoading(false);
        }
      };
      
      handleCallback();
    }
  }, [isSSOCallback, location.search, navigate, toast]);
  
  const logout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };
  
  const initiateSSO = (provider: SSOProvider) => {
    // In a real app, this would redirect to the SSO provider
    // For simulation, we'll navigate to the callback URL with mock parameters
    const mockState = Math.random().toString(36).substring(2, 15);
    const mockCode = Math.random().toString(36).substring(2, 15);
    navigate(`/auth/callback?code=${mockCode}&state=${mockState}`);
  };
  
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
