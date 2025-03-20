
# Connecting Your Backend to the EY SECP Frontend

This document provides instructions on how to connect your backend API to the Steel Supply Chain Planning (SECP) Frontend application.

## API Configuration

All API endpoints are centralized in the `src/services/apiConfig.ts` file. This is the **single file** you need to modify to connect your backend.

### Steps to Connect Your Backend

1. Update the base URL in `apiConfig.ts`:
   ```typescript
   export const API_BASE_URL = "https://your-backend-api.com"; // Replace with your actual backend URL
   ```

2. Review all endpoints in the `AUTH_ENDPOINTS`, `DATA_ENDPOINTS`, `AGENTS_ENDPOINTS`, and `RISK_ENDPOINTS` objects and ensure they match your backend API routes.

3. In the `dataService.ts` file, uncomment the axios implementation code and remove the mock data where appropriate.
   
   For example, replace:
   ```typescript
   export const getKpis = async () => {
     await apiDelay();
     return [ /* mock data */ ];
   };
   ```
   
   With:
   ```typescript
   export const getKpis = async () => {
     return axios.get(DATA_ENDPOINTS.kpis, {
       headers: {
         ...API_CONFIG.headers,
         ...API_CONFIG.headers.getAuthHeader()
       },
       timeout: API_CONFIG.timeouts.default
     }).then(response => response.data);
   };
   ```

4. Update the authentication token handling in `API_CONFIG.getAuthHeader()` if your backend uses a different authentication method.

## Key API Routes and Their Usage

| Module | API Endpoint | Used In | Purpose |
|--------|--------------|---------|---------|
| Authentication | `/auth/login` | Login.tsx | User authentication |
| Authentication | `/auth/signup` | Signup.tsx | User registration |
| Authentication | `/auth/sso` | SSOCallback.tsx | SSO authentication |
| Dashboard | `/data/kpis` | Index.tsx | Main dashboard KPIs |
| Risk Management | `/risk/assessment` | RiskManagement.tsx | Risk analysis data |
| Agents | `/agents/deployed` | useAgents.tsx | User's active AI agents |
| Agents | `/agents/available` | AgentsPage.tsx | Available agents in marketplace |
| Chat | `/chat/:module` | ModuleChatPage.tsx | Module-specific chat |
| News | `/content/news` | NewsPage.tsx | Industry news and updates |

## Error Handling

The application includes a centralized error handling mechanism in the axios interceptors (defined in `App.tsx`). This handles retry logic and connection issues.

## Testing Your Connection

1. Update the `API_BASE_URL` in `apiConfig.ts`
2. Uncomment the axios implementation for one endpoint (e.g., `getKpis()`)
3. Test the application to ensure data is being fetched from your backend
4. Gradually replace other mock data implementations with real API calls

## Authentication Flow

The authentication flow works as follows:

1. User logs in via `/auth/login` or signs up via `/auth/signup`
2. On successful authentication, the backend returns a token
3. The token is stored in localStorage
4. The token is included in the `Authorization` header for subsequent API requests
5. Token validation happens in the `AuthContext` component

## Need Help?

If you encounter any issues connecting your backend:

1. Check browser console for error messages
2. Verify your backend API is running and accessible
3. Ensure CORS is properly configured on your backend
4. Confirm API routes match the ones defined in `apiConfig.ts`
