
import axios from 'axios';
import { AUTH_ENDPOINTS, API_CONFIG } from './apiConfig';
import { User } from '@/types/auth';
import { v4 as uuidv4 } from 'uuid';

// Define mock users for testing
const mockUsers = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
    allowedModules: ['demand-planning', 'supply-planning', 'order-promising', 'factory-planning', 'inventory-optimization', 'risk-management'],
    allowedAgents: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110]
  },
  'user@example.com': {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user' as const,
    allowedModules: ['demand-planning', 'supply-planning'],
    allowedAgents: [101, 102]
  },
  'manager@example.com': {
    id: '3',
    email: 'manager@example.com',
    password: 'manager123',
    firstName: 'Manager',
    lastName: 'User',
    role: 'user' as const,
    allowedModules: ['demand-planning', 'supply-planning', 'inventory-optimization'],
    allowedAgents: [101, 102, 103, 104, 105]
  },
  'analyst@example.com': {
    id: '4',
    email: 'analyst@example.com',
    password: 'analyst123',
    firstName: 'Data',
    lastName: 'Analyst',
    role: 'user' as const,
    allowedModules: ['demand-planning', 'factory-planning'],
    allowedAgents: [102, 103, 106]
  },
  'planner@example.com': {
    id: '5',
    email: 'planner@example.com',
    password: 'planner123',
    firstName: 'Supply',
    lastName: 'Planner',
    role: 'user' as const,
    allowedModules: ['supply-planning', 'order-promising'],
    allowedAgents: [101, 104, 105, 107]
  }
};

// Track active sessions to prevent multiple logins
const activeSessions = new Map<string, string>();

// Function to enforce single session per user
const enforceSingleSession = (userId: string): string => {
  // Generate a unique session ID
  const sessionId = uuidv4();
  
  // Check if user already has an active session
  if (activeSessions.has(userId)) {
    // Invalidate the previous session by removing it
    const previousSessionId = activeSessions.get(userId);
    
    // Remove previous session from localStorage if it's the current browser
    if (previousSessionId === localStorage.getItem('session-id')) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('current-user');
      localStorage.removeItem('ey-session-expiry');
      localStorage.removeItem('session-id');
      localStorage.removeItem('user-selected-agents');
    }
    
    // Broadcast logout event to other tabs/windows
    window.dispatchEvent(new CustomEvent('session-invalidated', { 
      detail: { userId, sessionId: previousSessionId }
    }));
  }
  
  // Set new active session
  activeSessions.set(userId, sessionId);
  return sessionId;
};

// Listen for session invalidation events from other tabs/windows
if (typeof window !== 'undefined') {
  window.addEventListener('session-invalidated', (event: CustomEvent) => {
    const { userId, sessionId } = event.detail;
    const currentSessionId = localStorage.getItem('session-id');
    
    // If this is the session being invalidated, logout
    if (sessionId === currentSessionId) {
      logoutUser();
      
      // Show notification or redirect
      window.dispatchEvent(new CustomEvent('session-expired', { 
        detail: { message: 'Your session was ended because you logged in elsewhere.' }
      }));
    }
  });
  
  // Setup storage event listener to detect changes across tabs
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth-token' && event.newValue === null) {
      // Another tab cleared auth token, logout here too
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        logoutUser();
        window.location.href = '/login';
      }
    }
  });
}

/**
 * Login user with email and password
 * Used in Login.tsx for user authentication
 * 
 * @param email User email
 * @param password User password
 * @returns User object with authentication token
 */
export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  try {
    // For backend integration, uncomment this:
    // const response = await axios.post(AUTH_ENDPOINTS.login, { email, password });
    // localStorage.setItem('auth-token', response.data.token);
    // return response.data;
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in our mock database
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error("Invalid credentials");
    }
    
    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = mockUser;
    const user: User = userWithoutPassword;
    
    // Generate a unique token
    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
    
    // Enforce single session per user
    const sessionId = enforceSingleSession(user.id);
    
    // Store token in localStorage
    localStorage.setItem('auth-token', token);
    
    // Store user in localStorage
    localStorage.setItem('current-user', JSON.stringify(user));
    
    // Store session ID
    localStorage.setItem('session-id', sessionId);
    
    // Set session expiry (7 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
    
    // Restore selected agents if they exist
    const selectedAgents = localStorage.getItem(`user-${user.id}-selected-agents`);
    if (selectedAgents) {
      localStorage.setItem('user-selected-agents', selectedAgents);
    }
    
    console.log('Login successful (mock)', { user, token });
    
    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * Used in Signup.tsx for user registration
 * Admin only functionality
 * 
 * @param email User email
 * @param password User password
 * @param firstName User first name
 * @param lastName User last name
 * @param role User role (default: 'user')
 * @param allowedModules List of allowed module IDs
 * @param allowedAgents List of allowed agent IDs
 * @returns User object with authentication token
 */
export const registerUser = async (
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string,
  role: 'user' | 'admin' = 'user',
  allowedModules: string[] = [],
  allowedAgents: number[] = []
): Promise<{ user: User, token: string }> => {
  try {
    // For backend integration, uncomment this:
    // const response = await axios.post(AUTH_ENDPOINTS.signup, { 
    //   email, password, firstName, lastName, role, allowedModules, allowedAgents
    // });
    // localStorage.setItem('auth-token', response.data.token);
    // return response.data;
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for admin user
    const currentUser = checkAuthStatus();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can create new users');
    }
    
    // Simulate registration
    if (email.trim() && password.trim()) {
      // Create a mock user and token for development
      const user: User = {
        id: '2',
        email: email,
        firstName: firstName || 'New',
        lastName: lastName || 'User',
        role: role,
        allowedModules: allowedModules,
        allowedAgents: allowedAgents
      };
      
      const token = 'mock-jwt-token';
      
      console.log('Registration successful (mock)', { user, token });
      
      return { user, token };
    } else {
      throw new Error('Invalid registration data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Validate authentication token
 * Used in AuthContext.tsx for session validation
 * 
 * @returns User object if token is valid
 */
export const validateToken = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('auth-token');
    
    if (!token) {
      return null;
    }
    
    // For backend integration, uncomment this:
    // const response = await axios.get(AUTH_ENDPOINTS.validateToken, {
    //   headers: {
    //     ...API_CONFIG.headers,
    //     Authorization: `Bearer ${token}`
    //   }
    // });
    // return response.data.user;
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if session is expired
    const sessionExpiry = localStorage.getItem('ey-session-expiry');
    if (sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (new Date() > expiryDate) {
        console.log('Session expired');
        // Clear auth data
        localStorage.removeItem('auth-token');
        localStorage.removeItem('current-user');
        localStorage.removeItem('ey-session-expiry');
        localStorage.removeItem('session-id');
        
        // Trigger session expired event
        window.dispatchEvent(new CustomEvent('session-expired', { 
          detail: { message: 'Your session has expired. Please log in again.' }
        }));
        
        return null;
      }
    }
    
    // Get user from localStorage
    const userJson = localStorage.getItem('current-user');
    if (userJson) {
      const user = JSON.parse(userJson) as User;
      
      // Verify session ID is valid
      const sessionId = localStorage.getItem('session-id');
      const activeSessionId = activeSessions.get(user.id);
      
      if (!sessionId || sessionId !== activeSessionId) {
        // Session is invalid (user logged in elsewhere)
        localStorage.removeItem('auth-token');
        localStorage.removeItem('current-user');
        localStorage.removeItem('ey-session-expiry');
        localStorage.removeItem('session-id');
        
        // Trigger session expired event
        window.dispatchEvent(new CustomEvent('session-expired', { 
          detail: { message: 'Your session was ended because you logged in elsewhere.' }
        }));
        
        return null;
      }
      
      console.log('Token validation successful (mock)', user);
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Logout user
 * Used to end user session
 */
export const logoutUser = async (): Promise<void> => {
  try {
    console.log("Logout started");
    const token = localStorage.getItem('auth-token');
    const userJson = localStorage.getItem('current-user');
    
    if (userJson) {
      const user = JSON.parse(userJson) as User;
      
      // Save selected agents before logout
      const selectedAgents = localStorage.getItem('user-selected-agents');
      if (selectedAgents) {
        localStorage.setItem(`user-${user.id}-selected-agents`, selectedAgents);
      }
      
      // Remove from active sessions
      activeSessions.delete(user.id);
    }
    
    if (token) {
      // For backend integration, uncomment this:
      // await axios.post(AUTH_ENDPOINTS.logout, {}, {
      //   headers: {
      //     ...API_CONFIG.headers,
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      console.log("Logout API would be called here");
    }
    
    // Clear auth data
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current-user');
    localStorage.removeItem('ey-session-expiry');
    localStorage.removeItem('session-id');
    
    console.log('Logout successful - localStorage cleared');
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if the API call fails, clear local storage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current-user');
    localStorage.removeItem('ey-session-expiry');
    localStorage.removeItem('session-id');
    
    throw error;
  }
};

/**
 * Check authentication status
 * Used in AuthContext to verify if user is logged in
 * 
 * @returns User object if authenticated, null otherwise
 */
export const checkAuthStatus = (): User | null => {
  try {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;
    
    // Check if session is expired
    const sessionExpiry = localStorage.getItem('ey-session-expiry');
    if (sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (new Date() > expiryDate) {
        // Session expired, clear auth data
        localStorage.removeItem('auth-token');
        localStorage.removeItem('current-user');
        localStorage.removeItem('ey-session-expiry');
        return null;
      }
    }
    
    // Get user from localStorage
    const userJson = localStorage.getItem('current-user');
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return null;
  }
};

/**
 * Authenticate user with email and password
 * Used in Login.tsx for user authentication
 * 
 * @param email User email
 * @param password User password
 * @returns User object with authentication token
 */
export const authenticateUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  return loginUser(email, password);
};

/**
 * Check if user has admin role
 * 
 * @returns boolean indicating if current user is an admin
 */
export const isAdmin = (): boolean => {
  const user = checkAuthStatus();
  return user?.role === 'admin';
};

/**
 * Check if user has access to a specific module
 * 
 * @param moduleId Module ID to check access for
 * @returns boolean indicating if user has access
 */
export const hasModuleAccess = (moduleId: string): boolean => {
  const user = checkAuthStatus();
  if (!user) return false;
  
  console.log(`Checking module access for ${moduleId}`, {
    user: user.email,
    role: user.role,
    allowedModules: user.allowedModules,
    hasAccess: user.role === 'admin' || user.allowedModules.includes(moduleId)
  });
  
  // Admins have access to everything
  if (user.role === 'admin') return true;
  
  // Check if module is in user's allowed modules
  return user.allowedModules.includes(moduleId);
};

/**
 * Check if user has access to a specific agent
 * 
 * @param agentId Agent ID to check access for
 * @returns boolean indicating if user has access
 */
export const hasAgentAccess = (agentId: number): boolean => {
  const user = checkAuthStatus();
  if (!user) return false;
  
  console.log(`Checking agent access for ${agentId}`, {
    user: user.email,
    role: user.role,
    allowedAgents: user.allowedAgents,
    hasAccess: user.role === 'admin' || user.allowedAgents.includes(agentId)
  });
  
  // Admins have access to everything
  if (user.role === 'admin') return true;
  
  // Check if agent is in user's allowed agents
  return user.allowedAgents.includes(agentId);
};
