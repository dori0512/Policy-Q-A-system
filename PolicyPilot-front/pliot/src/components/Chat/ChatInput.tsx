import React from "react";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputBase, Paper } from "@mui/material";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <InputBase
        fullWidth
        multiline
        maxRows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="输入政策问题..."
        disabled={disabled}
        sx={{ flex: 1, fontSize: "0.875rem", paddingLeft: 1, paddingRight: 1 }}
      />
      <IconButton
        onClick={onSend}
        disabled={disabled || !value.trim()}
        color="primary"
        sx={{ p: "8px" }}
      >
        <SendIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};
