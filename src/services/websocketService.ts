
// WebSocket service for real-time communication

type MessageHandler = (message: any) => void;
type ConnectionHandler = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private connectionHandlers: ConnectionHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnecting = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket is already connected or connecting');
      return;
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.reconnecting = false;
        this.connectionHandlers.forEach(handler => handler());
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          if (this.messageHandlers.has(type)) {
            this.messageHandlers.get(type)?.forEach(handler => handler(payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} ${event.reason}`);
        this.socket = null;
        
        if (!this.reconnecting && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnecting = true;
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.connect();
          }, this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(type: string, payload: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    this.messageHandlers.get(type)?.push(handler);
    
    // Return function to unsubscribe
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    
    // Return function to unsubscribe
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// For demonstration, we're using a mock WebSocket URL
// In a real application, this would be your WebSocket server URL
const websocketService = new WebSocketService('wss://mock-websocket-server.example.com');

// Mock WebSocket implementation for demonstration
if (typeof WebSocket === 'undefined' || window.location.protocol === 'file:') {
  console.warn('WebSocket is not supported in this environment or running locally. Using mock implementation.');
  
  class MockWebSocket {
    private handlers: { [key: string]: Function[] } = {};
    private mockData = [
      { type: 'chat', payload: { text: 'Welcome to EY Steel Co-Pilot chat!', isUser: false, timestamp: new Date() } },
      { type: 'chat', payload: { text: 'I can help you analyze steel production data and optimize operations.', isUser: false, timestamp: new Date() } },
      { type: 'insight', payload: { message: 'Steel demand forecast shows 5% growth in automotive sector', severity: 'info' } }
    ];
    readyState = 0; // Use numeric value instead of WebSocket.CONNECTING

    constructor(url: string) {
      setTimeout(() => {
        this.readyState = 1; // Use numeric value instead of WebSocket.OPEN
        if (this.handlers.onopen) {
          this.handlers.onopen.forEach(handler => handler({ target: this }));
        }
        
        // Send mock messages periodically
        this.mockData.forEach((message, index) => {
          setTimeout(() => {
            if (this.handlers.onmessage) {
              this.handlers.onmessage.forEach(handler => 
                handler({ data: JSON.stringify(message), target: this })
              );
            }
          }, 1000 * (index + 1));
        });
      }, 500);
    }

    set onopen(handler: Function) {
      if (!this.handlers.onopen) this.handlers.onopen = [];
      this.handlers.onopen.push(handler);
    }

    set onmessage(handler: Function) {
      if (!this.handlers.onmessage) this.handlers.onmessage = [];
      this.handlers.onmessage.push(handler);
    }

    set onclose(handler: Function) {
      if (!this.handlers.onclose) this.handlers.onclose = [];
      this.handlers.onclose.push(handler);
    }

    set onerror(handler: Function) {
      if (!this.handlers.onerror) this.handlers.onerror = [];
      this.handlers.onerror.push(handler);
    }

    send(data: string): void {
      console.log('Mock WebSocket sending:', data);
      
      // Simulate response after a delay
      setTimeout(() => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'chat') {
            const response = {
              type: 'chat',
              payload: {
                text: `AI response to: "${parsedData.payload.text}"`,
                isUser: false,
                timestamp: new Date()
              }
            };
            
            if (this.handlers.onmessage) {
              this.handlers.onmessage.forEach(handler => 
                handler({ data: JSON.stringify(response), target: this })
              );
            }
          }
        } catch (e) {
          console.error('Error parsing mock data:', e);
        }
      }, 800);
    }

    close(): void {
      this.readyState = 3; // Use numeric value instead of WebSocket.CLOSED
      if (this.handlers.onclose) {
        this.handlers.onclose.forEach(handler => 
          handler({ code: 1000, reason: 'Mock socket closed', target: this })
        );
      }
    }
  }

  // @ts-ignore - Replace global WebSocket with mock for development
  window.WebSocket = MockWebSocket;
}

export default websocketService;
