import React, { useCallback, useEffect } from "react";
import { createContext, useContext, ReactNode, useState } from "react";
import { Message, ChatSession } from "../types";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface ChatContextType {
  sessions: ChatSession[];
  messages: Message[];
  currentSessionId: string | null;
  addMessage: (message: Message) => void;
  createNewSession: (
    initialQuestion: string
  ) => Promise<{ sessionId: string; title: string }>;
  switchSession: (sessionId: string) => void;
  loadSessions: () => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>(null!);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); 
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const loadSessions = useCallback(async () => {
    try {
      const data = await apiService.getChatHistory();
      setSessions(data);
    } catch (error) {
      console.error("加载会话失败:", error);
    }
  }, []);

  useEffect(() => {
    if (user && !currentSessionId) {
      loadSessions();
    }
  }, [user, currentSessionId, loadSessions]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const createNewSession = async (initialQuestion: string) => {
    try {
      if(!initialQuestion){
        setMessages([]);
        setCurrentSessionId(null);
        return { sessionId: "", title: "" };
      }
      const { sessionId, title } = await apiService.createNewSession(
        initialQuestion
      );

      await loadSessions();
      setCurrentSessionId(sessionId);
      setMessages([]);

      return { sessionId, title };
    } catch (error) {
      console.error("创建会话失败:", error);
      throw error;
    }
  };

  const switchSession = async (sessionId: string) => {
    try {
      if(!sessionId){
        return;
      }
      await loadMessages(sessionId);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error("切换会话失败:", error);
    }
  };

  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      const rawMessages = await apiService.getSessionMessages(sessionId);
      console.log(rawMessages)
      const processedMessages = rawMessages
        .map(msg => {
          if (!msg.isBot) {
            return {
              id: msg.id,
              content: msg.content,
              isBot: false,
              sessionId: msg.sessionId,
              timestamp: msg.timestamp
            } as Message;
          }
          
          return {
            id: msg.id,
            content: msg.content,
            isBot: true,
            sessionId: msg.sessionId,
            references: msg.references,
            timestamp: msg.timestamp
          } as Message;
        });
  
      setMessages(processedMessages);
    } catch (error) {
      console.error("加载消息失败:", error);
      setMessages([]);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        messages,
        currentSessionId,
        addMessage,
        createNewSession,
        switchSession,
        loadSessions,
        loadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
