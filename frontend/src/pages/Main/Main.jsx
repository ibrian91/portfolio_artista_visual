import React, { useEffect, useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import techniquesData from "../../assets/techniques.json";

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
          width: { xs: "95%", sm: "85%", md: "90%" },
          minHeight: { xs: "auto", md: "550px" },
          padding: { xs: "40px", md: "60px" },
          bgcolor: "#1E1E1E",
          color: "white",
          borderRadius: "20px",
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            gap: "20px",
            overflow: "hidden",
          }}
        >
          {techniques.map((technique, index) => (
            <Card
              key={index}
              onClick={() => handleTechniqueClick(technique)}
              sx={{
                flex: 1,
                bgcolor: "#2A2A2A",
                borderRadius: "12px",
                padding: 0,
                height: "100%",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.03)" },
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
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default Main;