import React, { useEffect, useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import techniquesData from "../../assets/techniques.json";
import "@fontsource/playfair-display";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const Main = () => {
  const [techniques, setTechniques] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTechniques(techniquesData);
  }, []);

  const handleTechniqueClick = (categories) => {
    navigate("/techniques", { state: { categories } });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Card
        sx={{
          width: "2000px",
          minHeight: "550px",
          padding: 0,
          bgcolor: "transparent",
          color: "white",
          borderRadius: "20px",
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "1700px",
            height: "550px",
            gap: "20px",
            overflow: "hidden",
          }}
        >
          {techniques.map((technique, index) => (
            <MotionCard
              key={index}
              onClick={() => handleTechniqueClick(technique)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              sx={{
                flex: 1,
                bgcolor: "#3C2E2B",
                borderRadius: "12px",
                padding: 0,
                height: "100%",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.4)",
                },
                "&:hover .titleBox": {
                  opacity: 1,
                },
              }}
            >
              <CardContent sx={{ p: 0, height: "100%", width: "100%" }}>
                <Box
                  component="img"
                  src={technique.image}
                  alt={technique.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "filter 0.5s ease",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                  }}
                />
                <Box
                  className="hoverOverlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.4)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                    zIndex: 1,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                />
                <Box
                  className="titleBox"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.5s ease",
                    zIndex: 1,
                    display: "flex",
                    gap: "0.2rem",
                    pointerEvents: "none",
                  }}
                >
                  {technique.title.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 30, opacity: 0, rotate: -10 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      transition={{
                        delay: i * 0.05,
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      style={{
                        fontSize: "2.5rem",
                        fontFamily: "'Playfair Display', serif",
                        textTransform: "uppercase",
                        textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
                        color: "white",
                        display: "inline-block",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default Main;