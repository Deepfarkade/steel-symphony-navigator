
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
  
  // Base URL for the WebSocket connection - would be replaced with your actual WebSocket server URL
  private baseUrl: string = 'wss://your-websocket-server.com';

  // Connect to WebSocket server
  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    
    try {
      // In a real app, this would connect to your actual WebSocket server
      // this.socket = new WebSocket(this.baseUrl);
      
      // For demo purposes, we'll simulate a successful connection
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Notify connect handlers
      this.connectHandlers.forEach(handler => handler());
      
      console.log('WebSocket connected');
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
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    console.log('WebSocket disconnected');
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
    
    // Generate contextual responses based on the channel and data
    if (channel.startsWith('chat-agent-')) {
      // Agent-specific responses
      const agentId = channel.split('-agent-')[1];
      responseText = `As Agent #${agentId}, I've analyzed your request about "${data.text}". Based on my specialized knowledge, I recommend optimizing your steel production parameters for better efficiency.`;
    } else if (channel.startsWith('chat-')) {
      // Module-specific responses
      const module = channel.split('chat-')[1];
      const formattedModule = module
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      responseText = `Based on the ${formattedModule} module analysis, I can provide these insights about "${data.text}": Your current metrics are trending positively, but there's potential for further optimization in the supply chain.`;
    } else {
      // Global chat responses
      responseText = `I've analyzed your question about "${data.text}". Based on the current data from the steel ecosystem, I can suggest several approaches to improve efficiency and reduce costs in your operations.`;
    }
    
    // Broadcast the simulated response to all handlers subscribed to this channel
    const handlers = this.messageHandlers.get(channel);
    if (handlers) {
      const response = {
        text: responseText,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      handlers.forEach(handler => handler(response));
    }
  }
}

const websocketService = new WebSocketService();

export default websocketService;
