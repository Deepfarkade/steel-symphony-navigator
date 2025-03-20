
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  companyId?: string;
}

export type AuthMethod = 'password' | 'sso';

export type Theme = 'light' | 'dark';
