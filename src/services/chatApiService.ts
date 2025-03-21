
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL, CHAT_ENDPOINTS } from '@/services/apiConfig';
import { ChatMessage } from '@/types/chat';
import { getMockChatSession, sendMockMessage } from '@/services/mockChatService';
import { 
  normalizeModuleContext, 
  convertApiMessageToChatMessage, 
  createWelcomeMessage,
  createErrorMessage
} from '@/utils/chatUtils';

// Get auth token from local storage
export const getAuthToken = () => localStorage.getItem('auth-token');

// Check if backend is available
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking backend availability...");
    await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    console.log("Backend available!");
    return true;
  } catch (error) {
    console.log("Backend health check failed, switching to offline mode", error);
    return false;
  }
};

// Fetch or create a chat session
export const fetchOrCreateChatSession = async (
  moduleContext?: string, 
  agentId?: number,
  isBackendAvailable = false
) => {
  const token = getAuthToken();
  const normalizedModuleContext = normalizeModuleContext(moduleContext);
  
  if (isBackendAvailable && token) {
    try {
      let sessionResponse;
      let endpointPath;
      
      if (normalizedModuleContext) {
        endpointPath = `/api/v1/chat/module/${normalizedModuleContext}`;
        console.log(`Fetching module chat session for ${normalizedModuleContext} from ${endpointPath}`);
        
        sessionResponse = await axios.get(`${API_BASE_URL}${endpointPath}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (agentId) {
        endpointPath = `/api/v1/agents/${agentId}/chat`;
        console.log(`Fetching agent chat session for agent ${agentId} from ${endpointPath}`);
        
        sessionResponse = await axios.get(`${API_BASE_URL}${endpointPath}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        endpointPath = `/api/v1/chat/sessions`;
        console.log(`Creating new general chat session at ${endpointPath}`);
        
        const createResponse = await axios.post(`${API_BASE_URL}${endpointPath}`, {
          module: null,
          agent_id: null,
          metadata: {}
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        sessionResponse = { data: createResponse.data };
      }
      
      const sessionData = sessionResponse.data;
      
      if (!sessionData || !sessionData.id) {
        throw new Error("Invalid session data");
      }
      
      const messages: ChatMessage[] = (sessionData.messages || []).map(convertApiMessageToChatMessage);
      
      return {
        id: sessionData.id,
        messages
      };
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  } else {
    const mockSession = getMockChatSession(normalizedModuleContext, agentId);
    
    if (!mockSession || !mockSession.id) {
      throw new Error("Failed to create mock session");
    }
    
    const messages: ChatMessage[] = mockSession.messages.map((msg: any) => ({
      id: msg.id || uuidv4(),
      text: msg.text,
      isUser: msg.isUser,
      timestamp: new Date(msg.timestamp || Date.now()),
      table_data: msg.table_data,
      summary: msg.summary,
      next_question: msg.next_question || []
    }));
    
    return {
      id: mockSession.id,
      messages
    };
  }
};

// Send a message to the chat API
export const sendMessageToApi = async (
  inputText: string, 
  sessionId: string, 
  moduleContext?: string, 
  agentId?: number,
  isBackendAvailable = false
): Promise<ChatMessage> => {
  const token = getAuthToken();
  const normalizedModule = normalizeModuleContext(moduleContext);
  
  if (isBackendAvailable && token) {
    try {
      console.log(`Sending message to session ${sessionId}`);
      
      const sendEndpoint = `/api/v1/chat/${sessionId}/send`;
      
      const response = await axios.post(`${API_BASE_URL}${sendEndpoint}`, {
        text: inputText
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
      
      if (!response.data) {
        throw new Error("Empty response from backend");
      }
      
      console.log("Received response:", response.data);
      
      return {
        id: response.data.id || uuidv4(),
        text: response.data.text,
        isUser: false,
        timestamp: new Date(response.data.timestamp),
        table_data: response.data.table_data,
        summary: response.data.summary,
        next_question: response.data.next_question || []
      };
    } catch (error) {
      console.error("Failed to send message to backend:", error);
      throw error;
    }
  } else {
    try {
      const mockResponse = await sendMockMessage(inputText, normalizedModule, agentId);
      
      // Create the message without relying on response_type
      return {
        id: mockResponse.id || uuidv4(),
        text: mockResponse.text,
        isUser: false,
        timestamp: new Date(),
        table_data: mockResponse.table_data,
        summary: mockResponse.summary,
        next_question: mockResponse.next_question || []
      };
    } catch (error) {
      console.error("Failed to generate mock response:", error);
      throw error;
    }
  }
};

// Create a new chat session
export const createNewChatSession = async (
  moduleContext?: string, 
  agentId?: number,
  isBackendAvailable = false
) => {
  const token = getAuthToken();
  const normalizedModule = normalizeModuleContext(moduleContext);
  
  if (isBackendAvailable && token) {
    try {
      const endpoint = `/api/v1/chat/sessions`;
      console.log(`Creating new session at ${endpoint}`, { module: normalizedModule, agent_id: agentId });
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        module: normalizedModule,
        agent_id: agentId,
        metadata: {}
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.data || !response.data.id) {
        throw new Error("Invalid session data in response");
      }
      
      const welcomeMessages = (response.data.messages || []).map(convertApiMessageToChatMessage);
      
      return {
        id: response.data.id,
        messages: welcomeMessages
      };
    } catch (error) {
      console.error(`Failed to create new session via API: ${error}`);
      throw error;
    }
  } else {
    return fetchOrCreateChatSession(moduleContext, agentId, false);
  }
};
