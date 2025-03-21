
import { User } from '@/types/auth';
import { v4 as uuidv4 } from 'uuid';

// Track active sessions to prevent multiple logins
const activeSessions = new Map<string, string>();

/**
 * Get a unique session ID
 */
export const getUniqueSessionId = (): string => {
  return uuidv4();
};

/**
 * Set a session expiry timestamp (default 7 days)
 */
export const setSessionExpiry = (daysValid: number = 7): void => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysValid);
  localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
};

/**
 * Check if the current session is valid
 */
export const isSessionValid = (): boolean => {
  const expiryStr = localStorage.getItem('ey-session-expiry');
  if (!expiryStr) return false;
  
  const expiry = new Date(expiryStr);
  return expiry > new Date();
};

/**
 * Enforce single session per user
 * @param userId The user ID to enforce single session for
 * @returns A unique session ID for this session
 */
export const enforceSingleSession = (userId: string): string => {
  // Generate a unique session ID
  const sessionId = getUniqueSessionId();
  
  // Check if user already has an active session
  if (activeSessions.has(userId)) {
    // Invalidate the previous session by removing it
    const previousSessionId = activeSessions.get(userId);
    
    // Broadcast logout event to other tabs/windows
    window.dispatchEvent(new CustomEvent('session-invalidated', { 
      detail: { userId, sessionId: previousSessionId }
    }));
  }
  
  // Set new active session
  activeSessions.set(userId, sessionId);
  
  // Store in localStorage for cross-tab communication
  localStorage.setItem('session-id', sessionId);
  localStorage.setItem('session-user-id', userId);
  
  return sessionId;
};

/**
 * Check if the current session ID is valid for the given user
 */
export const isValidSession = (user: User): boolean => {
  const sessionId = localStorage.getItem('session-id');
  const activeSessionId = activeSessions.get(user.id);
  
  return !!sessionId && !!activeSessionId && sessionId === activeSessionId;
};

/**
 * Remove a user's session
 */
export const removeUserSession = (userId: string): void => {
  activeSessions.delete(userId);
  localStorage.removeItem('session-id');
  localStorage.removeItem('session-user-id');
};

/**
 * Save selected agents for a user
 */
export const saveUserSelectedAgents = (userId: string, selectedAgents: number[]): void => {
  localStorage.setItem(`user-${userId}-selected-agents`, JSON.stringify(selectedAgents));
};

/**
 * Load selected agents for a user
 */
export const loadUserSelectedAgents = (userId: string): number[] => {
  const selectedAgents = localStorage.getItem(`user-${userId}-selected-agents`);
  if (selectedAgents) {
    try {
      return JSON.parse(selectedAgents);
    } catch (e) {
      console.error('Error parsing saved agents:', e);
    }
  }
  return [];
};

/**
 * Save user chat session preferences
 */
export const saveUserChatPreferences = (userId: string, preferences: Record<string, any>): void => {
  localStorage.setItem(`user-${userId}-chat-preferences`, JSON.stringify(preferences));
};

/**
 * Load user chat session preferences
 */
export const loadUserChatPreferences = (userId: string): Record<string, any> => {
  const preferencesStr = localStorage.setItem(`user-${userId}-chat-preferences`, JSON.stringify({}));
  if (preferencesStr) {
    try {
      return JSON.parse(preferencesStr as string);
    } catch (e) {
      console.error('Error parsing chat preferences:', e);
    }
  }
  return {};
};

/**
 * Initialize session listeners
 * Sets up event listeners for session management across tabs
 */
export const initSessionListeners = (logoutCallback: () => void): void => {
  // Listen for session invalidation events from other tabs/windows
  window.addEventListener('session-invalidated', (event: CustomEvent) => {
    const { sessionId } = event.detail;
    const currentSessionId = localStorage.getItem('session-id');
    
    // If this is the session being invalidated, logout
    if (sessionId === currentSessionId) {
      logoutCallback();
      
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
        logoutCallback();
        window.location.href = '/login';
      }
    }
  });
  
  // Check for session expiry every minute
  const checkExpiryInterval = setInterval(() => {
    if (!isSessionValid() && localStorage.getItem('auth-token')) {
      logoutCallback();
      clearInterval(checkExpiryInterval);
      
      // Show notification or redirect
      window.dispatchEvent(new CustomEvent('session-expired', { 
        detail: { message: 'Your session has expired. Please log in again.' }
      }));
      
      // Redirect to login
      window.location.href = '/login';
    }
  }, 60000); // Check every minute
};

/**
 * Clear all session data
 */
export const clearSessionData = (): void => {
  const userId = localStorage.getItem('session-user-id');
  if (userId) {
    removeUserSession(userId);
  }
  
  localStorage.removeItem('auth-token');
  localStorage.removeItem('current-user');
  localStorage.removeItem('ey-session-expiry');
  localStorage.removeItem('session-id');
  localStorage.removeItem('session-user-id');
};

/**
 * Trigger a session expired event
 */
export const triggerSessionExpired = (message: string): void => {
  window.dispatchEvent(new CustomEvent('session-expired', { 
    detail: { message }
  }));
};
