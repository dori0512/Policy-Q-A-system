import { useCallback, useState } from 'react';
import { Message } from '../types';
import { apiService } from '../services/api';
import { useChatContext } from '../contexts/ChatContext';

export const useChat = () => {
  const {
    messages,
    currentSessionId,
    addMessage,
    createNewSession: contextCreateNewSession,
    switchSession
  } = useChatContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showNewDialogTip, setShowNewDialogTip] = useState(false);

  const createNewSession = useCallback(async (initialQuestion?: string) => {
    try {
      if (typeof initialQuestion !== "string") {
        initialQuestion = '';
      }
      if (!initialQuestion && messages.length === 0) {
        if(showNewDialogTip){
          return { sessionId: currentSessionId! };
        }
        setShowNewDialogTip(true);
        setTimeout(() => setShowNewDialogTip(false), 2000);
        return { sessionId: currentSessionId! };
      }
      return await contextCreateNewSession(initialQuestion);
    } catch (error) {
      console.error("创建会话失败:", error);
      throw error;
    }
  }, [messages.length, contextCreateNewSession, showNewDialogTip, currentSessionId]);

  // 发送消息核心逻辑
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      let targetSessionId = currentSessionId;

      // 自动创建带标题的会话
      if (!targetSessionId) {
        const { sessionId } = await createNewSession(content);
        targetSessionId = sessionId;
      }

      // 添加用户消息
      const userMsg: Message = {
        id: Date.now().toString(),
        content,
        isBot: false,
        sessionId: targetSessionId!,
        timestamp: new Date()
      };
      addMessage(userMsg);

      const response = await apiService.sendQuery(content, targetSessionId!);
      const references = response.references!
      // 添加AI消息
      const botMsg: Message = {
        id: Date.now().toString(),
        content: response.answer,
        isBot: true,
        sessionId: targetSessionId!,
        references: references,
        timestamp: new Date()
      };
      addMessage(botMsg);

      setTimeout(() => {
        const container = document.querySelector('.messages-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 50); 
    } catch (error) {
      console.log(error)
      const errorMsg: Message = {
        id: Date.now().toString(),
        content: '抱歉，暂时无法处理您的请求',
        isBot: true,
        sessionId: currentSessionId || '',
        timestamp: new Date()
      };
      addMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, currentSessionId, createNewSession]);

  return { 
    sendMessage,
    isLoading,
    createNewSession,
    switchSession,
    showNewDialogTip
  };
};