
// Authentication services for EY Steel Co-Pilot

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// This service simulates authentication but would connect to a real API endpoint
export const authenticateUser = async (email: string, password: string): Promise<User> => {
  // Simulating API call with delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation
      if (email && password.length >= 6) {
        const user = {
          id: '1',
          name: email.split('@')[0],
          email,
          role: 'user'
        };
        
        // Store user in localStorage
        localStorage.setItem('ey-user', JSON.stringify(user));
        
        resolve(user);
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
        const user = {
          id: '1',
          name,
          email,
          role: 'user'
        };
        
        // Store user in localStorage
        localStorage.setItem('ey-user', JSON.stringify(user));
        
        resolve(user);
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 800);
  });
};

export const checkAuthStatus = (): User | null => {
  const storedUser = localStorage.getItem('ey-user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('ey-user');
};
