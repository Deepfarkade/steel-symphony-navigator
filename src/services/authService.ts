
// Authentication services for EY Steel Co-Pilot

import { User } from "@/types/auth";

// This service simulates authentication but would connect to a real API endpoint
export const authenticateUser = async (email: string, password: string): Promise<User> => {
  // Simulating API call with delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // First check if there are any users in localStorage (for signup scenario)
      const storedUsers = localStorage.getItem('ey-users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Try to find the user in our "database"
      const foundUser = users.find((u: any) => u.email === email);
      
      // If user exists, check password
      if (foundUser && foundUser.password === password) {
        // Clone the user object without the password for security
        const { password: _, ...secureUser } = foundUser;
        
        // Store user in localStorage
        localStorage.setItem('ey-user', JSON.stringify(secureUser));
        
        // Set session expiry (7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
        
        resolve(secureUser);
      } else if (email && password && password.length >= 6) {
        // For demo purposes, if no users exist yet, create a default user
        const newUser = {
          id: Math.random().toString(36).substring(2, 15),
          name: email.split('@')[0],
          email,
          password,
          role: 'user'
        };
        
        // Store the user in the users array
        users.push(newUser);
        localStorage.setItem('ey-users', JSON.stringify(users));
        
        // Create a clean version without password for the session
        const { password: _, ...secureUser } = newUser;
        
        // Store logged-in user state
        localStorage.setItem('ey-user', JSON.stringify(secureUser));
        
        // Set session expiry (7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
        
        resolve(secureUser);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  // Simulating API call with delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password.length >= 6) {
        // Get existing users or create empty array
        const storedUsers = localStorage.getItem('ey-users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Check if email already exists
        const emailExists = users.some((user: any) => user.email === email);
        if (emailExists) {
          reject(new Error('Email already registered'));
          return;
        }
        
        // Create new user
        const newUser = {
          id: Math.random().toString(36).substring(2, 15),
          name,
          email,
          password, // In a real app, this would be hashed
          role: 'user'
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('ey-users', JSON.stringify(users));
        
        // Create a clean version without password for the session
        const { password: _, ...secureUser } = newUser;
        
        // Store logged-in user state
        localStorage.setItem('ey-user', JSON.stringify(secureUser));
        
        // Set session expiry (7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
        
        resolve(secureUser);
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 800);
  });
};

export const checkAuthStatus = (): User | null => {
  const storedUser = localStorage.getItem('ey-user');
  if (!storedUser) return null;
  
  // Check if session is still valid
  const expiryStr = localStorage.getItem('ey-session-expiry');
  if (!expiryStr) return null;
  
  const expiry = new Date(expiryStr);
  const isValid = expiry > new Date();
  
  return isValid ? JSON.parse(storedUser) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('ey-user');
  localStorage.removeItem('ey-session-expiry');
};
