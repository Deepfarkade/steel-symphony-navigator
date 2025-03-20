
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type AuthMethod = 'password' | 'sso';

export type Theme = 'light' | 'dark';
