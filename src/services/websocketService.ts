
/**
 * WebSocket Service
 * This service manages WebSocket connections for real-time communication.
 */

// Since this is a frontend-only demo, we'll simulate WebSocket responses
// In a real application, you would connect to a real WebSocket server

type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectHandlers: Set<ConnectionHandler> = new Set();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 3000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectionAttempted: boolean = false;
  private connectionId: string = `conn-${Date.now()}`; // Unique connection ID
  
  // Base URL for the WebSocket connection - would be replaced with your actual WebSocket server URL
  private baseUrl: string = 'wss://your-websocket-server.com';

  // Connect to WebSocket server
  connect(): void {
    // Don't attempt to connect if already connected or connecting
    if (this.isConnected || this.connectionAttempted) {
      console.log('WebSocket already connected or connecting. Skipping connection attempt.');
      return;
    }
    
    this.connectionAttempted = true;
    
    try {
      // In a real app, this would connect to your actual WebSocket server
      // this.socket = new WebSocket(this.baseUrl);
      
      // For demo purposes, we'll simulate a successful connection (once)
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Notify connect handlers
      this.connectHandlers.forEach(handler => handler());
      
      console.log(`WebSocket connected (ID: ${this.connectionId})`);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }
  
  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.connectionAttempted = false;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    console.log(`WebSocket disconnected (ID: ${this.connectionId})`);
  }
  
  // Attempt to reconnect to WebSocket server
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connectionAttempted = false; // Reset so we can try again
      this.connect();
    }, this.reconnectTimeout);
  }
  
  // Send a message via WebSocket
  sendMessage(channel: string, data: any): void {
    if (!this.isConnected) {
      console.error('Cannot send message: WebSocket is not connected');
      return;
    }
    
    // In a real app, this would send the message through the WebSocket
    // this.socket.send(JSON.stringify({ channel, data }));
    
    // For demo purposes, we'll simulate a response after a short delay
    setTimeout(() => {
      this.simulateResponse(channel, data);
    }, 1000);
    
    console.log(`Message sent to channel ${channel}:`, data);
  }
  
  // Subscribe to messages on a specific channel
  onMessage(channel: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(channel)) {
      this.messageHandlers.set(channel, new Set());
    }
    
    this.messageHandlers.get(channel)!.add(handler);
    
    return () => {
      const handlers = this.messageHandlers.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(channel);
        }
      }
    };
  }
  
  // Subscribe to connection events
  onConnect(handler: ConnectionHandler): () => void {
    this.connectHandlers.add(handler);
    
    // If already connected, trigger the handler immediately
    if (this.isConnected) {
      handler();
    }
    
    return () => {
      this.connectHandlers.delete(handler);
    };
  }
  
  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
  
  // Simulate response based on the message (for demo purposes only)
  private simulateResponse(channel: string, data: any): void {
    let responseText = '';
    let tableData = undefined;
    let summary = undefined;
    let nextQuestions = [];
    
    // Generate contextual responses based on the channel and data
    if (channel.startsWith('chat-agent-')) {
      // Agent-specific responses
      const agentId = channel.split('-agent-')[1];
      responseText = `As Agent #${agentId}, I've analyzed your request about "${data.text}". Based on my specialized knowledge, I recommend optimizing your steel production parameters for better efficiency.`;
      nextQuestions = [
        "What production parameters are you currently using?",
        "What are your main efficiency concerns?",
        "Would you like to see alternative production scenarios?"
      ];
    } else if (channel.startsWith('chat-')) {
      // Extract module from channel name
      const module = channel.split('chat-')[1];
      
      // Get module-specific mock data
      if (module && module in MODULE_TABLES) {
        tableData = MODULE_TABLES[module];
        summary = MODULE_SUMMARIES[module];
        nextQuestions = MODULE_NEXT_QUESTIONS[module] || DEFAULT_NEXT_QUESTIONS;
        responseText = `${tableData}\n\n${summary}`;
      } else {
        // Generic module response
        const formattedModule = module
          ? module.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          : 'the module';
          
        responseText = `Based on ${formattedModule} analysis, I can provide these insights about "${data.text}": Your current metrics are trending positively, but there's potential for further optimization in the supply chain.`;
        nextQuestions = DEFAULT_NEXT_QUESTIONS;
      }
    } else {
      // Global chat responses
      responseText = `I've analyzed your question about "${data.text}". Based on the current data from the steel ecosystem, I can suggest several approaches to improve efficiency and reduce costs in your operations.`;
      nextQuestions = DEFAULT_NEXT_QUESTIONS;
    }
    
    // Broadcast the simulated response to all handlers subscribed to this channel
    const handlers = this.messageHandlers.get(channel);
    if (handlers) {
      const response = {
        id: `response-${Date.now()}`,
        text: responseText,
        isUser: false,
        timestamp: new Date().toISOString(),
        table_data: tableData,
        summary: summary,
        next_question: nextQuestions,
        sessionId: data.sessionId
      };
      
      handlers.forEach(handler => handler(response));
    }
  }
}

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

  'factory-planning': `| Production Line | Current Output (tons/day) | Target Output (tons/day) | Efficiency (%) | Downtime (hrs/week) |
|-----------------|--------------------------|------------------------|----------------|---------------------|
| Line Alpha      | 750                      | 800                    | 93.8%          | 4.2                 |
| Line Beta       | 620                      | 700                    | 88.6%          | 7.8                 |
| Line Gamma      | 840                      | 850                    | 98.8%          | 1.5                 |
| Line Delta      | 580                      | 650                    | 89.2%          | 6.3                 |`,

  'enterprise-supply-planning': `| Factory | Material Type | Current Stock (tons) | Min Stock (tons) | On Order (tons) | Lead Time (days) |
|---------|--------------|---------------------|-----------------|-----------------|-----------------|
| Plant A | HRC          | 1,280               | 850             | 2,000           | 14              |
| Plant B | CRC          | 950                 | 800             | 1,500           | 21              |
| Plant C | HDG          | 720                 | 600             | 1,200           | 18              |
| Plant D | EG           | 550                 | 450             | 800             | 16              |`
};

// Mock summaries for different modules
const MODULE_SUMMARIES = {
  'demand-planning': "Based on the demand forecasting data, we're seeing generally accurate predictions with minor variances. February showed the most significant positive variance at +1.9%, suggesting our model might be slightly underestimating demand during this period. Overall, our forecasting accuracy is strong with an average variance of just 2.6% across the period.",
  
  'supply-planning': "The supply chain analysis shows SupplierC has the highest reliability score at 95%, though with the longest lead time of 30 days. For time-sensitive materials, SupplierA offers a good balance of reliability (92%) and shorter lead time (14 days). SupplierB has the lowest reliability score at 88% and should be monitored closely.",
  
  'order-promising': "Order promising analysis indicates we can fulfill all current orders with high confidence levels. The order for Acme Inc has the highest confidence rating at 95%, with a delivery promise just 2 days after the requested date. Delta Ltd's order has the lowest confidence at 85% and may require additional monitoring to ensure on-time delivery.",
  
  'factory-planning': "Factory planning analysis shows Line Gamma is your highest performing production line at 98.8% efficiency with minimal downtime of just 1.5 hours per week. Line Alpha is operating well at 93.8% efficiency but is still below target output. Lines Beta and Delta show the most opportunity for improvement, with efficiency ratings below 90% and significant downtime hours that should be addressed.",

  'enterprise-supply-planning': "Enterprise supply planning analysis shows varying stock levels across plants. Plant A has the highest current stock at 1,280 tons with 2,000 tons on order. Plant D has the lowest stock at 550 tons, but is still above minimum requirements. Lead times vary from 14-21 days, with Plant B having the longest lead time for CRC materials. All plants are maintaining appropriate safety stock levels."
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
  ],
  'factory-planning': [
    "What maintenance should we prioritize for Line Beta?",
    "How can we optimize Line Alpha to reach target output?",
    "What's causing the higher downtime on Line Beta?"
  ],
  'enterprise-supply-planning': [
    "How can we optimize inventory levels at Plant A?",
    "Should we increase the minimum stock for Plant C?",
    "What strategies can reduce lead times for Plant B?"
  ]
};

// Default next questions for general chats
const DEFAULT_NEXT_QUESTIONS = [
  "Show me our production performance this quarter",
  "What are our main supply chain risks?",
  "How efficient is our inventory management?"
];

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
