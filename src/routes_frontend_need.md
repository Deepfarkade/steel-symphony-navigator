
# Frontend API Routes Requirements

This document outlines all the API routes that the frontend is expecting from the backend. It's organized by functionality to help with backend development planning and implementation.

## Authentication Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/auth/login` | POST | User login authentication | Login.tsx, AuthContext.tsx |
| `/api/v1/auth/signup` | POST | User registration | Signup.tsx, AuthContext.tsx |
| `/api/v1/auth/sso` | GET/POST | Single sign-on callback processing | SSOCallback.tsx |
| `/api/v1/auth/validate` | GET | Validate authentication token | AuthContext.tsx |
| `/api/v1/auth/logout` | POST | User logout | AuthContext.tsx, Navigation.tsx |

## User Management Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/user/preferences` | GET/PUT | Fetch and update user preferences | UserPreferences.tsx |
| `/api/v1/user/notifications` | GET | Fetch user notifications | NotificationsCenter.tsx |

## Data Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/data/kpis` | GET | Fetch main dashboard KPIs | Index.tsx, KpiOverview.tsx |
| `/api/v1/data/kpis/:id` | GET | Fetch details of a specific KPI | KpiDetails.tsx |
| `/api/v1/data/production` | GET | Fetch production data | ProductionChart.tsx, ProductionChartDetails.tsx |
| `/api/v1/data/energy` | GET | Fetch energy usage data | EnergyConsumptionChart.tsx, EnergyChartDetails.tsx |
| `/api/v1/data/copilot` | GET | Fetch AI co-pilot analytics | AiInsights.tsx, WelcomeSection.tsx |

## Module Insight Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/modules/:module/insights` | GET | Fetch insights for specific modules | useModuleInsights.tsx, ModuleInsightsPanel.tsx |
| `/api/v1/modules/demand-planning/insights` | GET | Demand planning insights | DemandPlanning.tsx |
| `/api/v1/modules/supply-planning/insights` | GET | Supply planning insights | SupplyPlanning.tsx |
| `/api/v1/modules/order-promising/insights` | GET | Order promising insights | OrderPromising.tsx |
| `/api/v1/modules/factory-planning/insights` | GET | Factory planning insights | FactoryPlanning.tsx |
| `/api/v1/modules/inventory-optimization/insights` | GET | Inventory optimization insights | InventoryOptimization.tsx |
| `/api/v1/modules/inventory-liquidation/insights` | GET | Inventory liquidation insights | InventoryLiquidation.tsx |
| `/api/v1/modules/logistics/insights` | GET | Logistics insights | LogisticsManagement.tsx |
| `/api/v1/modules/risk-management/insights` | GET | Risk management insights | RiskManagement.tsx |
| `/api/v1/modules/analytics/insights` | GET | Analytics insights | Analytics.tsx |

## Chat and AI Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/chat/global` | GET/POST | Global AI chat operations | GlobalChatPage.tsx, AiChatInterface.tsx |
| `/api/v1/chat/:module` | GET/POST | Module-specific chat operations | ModuleChatPage.tsx, chatApiService.ts |
| `/api/v1/chat/sessions` | GET/POST | Retrieve or create chat sessions | chatApiService.ts |
| `/api/v1/chat/sessions/:sessionId` | GET | Get specific chat session | chatApiService.ts |
| `/api/v1/chat/:sessionId/send` | POST | Send message to chat session | chatApiService.ts |
| `/api/v1/chat/history/:userId` | GET | Get chat history for a user | chatApiService.ts |
| `/api/v1/chat/analytics` | GET | Get chat analytics data | chatApiService.ts |
| `/api/v1/chat/module/:moduleContext` | GET | Get module-specific chat sessions | chatApiService.ts |

## AI Agents Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/agents/available` | GET | List available AI agents | AgentsPage.tsx, MarketplaceAgentsList.tsx |
| `/api/v1/agents/deployed` | GET | List deployed AI agents | useAgents.tsx, AiAgentsDeployment.tsx |
| `/api/v1/agents/add` | POST | Add an agent to deployed list | AgentsPage.tsx |
| `/api/v1/agents/remove/:id` | DELETE | Remove a deployed agent | AgentsPage.tsx |
| `/api/v1/agents/details/:id` | GET | Get details of a specific agent | AgentChatPage.tsx |
| `/api/v1/agents/create` | POST | Create a custom agent | CreateAgentPage.tsx |
| `/api/v1/agents/:id/analytics` | GET | Get analytics for an agent | AgentChatPage.tsx |
| `/api/v1/agents/:id/recommendations` | GET | Get agent recommendations | AgentChatPage.tsx |
| `/api/v1/agents/:id/chat` | GET/POST | Chat operations with specific agent | AgentChatPage.tsx, chatApiService.ts |

## Risk Management Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/risk/assessment` | GET | Get risk assessment data | RiskManagement.tsx |
| `/api/v1/risk/metrics` | GET | Get risk metrics | RiskManagement.tsx |
| `/api/v1/risk/predictions` | GET | Get risk predictions | RiskManagement.tsx |
| `/api/v1/risk/supply-chain` | GET | Get supply chain risk data | RiskManagement.tsx |

## Content Routes

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/api/v1/content/news` | GET | Get industry news data | NewsPage.tsx, LatestIndustryNews.tsx |

## Module-Specific Service Routes

### Demand Planning Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/demand-planning/forecast` | GET | Get demand forecasts | DemandPlanning.tsx |
| `/services/demand-planning/scenarios` | GET | Get demand scenarios | DemandPlanning.tsx |
| `/services/demand-planning/recommendations` | GET | Get demand recommendations | DemandPlanning.tsx |
| `/services/demand-planning/chat` | GET/POST | Chat with demand planning assistant | ModuleChatPage.tsx |

### Supply Planning Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/supply-planning/network` | GET | Get supply network data | SupplyPlanning.tsx |
| `/services/supply-planning/optimization` | GET | Get supply optimization data | SupplyPlanning.tsx |
| `/services/supply-planning/constraints` | GET | Get supply constraints | SupplyPlanning.tsx |
| `/services/supply-planning/chat` | GET/POST | Chat with supply planning assistant | ModuleChatPage.tsx |

### Order Promising Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/order-promising/availability` | GET | Get order availability data | OrderPromising.tsx |
| `/services/order-promising/delivery-dates` | GET | Get delivery date estimates | OrderPromising.tsx |
| `/services/order-promising/chat` | GET/POST | Chat with order promising assistant | ModuleChatPage.tsx |

### Factory Planning Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/factory-planning/schedule` | GET | Get factory schedules | FactoryPlanning.tsx |
| `/services/factory-planning/resources` | GET | Get factory resources | FactoryPlanning.tsx |
| `/services/factory-planning/chat` | GET/POST | Chat with factory planning assistant | ModuleChatPage.tsx |

### Inventory Optimization Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/inventory-optimization/levels` | GET | Get optimal inventory levels | InventoryOptimization.tsx |
| `/services/inventory-optimization/policies` | GET | Get inventory policies | InventoryOptimization.tsx |
| `/services/inventory-optimization/chat` | GET/POST | Chat with inventory optimization assistant | ModuleChatPage.tsx |

### Inventory Liquidation Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/inventory-liquidation/pricing` | GET | Get liquidation pricing data | InventoryLiquidation.tsx |
| `/services/inventory-liquidation/recommendations` | GET | Get liquidation recommendations | InventoryLiquidation.tsx |
| `/services/inventory-liquidation/chat` | GET/POST | Chat with inventory liquidation assistant | ModuleChatPage.tsx |

### Logistics Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/logistics/routing` | GET | Get logistics routing data | LogisticsManagement.tsx |
| `/services/logistics/carriers` | GET | Get carrier information | LogisticsManagement.tsx |
| `/services/logistics/tracking` | GET | Get shipment tracking data | LogisticsManagement.tsx |
| `/services/logistics/chat` | GET/POST | Chat with logistics assistant | ModuleChatPage.tsx |

### Risk Management Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/risk-management/assessment` | GET | Get detailed risk assessments | RiskManagement.tsx |
| `/services/risk-management/mitigation` | GET | Get risk mitigation strategies | RiskManagement.tsx |
| `/services/risk-management/alerts` | GET | Get risk alerts | RiskManagement.tsx |
| `/services/risk-management/chat` | GET/POST | Chat with risk management assistant | ModuleChatPage.tsx |

### Analytics Service

| Route | Method | Purpose | Used In |
|-------|--------|---------|---------|
| `/services/analytics/reports` | GET | Get analytics reports | Analytics.tsx |
| `/services/analytics/dashboards` | GET | Get analytics dashboards | Analytics.tsx |
| `/services/analytics/chat` | GET/POST | Chat with analytics assistant | ModuleChatPage.tsx |

## API Response Structure

Most API responses follow these standard structures:

### For Collection Endpoints
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 10
  }
}
```

### For Single Resource Endpoints
```json
{
  "data": {...},
  "meta": {
    "timestamp": "2023-08-01T12:00:00Z"
  }
}
```

### For Error Responses
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {...}
  }
}
```

## Authentication Requirements

Most API endpoints require authentication via an Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained from the login or SSO endpoints and should be included in all authenticated requests.

## API Versioning

All endpoints are prefixed with `/api/v1/` to allow for future API versioning.

## Notes for Implementation

1. The frontend expects rate limiting headers to be included in API responses
2. WebSocket connections are used for real-time chat features
3. Streaming responses are supported for AI-generated content
4. CORS should be properly configured to allow requests from the frontend domain
