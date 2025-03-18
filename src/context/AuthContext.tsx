
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuthStatus, logoutUser } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
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
  
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const currentUser = checkAuthStatus();
      
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        
        // Redirect to login if not authenticated and not already on login or signup
        const publicRoutes = ['/login', '/signup'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [location.pathname, navigate]);
  
  const logout = () => {
    logoutUser();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
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
