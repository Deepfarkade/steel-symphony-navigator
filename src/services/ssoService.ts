
import { User } from '@/types/auth';

// Define SSO provider types
export type SSOProvider = 'google' | 'microsoft' | 'okta' | 'onelogin';

interface SSOConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  authorizationEndpoint: string;
}

// Configuration for different SSO providers
const ssoConfigs: Record<SSOProvider, SSOConfig> = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    responseType: 'code',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth'
  },
  microsoft: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    responseType: 'code',
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
  },
  okta: {
    clientId: import.meta.env.VITE_OKTA_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    responseType: 'code',
    authorizationEndpoint: import.meta.env.VITE_OKTA_DOMAIN ? `https://${import.meta.env.VITE_OKTA_DOMAIN}/oauth2/v1/authorize` : ''
  },
  onelogin: {
    clientId: import.meta.env.VITE_ONELOGIN_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    responseType: 'code',
    authorizationEndpoint: import.meta.env.VITE_ONELOGIN_DOMAIN ? `https://${import.meta.env.VITE_ONELOGIN_DOMAIN}/oidc/2/auth` : ''
  }
};

/**
 * Initialize SSO login with a specific provider
 */
export const initiateSSOLogin = (provider: SSOProvider): void => {
  const config = ssoConfigs[provider];
  
  if (!config.clientId) {
    console.error(`Missing client ID for ${provider} SSO`);
    return;
  }
  
  // Generate a random state to prevent CSRF
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('sso_state', state);
  
  // Construct the authorization URL
  const authUrl = new URL(config.authorizationEndpoint);
  authUrl.searchParams.append('client_id', config.clientId);
  authUrl.searchParams.append('redirect_uri', config.redirectUri);
  authUrl.searchParams.append('response_type', config.responseType);
  authUrl.searchParams.append('scope', config.scope);
  authUrl.searchParams.append('state', state);
  
  // Redirect the user to the authorization endpoint
  window.location.href = authUrl.toString();
};

/**
 * Handle the callback from the SSO provider
 * In a real application, this would make a backend request to exchange the code for a token
 */
export const handleSSOCallback = async (code: string, state: string): Promise<User | null> => {
  // Verify state to prevent CSRF attacks
  const savedState = localStorage.getItem('sso_state');
  if (!savedState || savedState !== state) {
    throw new Error('Invalid state parameter');
  }
  
  // Clear the saved state
  localStorage.removeItem('sso_state');
  
  // In a real application, this would make a backend request to exchange the code for tokens
  // For this simulation, we'll just return a mock user
  
  // Simulating API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: '1',
        name: 'SSO User',
        email: 'sso.user@example.com',
        role: 'user'
      };
      
      // Store user in localStorage
      localStorage.setItem('ey-user', JSON.stringify(user));
      
      resolve(user);
    }, 800);
  });
};

/**
 * Check if SSO is configured
 */
export const isSSOConfigured = (provider: SSOProvider): boolean => {
  return !!ssoConfigs[provider].clientId;
};

/**
 * Get available SSO providers that have configuration
 */
export const getConfiguredSSOProviders = (): SSOProvider[] => {
  return Object.entries(ssoConfigs)
    .filter(([_, config]) => !!config.clientId)
    .map(([provider]) => provider as SSOProvider);
};
