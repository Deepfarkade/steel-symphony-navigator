
# Frontend Routes Reference

This document provides a reference of all frontend routes in the application to assist with backend integration.

## Authentication Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `/login` | Login.tsx | User login | `/auth/login` |
| `/signup` | Signup.tsx | User registration | `/auth/signup` |
| `/auth/callback` | SSOCallback.tsx | SSO callback handling | `/auth/sso` |

## Main Module Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `/` | Index.tsx | Dashboard | `/data/kpis`, `/data/copilot` |
| `/demand-planning` | DemandPlanning.tsx | Demand planning module | `/modules/demand-planning/insights` |
| `/supply-planning` | SupplyPlanning.tsx | Supply planning module | `/modules/supply-planning/insights` |
| `/order-promising` | OrderPromising.tsx | Order promising module | `/modules/order-promising/insights` |
| `/factory-planning` | FactoryPlanning.tsx | Factory planning module | `/modules/factory-planning/insights` |
| `/inventory-optimization` | InventoryOptimization.tsx | Inventory optimization module | `/modules/inventory-optimization/insights` |
| `/inventory-liquidation` | InventoryLiquidation.tsx | Inventory liquidation module | `/modules/inventory-liquidation/insights` |
| `/logistics` | LogisticsManagement.tsx | Logistics management module | `/modules/logistics/insights` |
| `/risk-management` | RiskManagement.tsx | Risk management module | `/risk/assessment`, `/modules/risk-management/insights` |
| `/analytics` | Analytics.tsx | Analytics dashboard | `/data/analytics` |

## Detail Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `/kpi/:id` | KpiDetails.tsx | KPI detail view | `/data/kpis/:id` |
| `/charts/production` | ProductionChartDetails.tsx | Production charts | `/data/production/details` |
| `/charts/energy` | EnergyChartDetails.tsx | Energy usage charts | `/data/energy/details` |

## User Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `/user/preferences` | UserPreferences.tsx | User settings | `/user/preferences` |
| `/notifications` | NotificationsCenter.tsx | User notifications | `/user/notifications` |

## AI and Chat Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `/chat` | GlobalChatPage.tsx | Global AI chat | `/chat/global` |
| `/chat/:module` | ModuleChatPage.tsx | Module-specific chat | `/chat/:module` |
| `/agents` | AgentsPage.tsx | AI agents marketplace | `/agents/available` |
| `/agent/:agentId` | AgentChatPage.tsx | Chat with specific agent | `/agents/details/:id`, `/agents/:id/chat` |
| `/create-agent` | CreateAgentPage.tsx | Create custom agent | `/agents/create` |

## Content Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `/news` | NewsPage.tsx | Industry news | `/content/news` |

## Error Routes

| Route | Component | Purpose | Backend Endpoints Used |
|-------|-----------|---------|------------------------|
| `*` | NotFound.tsx | 404 page | None |

## Connecting Your Backend

To connect your backend API to these routes:

1. Update the API endpoints in `src/services/apiConfig.ts`
2. Ensure your backend routes match the expected paths
3. Implement the appropriate authentication mechanisms
4. Test each route to confirm data is flowing correctly

For detailed implementation instructions, see the `BACKEND_CONNECTION.md` file.
