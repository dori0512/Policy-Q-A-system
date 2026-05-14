export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  sessionId: string;
  references?: string[];
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}