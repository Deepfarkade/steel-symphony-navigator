// WebSocket service for real-time communication with AI Co-Pilot

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Record<string, Array<(data: any) => void>> = {};
  private messageQueue: any[] = [];
  private connectionSuccessCallbacks: Array<() => void> = [];
  private _isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect() {
    // In a real app this would connect to an actual WebSocket server
    // For this demo, we'll simulate the connection
    
    console.info('Attempting to connect to WebSocket...');
    
    // Simulate connection establishment
    setTimeout(() => {
      this._isConnected = true;
      console.info('WebSocket connected successfully');
      
      // Notify all connection listeners
      this.connectionSuccessCallbacks.forEach(callback => callback());
      
      // Process any messages that were queued while disconnected
      this.processQueue();
      
      // Reset reconnect attempts
      this.reconnectAttempts = 0;
    }, 500);
  }

  disconnect() {
    if (!this._isConnected) return;
    
    this._isConnected = false;
    console.info('WebSocket disconnected');
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Public method to check connection status
  isConnected(): boolean {
    return this._isConnected;
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached. Please refresh the page.');
      return;
    }
    
    this.reconnectAttempts++;
    console.info(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    this.connect();
  }

  onConnect(callback: () => void) {
    this.connectionSuccessCallbacks.push(callback);
    
    // If already connected, call immediately
    if (this._isConnected) {
      callback();
    }
    
    // Return function to unsubscribe
    return () => {
      this.connectionSuccessCallbacks = this.connectionSuccessCallbacks.filter(cb => cb !== callback);
    };
  }

  onMessage(channel: string, callback: (data: any) => void) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
    }
    
    this.listeners[channel].push(callback);
    
    // Return function to unsubscribe
    return () => {
      if (this.listeners[channel]) {
        this.listeners[channel] = this.listeners[channel].filter(cb => cb !== callback);
      }
    };
  }

  sendMessage(channel: string, data: any) {
    if (!this._isConnected) {
      console.warn('WebSocket is not connected. Message will be queued.');
      this.messageQueue.push({ channel, data });
      return;
    }
    
    // In a real app, this would send the message through the WebSocket
    // For this demo, we'll simulate receiving a response after a short delay
    this.simulateResponse(channel, data);
  }

  private processQueue() {
    if (this.messageQueue.length === 0) return;
    
    console.info(`Processing ${this.messageQueue.length} queued messages`);
    
    this.messageQueue.forEach(message => {
      this.sendMessage(message.channel, message.data);
    });
    
    this.messageQueue = [];
  }

  private simulateResponse(channel: string, requestData: any) {
    if (channel === 'chat') {
      // Generate AI response based on user input
      setTimeout(() => {
        const aiResponse = this.generateAIResponse(requestData.text, requestData.moduleContext, requestData.agentId);
        
        if (this.listeners[channel]) {
          this.listeners[channel].forEach(callback => {
            callback({
              text: aiResponse,
              isUser: false,
              timestamp: new Date().toISOString()
            });
          });
        }
      }, 1500);
    }
  }

  private generateAIResponse(userInput: string, moduleContext?: string, agentId?: number): string {
    const normalizedInput = userInput.toLowerCase();
    
    // Generate context-specific response
    if (moduleContext) {
      return `Based on your ${moduleContext} data, I can provide the following analysis: ${this.getModuleSpecificResponse(moduleContext, normalizedInput)}`;
    }
    
    if (agentId) {
      return `As Agent #${agentId}, I've analyzed your steel operations and found: ${this.getAgentSpecificResponse(agentId, normalizedInput)}`;
    }
    
    // Generic responses based on user input
    if (normalizedInput.includes('production')) {
      return "Current production levels are 7% above target for this quarter. There's an opportunity to optimize furnace operation times to further increase efficiency.";
    }
    
    if (normalizedInput.includes('energy') || normalizedInput.includes('consumption')) {
      return "Energy consumption patterns show a 12% reduction compared to last year. I've identified that implementing the new cooling procedure has contributed significantly to this improvement.";
    }
    
    if (normalizedInput.includes('cost') || normalizedInput.includes('price')) {
      return "Based on current market conditions and your production efficiency, we project a 4.2% cost reduction over the next quarter. Would you like to see the detailed analysis?";
    }
    
    if (normalizedInput.includes('quality') || normalizedInput.includes('defect')) {
      return "Quality metrics are excellent with a defect rate of only 0.3%. This is well below the industry average of 1.2%. The automated inspection system has been a key factor in this success.";
    }
    
    if (normalizedInput.includes('forecast') || normalizedInput.includes('predict')) {
      return "My analysis of market trends and historical data suggests a 8-12% increase in demand for high-grade steel in the automotive sector over the next two quarters. Would you like me to prepare a detailed forecast report?";
    }
    
    // Default response
    return "I've analyzed your steel operations data and I'm ready to provide insights. You can ask me about production metrics, energy consumption, quality ratings, market trends, or specific recommendations for optimization.";
  }

  private getModuleSpecificResponse(module: string, input: string): string {
    switch (module) {
      case 'demand-planning':
        return "Our predictive models show a potential 15% increase in automotive-grade steel demand in the next quarter. I recommend adjusting production capacity accordingly.";
      
      case 'supply-planning':
        return "Based on current supplier performance and market conditions, I recommend diversifying your raw material sources to mitigate the risk of price volatility.";
      
      case 'factory-planning':
        return "Optimizing your production schedule could increase throughput by approximately 8%. I've identified specific adjustments to shift patterns that can help achieve this.";
      
      case 'inventory-optimization':
        return "Your current inventory levels for Grade 304 steel are 22% above optimal. Reducing this could free up approximately $1.2M in working capital.";
      
      default:
        return "I've analyzed your data and found several opportunities for optimization. Would you like me to provide specific recommendations?";
    }
  }

  private getAgentSpecificResponse(agentId: number, input: string): string {
    switch (agentId) {
      case 1: // Agentic RCA
        return "I've performed a root cause analysis on the recent production anomaly and identified a correlation between ambient temperature variations and yield fluctuations. Implementing temperature-compensated process controls could stabilize yields.";
      
      case 2: // Smart RCA Generator
        return "Based on historical pattern analysis, I've generated a recommended adjustment to your cooling cycle timing that could improve hardness consistency by approximately 12%.";
      
      case 3: // PlanXpert
        return "I've optimized your production schedule for next week, balancing order priorities and equipment capabilities. This new schedule reduces changeover times by 18% while meeting all delivery deadlines.";
      
      case 4: // QualityGuard
        return "My analysis of recent quality metrics shows an emerging trend in surface finish variations. I recommend preventive maintenance on the final rolling station before this becomes a customer-facing issue.";
      
      case 5: // RiskRadar
        return "I've identified a potential supply chain risk related to your chromium supplier. Recent port congestion in their region has increased delivery variability by 35%. Consider increasing safety stock temporarily.";
      
      default:
        return "I've analyzed your steel operations data and identified several opportunities for improvement. Would you like me to provide specific recommendations in my area of expertise?";
    }
  }
}

export default new WebSocketService();
