import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../contexts/ChatContext";
import { useChat } from "../../hooks/useChat";
import { Sidebar } from "../../components/Layout/Sidebar";
import { ChatInput } from "../../components/Chat/ChatInput";
import { ChatMessage } from "../../components/Chat/ChatMessage";
import { LoadingDots } from "../../components/Chat/LoadingDots";
import { Box, keyframes, Typography } from "@mui/material";
import { theme } from "styles/theme";

const fadeIn = keyframes`
  from { opacity: 0;  }
  to { opacity: 1;  }
`;

export const ChatPage: React.FC = () => {
  const { messages } = useChatContext();
  const { sendMessage, isLoading, createNewSession, showNewDialogTip } =
    useChat();
  const [input, setInput] = useState("");
  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  // 滚动
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);


  const WelcomeBanner = () => (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        color: theme.palette.text.secondary,
      }}
    >
      <Typography variant="h5" gutterBottom>
        欢迎使用政策问答系统
      </Typography>
      <Typography variant="body1">输入您的问题开始新对话</Typography>
    </Box>
  );

  const NewDialogTip = () => (
    <Box
      sx={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
        borderRadius: 2,
        animation: `${fadeIn} 0.3s ease-in`,
      }}
    >
      <Typography variant="body2">您已在新对话界面</Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Sidebar onNewChat={createNewSession} />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          maxWidth: "calc(100% - 260px)",
          background:
            messages.length === 0
              ? "rgba(255, 255, 255, 0.9)"
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // 原背景
          transition: "background 0.3s ease",
          overflow: "visible",
        }}
      >
        {messages.length === 0 && <WelcomeBanner />}
        {/* 消息列表 */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0, 0, 0, 0.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.primary.light,
              borderRadius: "4px",
            },
          }}
          className="messages-container"
        >
          {messages.map((msg) => (
            <ChatMessage key={`${msg.id}-${msg.timestamp}`} message={msg} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && <LoadingDots />}
        </Box>
        <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={isLoading}
          />
        </Box>
        {showNewDialogTip && <NewDialogTip />}
      </Box>
    </Box>
  );
};
