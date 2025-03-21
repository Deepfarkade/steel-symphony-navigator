
/**
 * Mock Chat Service
 * This service provides mock responses for the chat functionality when the backend is not available
 */

import { v4 as uuidv4 } from 'uuid';

// Mock table data for different modules
const MODULE_TABLES = {
  'demand-planning': `| Month | Forecasted Demand (tons) | Actual Demand (tons) | Variance (%) |
|-------|-------------------------|---------------------|-------------|
| Jan   | 12,500                  | 11,980              | -4.2%       |
| Feb   | 13,200                  | 13,450              | +1.9%       |
| Mar   | 14,800                  | 14,620              | -1.2%       |
| Apr   | 15,300                  | 15,780              | +3.1%       |`,

  'supply-planning': `| Supplier | Material | Lead Time (days) | Reliability Score | Cost ($/ton) |
|----------|----------|-----------------|------------------|-------------|
| SupplierA| HRC      | 14              | 92%              | 780         |
| SupplierB| CRC      | 21              | 88%              | 920         |
| SupplierC| HDG      | 30              | 95%              | 1,050       |
| SupplierD| EG       | 18              | 91%              | 1,120       |`,

  'order-promising': `| Order ID | Customer | Product | Quantity (tons) | Requested Date | Promised Date | Confidence |
|----------|----------|---------|----------------|---------------|--------------|------------|
| ORD-7845 | Acme Inc | HRC     | 350            | 2025-04-15    | 2025-04-17   | 95%        |
| ORD-7846 | Beta Co  | CRC     | 120            | 2025-04-20    | 2025-04-22   | 90%        |
| ORD-7850 | Delta Ltd| HDG     | 220            | 2025-04-12    | 2025-04-14   | 85%        |`,

  'factory-planning': `| Production Line | Capacity (tons/day) | Utilization | Maintenance | Efficiency |
|-----------------|-------------------|-------------|-------------|------------|
| Line A          | 450               | 92%         | Apr 10-12   | 88%        |
| Line B          | 380               | 87%         | Apr 18-20   | 91%        |
| Line C          | 520               | 95%         | May 5-8     | 85%        |
| Line D          | 320               | 78%         | None        | 93%        |`,

  'inventory-optimization': `| Warehouse | Current Stock (tons) | Safety Stock | Days of Supply | Turnover Rate |
|-----------|---------------------|--------------|----------------|--------------|
| North     | 3,450               | 1,200        | 15             | 8.5          |
| South     | 2,890               | 1,000        | 12             | 9.2          |
| East      | 4,120               | 1,500        | 18             | 7.8          |
| West      | 2,150               | 800          | 10             | 11.3         |`,

  'logistics': `| Route      | Distance (km) | Transit Time (days) | Cost ($/ton) | CO2 (kg/ton) |
|------------|--------------|---------------------|-------------|-------------|
| Plant-PortA | 450          | 2                   | 35          | 28          |
| Plant-PortB | 680          | 3                   | 48          | 42          |
| Plant-CustA | 320          | 1.5                 | 25          | 22          |
| Plant-CustB | 520          | 2.5                 | 39          | 36          |`,

  'risk-management': `| Risk Category | Probability | Impact | Risk Score | Mitigation Strategy |
|---------------|------------|--------|------------|---------------------|
| Supply Chain  | Medium     | High   | 16         | Multiple suppliers  |
| Production    | Low        | High   | 12         | Preventive maintenance |
| Logistics     | Medium     | Medium | 9          | Alternative routes  |
| Market        | High       | Medium | 15         | Forward contracts   |`,

  'analytics': `| KPI              | Current | Target | Trend      | YoY Change |
|------------------|---------|--------|------------|------------|
| Production Cost  | $682/t  | $650/t | Decreasing | -3.5%      |
| Quality Rate     | 97.2%   | 98.5%  | Stable     | +0.8%      |
| On-time Delivery | 88.5%   | 95.0%  | Improving  | +4.2%      |
| Energy Use       | 450kWh/t| 420kWh/t| Decreasing | -5.1%      |`,
};

// Mock summaries for different modules
const MODULE_SUMMARIES = {
  'demand-planning': "Based on the demand forecasting data, we're seeing generally accurate predictions with minor variances. February showed the most significant positive variance at +1.9%, suggesting our model might be slightly underestimating demand during this period. Overall, our forecasting accuracy is strong with an average variance of just 2.6% across the period.",
  
  'supply-planning': "The supply chain analysis shows SupplierC has the highest reliability score at 95%, though with the longest lead time of 30 days. For time-sensitive materials, SupplierA offers a good balance of reliability (92%) and shorter lead time (14 days). SupplierB has the lowest reliability score at 88% and should be monitored closely.",
  
  'order-promising': "Order promising analysis indicates we can fulfill all current orders with high confidence levels. The order for Acme Inc has the highest confidence rating at 95%, with a delivery promise just 2 days after the requested date. Delta Ltd's order has the lowest confidence at 85% and may require additional monitoring to ensure on-time delivery.",
  
  'factory-planning': "Factory production capacity is currently well-utilized, with Line C showing the highest utilization at 95%. Line D has significant available capacity at only 78% utilization and could handle additional production requirements. Scheduled maintenance activities for Lines A, B, and C need to be factored into production planning for April and May.",
  
  'inventory-optimization': "Inventory levels across all warehouses are currently sufficient, with the East warehouse having the highest days of supply at 18 days. The West warehouse has the highest turnover rate at 11.3, indicating efficient inventory management. Consider reducing safety stock levels at the East warehouse to improve capital efficiency while maintaining service levels.",
  
  'logistics': "Logistics analysis shows Plant-CustA as the most cost-effective and environmentally friendly route at $25/ton and 22kg CO2/ton. The Plant-PortB route has the highest cost and emissions, suggesting potential for optimization. Consider consolidating shipments to PortB to improve efficiency or evaluating alternative transportation methods.",
  
  'risk-management': "Risk assessment indicates Supply Chain risks present the highest risk score at 16, followed closely by Market risks at 15. While Production risks have a high impact, their low probability reduces the overall risk score to 12. The current mitigation strategies are appropriate, but we should consider enhancing our approach to Supply Chain risks through additional supplier diversification.",
  
  'analytics': "Performance analytics show positive trends across all key metrics. Production costs are decreasing (-3.5% YoY) and approaching the target of $650/ton. On-time delivery has shown the most significant improvement at +4.2% YoY but remains below the target of 95.0%. Energy usage is decreasing faster than other metrics, reflecting successful efficiency initiatives."
};

// Mock next questions for different modules
const MODULE_NEXT_QUESTIONS = {
  'demand-planning': [
    "How can we improve our February forecast accuracy?",
    "What factors are driving the April demand increase?",
    "Should we adjust our production plan for upcoming months?"
  ],
  'supply-planning': [
    "What alternatives do we have to SupplierB?",
    "How can we reduce lead times from SupplierC?",
    "Should we consider dual-sourcing for critical materials?"
  ],
  'order-promising': [
    "What's our contingency plan for Delta Ltd's order?",
    "Can we improve our delivery timeline for Acme Inc?",
    "What's our current capacity for additional orders this month?"
  ]
};

// Default response for general or agent-based chats
const DEFAULT_RESPONSE = "I've analyzed your question and can provide insights based on the available data. To get more specific information, consider exploring one of our specialized modules such as Demand Planning, Supply Planning, or Risk Management. Each module offers targeted analysis and recommendations for different aspects of your steel operations.";

// Default next questions for general chats
const DEFAULT_NEXT_QUESTIONS = [
  "Show me our production performance this quarter",
  "What are our main supply chain risks?",
  "How efficient is our inventory management?"
];

// Generate a session ID
export const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Simulate streaming response with word-by-word parsing
export const getMockStreamingResponse = (moduleContext?: string, query?: string): Promise<any> => {
  // Get the appropriate response based on module context
  let response: any = {
    text: DEFAULT_RESPONSE,
    summary: DEFAULT_RESPONSE,
    next_question: DEFAULT_NEXT_QUESTIONS
  };
  
  if (moduleContext && MODULE_SUMMARIES[moduleContext]) {
    // If this is a module-specific chat, include a table and summary
    const tableData = MODULE_TABLES[moduleContext] || '';
    const summaryData = MODULE_SUMMARIES[moduleContext] || '';
    const nextQuestions = MODULE_NEXT_QUESTIONS[moduleContext] || DEFAULT_NEXT_QUESTIONS;
    
    // Set response with table and summary
    response = {
      text: `${tableData}\n\n${summaryData}`,
      table_data: tableData,
      summary: summaryData,
      next_question: nextQuestions
    };
  }
  
  return new Promise((resolve) => {
    // We're mocking the streaming response here
    // In a real implementation, we would send chunks of data
    // But for mock purposes, we just return the full response
    setTimeout(() => {
      resolve(response);
    }, 1000); // Simulate network delay
  });
};

// Mock function to get chat sessions
export const getMockChatSessions = () => {
  const mockSessionId = generateSessionId();
  
  return [{
    session_id: mockSessionId,
    id: mockSessionId,
    title: "New Conversation",
    messages: [
      {
        id: uuidv4(),
        text: "Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel operations today?",
        isUser: false,
        timestamp: new Date()
      }
    ],
    module: null,
    agent_id: null,
    created_at: new Date(),
    updated_at: new Date()
  }];
};

// Mock function to get or create a chat session
export const getMockChatSession = (moduleContext?: string, agentId?: number) => {
  const mockSessionId = generateSessionId();
  
  let welcomeMessage = "Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel operations today?";
  
  if (moduleContext) {
    const formattedModule = moduleContext.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    welcomeMessage = `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with ${formattedModule} today?`;
  }
  
  if (agentId) {
    welcomeMessage = `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`;
  }
  
  return {
    session_id: mockSessionId,
    id: mockSessionId,
    title: moduleContext ? `${moduleContext.replace(/-/g, ' ')} chat` : "General Chat",
    messages: [
      {
        id: uuidv4(),
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date()
      }
    ],
    module: moduleContext,
    agent_id: agentId,
    created_at: new Date(),
    updated_at: new Date()
  };
};

// Add more mock functions as needed for testing other chat functionality
export const sendMockMessage = async (text: string, moduleContext?: string, agentId?: number) => {
  // Generate a mock response
  const mockResponseData = await getMockStreamingResponse(moduleContext, text);
  
  return {
    id: uuidv4(),
    text: mockResponseData.text,
    isUser: false,
    timestamp: new Date(),
    table_data: mockResponseData.table_data,
    summary: mockResponseData.summary,
    next_question: mockResponseData.next_question
  };
};

// Mock function to create a new session
export const createMockSession = (userId: string, moduleContext?: string, agentId?: number) => {
  const sessionId = generateSessionId();
  const formattedModule = moduleContext ? moduleContext.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : "General";
  const title = agentId ? `Chat with Agent #${agentId}` : `${formattedModule} Chat`;
  
  return {
    id: sessionId,
    session_id: sessionId,
    title,
    last_message: null,
    timestamp: new Date(),
    user_id: userId,
    messages: [],
    module: moduleContext,
    agent_id: agentId
  };
};

// Convert backend message format to frontend format
export const convertMessageFormat = (backendMessage: any) => {
  return {
    id: backendMessage.id || uuidv4(),
    role: backendMessage.sender === 'user' ? 'user' : 'assistant',
    content: backendMessage.text,
    timestamp: new Date(backendMessage.timestamp),
    table_data: backendMessage.table_data,
    summary: backendMessage.summary,
    next_question: backendMessage.next_question || []
  };
};
