// src/pages/Home/Home.styles.js
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Button, Card, Typography } from "@mui/material";
import HomePrincipal from "../../data/images/Home/HomePrincipal.jpeg";

// Animación para el fondo
export const zoomInOut = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const FullScreenBox = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
});

export const BackgroundImage = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${HomePrincipal})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: -1,
  animation: `${zoomInOut} 10s ease-in-out infinite`,
});

export const ContentWrapper = styled(Box)({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

export const StyledCard = styled(Card)({
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  padding: "48px 64px",
  borderRadius: "20px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.7)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
});

export const Title = styled(Typography)({
  color: "#FF4B2B",
  fontSize: "32px",
  fontWeight: 900,
  letterSpacing: "3px",
  fontFamily: "'Roboto Mono', monospace",
});

export const Subtitle = styled(Typography)({
  color: "#ffffff",
  fontWeight: 300,
  letterSpacing: 1,
  marginBottom: "24px",
  fontFamily: "'Roboto Mono', monospace",
});

export const StyledButton = styled(Button)({
  color: "#ffffff",
  backgroundColor: "transparent",
  border: "2px solid white",
  fontSize: "16px",
  fontWeight: "bold",
  fontFamily: "'Space Mono', monospace",
  letterSpacing: "1.5px",
  padding: "12px 28px",
  borderRadius: "8px",
  textTransform: "uppercase",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#ffffff",
    color: "#000",
  },
});