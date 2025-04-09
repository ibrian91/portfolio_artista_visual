import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import './Home.css';
import { keyframes } from "@emotion/react";
import HomePrincipal from "../../data/images/Home/HomePrincipal.jpeg";

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px #FF4B2B;
  }
  100% {
    box-shadow: 0 0 20px #FF4B2B;
  }
`;

const Home = () => {
  return (
    <Box
    sx={{
      position: "fixed", // clave para evitar el scroll 
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}
>
      {/* Fondo */}
      <Box
  sx={{
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
    animation: "zoomInOut 10s ease-in-out infinite",
  }}
/>

      {/* Contenido */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        sx={{ position: "relative", zIndex: 1 }}
      >
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
              animation: "none",
            },
          }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Home;