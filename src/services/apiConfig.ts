
/**
 * API Configuration
 * This file centralizes all API endpoints and configuration for connecting to your backend.
 * Replace the base URL and endpoints with your actual backend API when ready.
 */

// Base URL for all API requests
export const API_BASE_URL = "https://your-backend-api.com"; // REPLACE with your actual backend URL

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,           // Used for user authentication in Login.tsx
  signup: `${API_BASE_URL}/auth/signup`,         // Used for user registration in Signup.tsx
  ssoCallback: `${API_BASE_URL}/auth/sso`,       // Used for SSO authentication in SSOCallback.tsx
  validateToken: `${API_BASE_URL}/auth/validate`, // Used for token validation in AuthContext.tsx
  logout: `${API_BASE_URL}/auth/logout`,         // Used for user logout
};

// Data endpoints
export const DATA_ENDPOINTS = {
  // KPIs and Metrics
  kpis: `${API_BASE_URL}/data/kpis`,                     // Used in getKpis() - Dashboard KPI cards
  kpiDetail: (id: string) => `${API_BASE_URL}/data/kpis/${id}`, // Used in KpiDetails.tsx
  productionData: `${API_BASE_URL}/data/production`,     // Used in ProductionChartDetails.tsx
  energyData: `${API_BASE_URL}/data/energy`,             // Used in EnergyChartDetails.tsx
  coPilotAnalytics: `${API_BASE_URL}/data/copilot`,      // Used for AI analytics metrics
  
  // Module-specific endpoints
  moduleInsights: (module: string) => `${API_BASE_URL}/modules/${module}/insights`, // Used in useModuleInsights.tsx
  
  // User data
  notifications: `${API_BASE_URL}/user/notifications`,   // Used for user notifications
  preferences: `${API_BASE_URL}/user/preferences`,       // Used in UserPreferences.tsx
  
  // News and content
  latestNews: `${API_BASE_URL}/content/news`,            // Used in NewsPage.tsx
  
  // Chat and conversation
  chatMessages: (module?: string) => module 
    ? `${API_BASE_URL}/chat/${module}` 
    : `${API_BASE_URL}/chat/global`,                     // Used in GlobalChatPage.tsx and ModuleChatPage.tsx
};

// AI Agents endpoints
export const AGENTS_ENDPOINTS = {
  // Agent management
  available: `${API_BASE_URL}/agents/available`,         // Used in AgentsPage.tsx to get marketplace agents
  deployed: `${API_BASE_URL}/agents/deployed`,           // Used in useAgents.tsx to get user's deployed agents
  add: `${API_BASE_URL}/agents/add`,                     // Used to deploy an agent from marketplace
  remove: (id: number) => `${API_BASE_URL}/agents/remove/${id}`, // Used to remove an agent 
  details: (id: number) => `${API_BASE_URL}/agents/details/${id}`, // Used in AgentChatPage.tsx
  createCustom: `${API_BASE_URL}/agents/create`,         // Used in CreateAgentPage.tsx
  analytics: (id: number) => `${API_BASE_URL}/agents/${id}/analytics`, // Used for agent performance data
  recommendations: (id: number) => `${API_BASE_URL}/agents/${id}/recommendations`, // Used for agent recommendations
};

// Risk Management endpoints
export const RISK_ENDPOINTS = {
  riskAssessment: `${API_BASE_URL}/risk/assessment`,     // Used in RiskManagement.tsx
  riskMetrics: `${API_BASE_URL}/risk/metrics`,           // Used for risk-related metrics
  riskPredictions: `${API_BASE_URL}/risk/predictions`,   // Used for risk predictions and forecasts
  supplyChainRisks: `${API_BASE_URL}/risk/supply-chain`, // Used for supply chain risk analysis
};

// API request configuration
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    // Add authentication header function
    getAuthHeader: () => {
      const token = localStorage.getItem('auth-token'); // Adjust based on your token storage method
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
  },
  timeouts: {
    default: 10000, // 10 seconds
    long: 30000,    // 30 seconds for operations that might take longer
  }
};

// HTTP status codes for handling responses
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};
