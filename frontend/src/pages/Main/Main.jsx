import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import techniquesData from "../../assets/techniques.json"; // Import directo

const Main = () => {
  const [techniques, setTechniques] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTechniques(techniquesData); // Cargar los datos directamente
  }, []);

  const handleTechniqueClick = (categories) => {
    navigate("/techniques", { state: { categories } });
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" p={2}>
      <Card
        sx={{
          width: { xs: "95%", sm: "85%", md: "90%" },
          minHeight: { xs: "auto", md: "400px" },
          padding: { xs: "30px", md: "50px" },
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
            flexDirection: "row",
            overflowX: { xs: "auto", md: "visible" },
            whiteSpace: "nowrap",
            gap: 2,
            width: "100%",
            justifyContent: { xs: "flex-start", md: "center" },
            paddingBottom: { xs: 2, md: 0 },
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            paddingRight: { xs: "15%", md: "0" },
            scrollPaddingLeft: { xs: "15%", md: "0" },
          }}
        >
          {techniques.map((technique, index) => (
            <Card
              key={index}
              onClick={() => handleTechniqueClick(technique)}
              sx={{
                bgcolor: "#2A2A2A",
                color: "white",
                borderRadius: "12px",
                padding: "20px",
                minWidth: "250px",
                height: "450px",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease-in-out",
                scrollSnapAlign: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {technique.title}
                </Typography>
                <Typography variant="body1">{technique.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default Main;
