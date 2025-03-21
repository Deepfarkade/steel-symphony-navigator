
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  companyId?: string;
  allowedModules: string[];
  allowedAgents: number[];
}

export type AuthMethod = 'password' | 'sso';

export type Theme = 'light' | 'dark';
