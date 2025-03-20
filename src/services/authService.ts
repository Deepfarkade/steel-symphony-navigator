
import axios from 'axios';
import { AUTH_ENDPOINTS, API_CONFIG } from './apiConfig';

// Define the user object structure
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  companyId?: string;
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
    
    // Simulate authentication
    if (email.trim() && password.trim()) {
      // Create a mock user and token for development
      const user: User = {
        id: '1',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
      };
      
      const token = 'mock-jwt-token';
      
      // Store token in localStorage
      localStorage.setItem('auth-token', token);
      
      // Store user in localStorage
      localStorage.setItem('current-user', JSON.stringify(user));
      
      // Set session expiry (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
      
      console.log('Login successful (mock)', { user, token });
      
      return { user, token };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * Used in Signup.tsx for user registration
 * 
 * @param email User email
 * @param password User password
 * @param firstName User first name
 * @param lastName User last name
 * @returns User object with authentication token
 */
export const registerUser = async (
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string
): Promise<{ user: User, token: string }> => {
  try {
    // For backend integration, uncomment this:
    // const response = await axios.post(AUTH_ENDPOINTS.signup, { 
    //   email, password, firstName, lastName 
    // });
    // localStorage.setItem('auth-token', response.data.token);
    // return response.data;
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate registration
    if (email.trim() && password.trim()) {
      // Create a mock user and token for development
      const user: User = {
        id: '1',
        email: email,
        firstName: firstName || 'New',
        lastName: lastName || 'User',
        role: 'user',
      };
      
      const token = 'mock-jwt-token';
      
      // Store token in localStorage
      localStorage.setItem('auth-token', token);
      
      // Store user in localStorage
      localStorage.setItem('current-user', JSON.stringify(user));
      
      // Set session expiry (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
      
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
        return null;
      }
    }
    
    // Get user from localStorage
    const userJson = localStorage.getItem('current-user');
    if (userJson) {
      const user = JSON.parse(userJson) as User;
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
    const token = localStorage.getItem('auth-token');
    
    if (token) {
      // For backend integration, uncomment this:
      // await axios.post(AUTH_ENDPOINTS.logout, {}, {
      //   headers: {
      //     ...API_CONFIG.headers,
      //     Authorization: `Bearer ${token}`
      //   }
      // });
    }
    
    // Clear auth data
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current-user');
    localStorage.removeItem('ey-session-expiry');
    
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if the API call fails, clear local storage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current-user');
    localStorage.removeItem('ey-session-expiry');
    
    throw error;
  }
};
