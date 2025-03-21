/**
 * API Configuration
 * This file centralizes all API endpoints and configuration for connecting to your backend.
 */

// Base URL for all API requests - set different URLs based on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; 

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/api/v1/auth/login`,
  signup: `${API_BASE_URL}/api/v1/auth/signup`,
  ssoCallback: `${API_BASE_URL}/api/v1/auth/sso`,
  validateToken: `${API_BASE_URL}/api/v1/auth/validate`,
  logout: `${API_BASE_URL}/api/v1/auth/logout`,
};

// Data endpoints
export const DATA_ENDPOINTS = {
  // KPIs and Metrics
  kpis: `${API_BASE_URL}/api/v1/data/kpis`,
  kpiDetail: (id: string) => `${API_BASE_URL}/api/v1/data/kpis/${id}`,
  productionData: `${API_BASE_URL}/api/v1/data/production`,
  energyData: `${API_BASE_URL}/api/v1/data/energy`,
  coPilotAnalytics: `${API_BASE_URL}/api/v1/data/copilot`,
  
  // Module-specific endpoints
  moduleInsights: (module: string) => `${API_BASE_URL}/api/v1/modules/${module}/insights`,
  
  // User data
  notifications: `${API_BASE_URL}/api/v1/user/notifications`,
  preferences: `${API_BASE_URL}/api/v1/user/preferences`,
  
  // News and content
  latestNews: `${API_BASE_URL}/api/v1/content/news`,
};

// Module-specific service endpoints
export const MODULE_SERVICE_ENDPOINTS = {
  // Each module has its own microservice
  demandPlanning: {
    base: `${API_BASE_URL}/services/demand-planning`,
    forecast: `${API_BASE_URL}/services/demand-planning/forecast`,
    scenarios: `${API_BASE_URL}/services/demand-planning/scenarios`,
    recommendations: `${API_BASE_URL}/services/demand-planning/recommendations`,
    chat: `${API_BASE_URL}/services/demand-planning/chat`,
  },
  supplyPlanning: {
    base: `${API_BASE_URL}/services/supply-planning`,
    network: `${API_BASE_URL}/services/supply-planning/network`,
    optimization: `${API_BASE_URL}/services/supply-planning/optimization`,
    constraints: `${API_BASE_URL}/services/supply-planning/constraints`,
    chat: `${API_BASE_URL}/services/supply-planning/chat`,
  },
  orderPromising: {
    base: `${API_BASE_URL}/services/order-promising`,
    availability: `${API_BASE_URL}/services/order-promising/availability`,
    delivery: `${API_BASE_URL}/services/order-promising/delivery-dates`,
    chat: `${API_BASE_URL}/services/order-promising/chat`,
  },
  factoryPlanning: {
    base: `${API_BASE_URL}/services/factory-planning`,
    schedule: `${API_BASE_URL}/services/factory-planning/schedule`,
    resources: `${API_BASE_URL}/services/factory-planning/resources`,
    chat: `${API_BASE_URL}/services/factory-planning/chat`,
  },
  inventoryOptimization: {
    base: `${API_BASE_URL}/services/inventory-optimization`,
    levels: `${API_BASE_URL}/services/inventory-optimization/levels`,
    policies: `${API_BASE_URL}/services/inventory-optimization/policies`,
    chat: `${API_BASE_URL}/services/inventory-optimization/chat`,
  },
  inventoryLiquidation: {
    base: `${API_BASE_URL}/services/inventory-liquidation`,
    pricing: `${API_BASE_URL}/services/inventory-liquidation/pricing`,
    recommendations: `${API_BASE_URL}/services/inventory-liquidation/recommendations`,
    chat: `${API_BASE_URL}/services/inventory-liquidation/chat`,
  },
  logistics: {
    base: `${API_BASE_URL}/services/logistics`,
    routing: `${API_BASE_URL}/services/logistics/routing`,
    carriers: `${API_BASE_URL}/services/logistics/carriers`,
    tracking: `${API_BASE_URL}/services/logistics/tracking`,
    chat: `${API_BASE_URL}/services/logistics/chat`,
  },
  riskManagement: {
    base: `${API_BASE_URL}/services/risk-management`,
    assessment: `${API_BASE_URL}/services/risk-management/assessment`,
    mitigation: `${API_BASE_URL}/services/risk-management/mitigation`,
    alerts: `${API_BASE_URL}/services/risk-management/alerts`,
    chat: `${API_BASE_URL}/services/risk-management/chat`,
  },
  analytics: {
    base: `${API_BASE_URL}/services/analytics`,
    reports: `${API_BASE_URL}/services/analytics/reports`,
    dashboards: `${API_BASE_URL}/services/analytics/dashboards`,
    chat: `${API_BASE_URL}/services/analytics/chat`,
  },
};

// Chat and conversation endpoints
export const CHAT_ENDPOINTS = {
  // Global chat
  global: `${API_BASE_URL}/api/v1/chat/global`,
  
  // Module-specific chats
  module: (module: string) => MODULE_SERVICE_ENDPOINTS[module as keyof typeof MODULE_SERVICE_ENDPOINTS]?.chat || 
    `${API_BASE_URL}/api/v1/chat/${module}`,
  
  // Agent-specific chats
  agent: (agentId: number) => `${API_BASE_URL}/api/v1/agents/${agentId}/chat`,
  
  // History and analytics
  history: (userId: string) => `${API_BASE_URL}/api/v1/chat/history/${userId}`,
  analytics: `${API_BASE_URL}/api/v1/chat/analytics`,
};

// AI Agents endpoints
export const AGENTS_ENDPOINTS = {
  // Agent management
  available: `${API_BASE_URL}/api/v1/agents/available`,
  deployed: `${API_BASE_URL}/api/v1/agents/deployed`,
  add: `${API_BASE_URL}/api/v1/agents/add`,
  remove: (id: number) => `${API_BASE_URL}/api/v1/agents/remove/${id}`,
  details: (id: number) => `${API_BASE_URL}/api/v1/agents/details/${id}`,
  createCustom: `${API_BASE_URL}/api/v1/agents/create`,
  analytics: (id: number) => `${API_BASE_URL}/api/v1/agents/${id}/analytics`,
  recommendations: (id: number) => `${API_BASE_URL}/api/v1/agents/${id}/recommendations`,
  chat: (id: number) => `${API_BASE_URL}/api/v1/agents/${id}/chat`,
};

// Risk Management endpoints
export const RISK_ENDPOINTS = {
  riskAssessment: `${API_BASE_URL}/api/v1/risk/assessment`,
  riskMetrics: `${API_BASE_URL}/api/v1/risk/metrics`,
  riskPredictions: `${API_BASE_URL}/api/v1/risk/predictions`,
  supplyChainRisks: `${API_BASE_URL}/api/v1/risk/supply-chain`,
};

// API request configuration with retry logic
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    // Add authentication header function
    getAuthHeader: () => {
      const token = localStorage.getItem('auth-token');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
  },
  timeouts: {
    default: 15000, // 15 seconds
    long: 30000,    // 30 seconds for operations that might take longer
  },
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second initial delay, will increase exponentially
    statusCodesToRetry: [408, 429, 500, 502, 503, 504]
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
