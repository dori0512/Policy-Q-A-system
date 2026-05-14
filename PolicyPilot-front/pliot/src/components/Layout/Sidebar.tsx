import React from "react";
import { FixedSizeList as List } from "react-window";
import { styled } from "@mui/material/styles";
import {
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { theme } from "styles/theme";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "contexts/ChatContext";

const SidebarContainer = styled("div")(({ theme }) => ({
  width: "260px",
  height: "100vh",
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRight: `1px solid ${theme.palette.divider}`,
  boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
}));

export const Sidebar: React.FC<{
  onNewChat?: () => void;
}> = ({ onNewChat }) => {
  const { sessions, switchSession, currentSessionId } = useChatContext();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <SidebarContainer>
      <Box
        component="span"
        sx={{
          p: 3,
          fontSize: "1.2rem",
          fontWeight: 600,
          color: theme.palette.primary.main,
          width: "100%",
        }}
      >
        政策问答系统
      </Box>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ListItemButton
          onClick={onNewChat}
          sx={{
            borderRadius: "8px",
            margin: "0 8px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            ":hover": {
              border: "1px solid rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <ListItemText primary="+ 新对话" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />

        <List
          height={400}
          width={260}
          itemSize={46}
          itemCount={sessions.length}
          itemData={sessions}
          innerElementType="div"
          style={{ overflowX: "hidden" }}
        >
          {({ index, style, data }) => (
            <Box sx={{ mb: 8 }}>
              <ListItemButton
                key={data[index].sessionId}
                style={style}
                onClick={() => switchSession?.(data[index].sessionId)}
                sx={{
                  borderRadius: "8px",
                  margin: "0 8px",
                  height: "45px !important",
                  backgroundColor:
                    currentSessionId === data[index].sessionId
                      ? "rgba(0, 0, 0, 0.08)"
                      : "inherit",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <span
                      style={{
                        display: "inline-block",
                        width: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color:
                          currentSessionId === data[index].sessionId
                            ? theme.palette.primary.main
                            : "rgba(0, 0, 0, 0.4)",
                        fontSize: "15px",
                      }}
                    >
                      {data[index].title}
                    </span>
                  }
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            </Box>
          )}
        </List>
      </div>
      {/* 底部用户信息 */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" noWrap>
          {user}
        </Typography>
        <Button
          variant="text"
          color="error"
          size="small"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          退出登录
        </Button>
      </Box>
    </SidebarContainer>
  );
};
