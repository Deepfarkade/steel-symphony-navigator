
import { ReactNode } from 'react';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  id?: string;
  table_data?: string | any;
  summary?: string;
  next_question?: string[];
  sender?: 'user' | 'bot';
  session_id?: string;
  df_parent?: any;
}

export interface ChatSession {
  id: string;
  name?: string;
  messages: ChatMessage[];
  createdAt: Date;
  module?: string;
  agent_id?: number;
}

export interface ChatContextProps {
  chatSessions: Record<string, ChatMessage[]>;
  currentSessionId: string;
  isLoading: boolean;
  sendMessage: (inputText: string, sessionId?: string, moduleContext?: string, agentId?: number) => void;
  setCurrentSessionId: (sessionId: string) => void;
  createNewSession: (agentId?: number, moduleContext?: string) => Promise<string>;
}

export interface ChatProviderProps {
  children: ReactNode;
  moduleContext?: string;
  agentId?: number;
}
