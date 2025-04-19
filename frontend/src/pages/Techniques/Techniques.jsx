import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Card, CardContent } from "@mui/material";

const Techniques = () => {
  const location = useLocation();
  const categories = location.state?.categories || [];

  return (
    <Box
      mt={10}
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      color="white"
    >
      <Typography variant="h4" fontWeight="bold" mb={3} color="black">
        {categories.title}
      </Typography>

      {categories.categoria.length > 0 ? (
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="center"
          width="100%"
          maxWidth="800px"
        >
          {categories.categoria.map((category, index) => (
            <Card
            key={index}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              width: "150px",
              height: "155px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              
            }}
          >
            {category.image && (
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                 
                 
                }}
              />
            )}
          
          
          </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" mt={2}>No hay categorías disponibles</Typography>
      )}
    </Box>
  );
};

export default Techniques;