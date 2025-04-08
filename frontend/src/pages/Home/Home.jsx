import React from 'react';
import { Box, Typography, Button, Paper, keyframes } from '@mui/material';
import { Link } from 'react-router-dom';

// Animación de "latido" (pulse) para la tarjeta
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3); }
  50% { transform: scale(1.03); box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.4); }
  100% { transform: scale(1); box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3); }
`;

// Animación de "brillo" en el botón
const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 75, 43, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 75, 43, 0.9); }
  100% { box-shadow: 0 0 10px rgba(255, 75, 43, 0.5); }
`;

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      {/* Tarjeta animada */}
      <Paper
        elevation={10}
        sx={{
          bgcolor: "#1E1E1E",
          color: "white",
          width: { xs: "90%", sm: "80%", md: "400px" },
          padding: "60px 40px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          textAlign: "center",
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing={2}
          sx={{
            background: "linear-gradient(to right, #FF416C, #FF4B2B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PORT-FOLIO
        </Typography>

        {/* Botón con efecto glow */}
        <Button
          component={Link}
          to="/portfolio"
          variant="contained"
          sx={{
            bgcolor: "#FF4B2B",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
            textTransform: "none",
            animation: `${glow} 1.5s infinite alternate ease-in-out`,
            "&:hover": {
              bgcolor: "#FF1E00",
              animation: "none", // Detiene la animación al pasar el mouse para que el usuario sienta el control
            },
          }}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;