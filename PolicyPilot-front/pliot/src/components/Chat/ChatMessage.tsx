import React from "react";
import { Message } from "../../types";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import ReactMarkdown from 'react-markdown';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageContainer = styled("div")<{ isBot: boolean }>(({ isBot }) => ({
  display: "flex",
  justifyContent: isBot ? "flex-start" : "flex-end",
  margin: "12px 0",
  "&:first-of-type": { marginTop: 0 },
}));

const Bubble = styled("div")<{ isBot: boolean }>(({ isBot, theme }) => ({
  maxWidth: "75%",
  padding: "12px 16px",
  borderRadius: isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
  backgroundColor: isBot
    ? "rgba(255, 255, 255, 0.95)"
    : theme.palette.primary.light,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  lineHeight: 1.5,
  fontSize: "0.875rem",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto",
  "& > *:first-child": {
    maxWidth: "100%",
    display: "flow-root"
  },
  position: "relative",
  animation: `${fadeIn} 0.3s ease-in`,
  color: isBot ? theme.palette.text.primary : "#f0f0f0",

  "&:after": {
    content: '""',
    position: "absolute",
    width: "12px",
    height: "12px",
    backgroundColor: isBot
      ? "rgba(255, 255, 255, 0.95)"
      : theme.palette.primary.light,
    transform: isBot ? "rotate(45deg)" : "rotate(-45deg)",
    [isBot ? "left" : "right"]: "-4px",
    top: "12px",
    clipPath: "polygon(0 0, 100% 0, 100% 50%)",
  },
}));

const References = styled("div")(({ theme }) => ({
  marginTop: "8px",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  "& a": {
    color: theme.palette.primary.main,
    textDecoration: "none",
    marginLeft: "4px",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <MessageContainer isBot={message.isBot}>
    <Bubble isBot={message.isBot}>
    <ReactMarkdown
        components={{
          p: ({ node, ...props }) => (
            <p 
              className="paragraph" 
              style={{ 
                margin: "0.5em 0",
                maxWidth: "100%"
              }} 
              {...props} 
            />
          ),
          strong: ({ node, ...props }) => (
            <strong 
              className="font-bold" 
              style={{ 
                fontWeight: 600,
                wordBreak: "keep-all"
              }} 
              {...props} 
            />
          ),
          ul: ({ node, ...props }) => (
            <ul 
              style={{ 
                margin: "0.5em 0",
                paddingLeft: "1.5em",
                listStyleType: "disc"
              }} 
              {...props} 
            />
          ),
          ol: ({ node, ...props }) => (
            <ol 
              style={{ 
                margin: "0.5em 0",
                paddingLeft: "1.5em",
                listStyleType: "decimal"
              }} 
              {...props} 
            />
          ),
          li: ({ node, ...props }) => (
            <li 
              style={{ 
                marginBottom: "0.25em",
                paddingLeft: "0.5em"
              }} 
              {...props} 
            />
          )
        }}
      >
        {message.content}
      </ReactMarkdown>
      {message.references && message.references.length > 0  && (
        <References>
          参考政策：
          {message.references.map((ref, i) => (
            <React.Fragment key={i}>
              <a href={ref} target="_blank" rel="noopener noreferrer">
                [{i + 1}] {ref}
              </a>
              <br />
            </React.Fragment>
          ))}
        </References>
      )}
    </Bubble>
  </MessageContainer>
);
