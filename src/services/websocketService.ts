
/**
 * WebSocket Service
 * Handles real-time communication with the backend
 */

type MessageCallback = (payload: any) => void;
type ConnectionCallback = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: Map<string, MessageCallback[]> = new Map();
  private connectCallbacks: ConnectionCallback[] = [];
  private disconnectCallbacks: ConnectionCallback[] = [];
  private isMockMode: boolean = true;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  // Connect to WebSocket server
  connect(): void {
    // Check if already connected
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.info('WebSocket already connected');
      return;
    }
    
    try {
      // Try to connect to real backend
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.hostname}:8000`;
      
      this.socket = new WebSocket(`${wsHost}/ws`);
      
      this.socket.onopen = () => {
        console.info('WebSocket connected');
        this.isMockMode = false;
        this.reconnectAttempts = 0;
        this.connectCallbacks.forEach(callback => callback());
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { channel, payload } = data;
          
          if (this.messageCallbacks.has(channel)) {
            this.messageCallbacks.get(channel)?.forEach(callback => callback(payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.info('WebSocket disconnected');
        this.disconnectCallbacks.forEach(callback => callback());
        
        // Try to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
        } else {
          console.info('Max reconnect attempts reached, switching to mock mode');
          this.isMockMode = true;
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isMockMode = true;
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isMockMode = true;
      
      // Notify connection callbacks anyway to avoid blocking UI
      this.connectCallbacks.forEach(callback => callback());
    }
  }
  
  // Register callback for specific channel messages
  onMessage(channel: string, callback: MessageCallback): () => void {
    if (!this.messageCallbacks.has(channel)) {
      this.messageCallbacks.set(channel, []);
    }
    
    this.messageCallbacks.get(channel)?.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.messageCallbacks.get(channel) || [];
      this.messageCallbacks.set(channel, callbacks.filter(cb => cb !== callback));
    };
  }
  
  // Register callback for connection event
  onConnect(callback: ConnectionCallback): () => void {
    this.connectCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.connectCallbacks = this.connectCallbacks.filter(cb => cb !== callback);
    };
  }
  
  // Register callback for disconnection event
  onDisconnect(callback: ConnectionCallback): () => void {
    this.disconnectCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.disconnectCallbacks = this.disconnectCallbacks.filter(cb => cb !== callback);
    };
  }
  
  // Send message to specific channel
  sendMessage(channel: string, payload: any): void {
    if (this.socket?.readyState === WebSocket.OPEN && !this.isMockMode) {
      this.socket.send(JSON.stringify({
        channel,
        payload
      }));
      console.info('Message sent to channel', channel, payload);
    } else {
      // In mock mode, just log the message attempt
      console.info('Message sent to channel', channel, payload);
    }
  }
  
  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
