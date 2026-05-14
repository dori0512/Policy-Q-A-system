import React from "react";
import { styled } from "@mui/material/styles";

const DotsContainer = styled('div')(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '24px',
  padding: '16px 24px',
  margin: '16px 0'
}));

const Dot = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: theme.palette.text.secondary,
  margin: "0 2px",
  animation: "bounce 1.4s infinite ease-in-out",
  "&:nth-of-type(2)": { animationDelay: "0.2s" },
  "&:nth-of-type(3)": { animationDelay: "0.4s" },
  "@keyframes bounce": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-8px)" },
  },
}));

export const LoadingDots: React.FC = () => (
  <DotsContainer>
    <Dot />
    <Dot />
    <Dot />
  </DotsContainer>
);
