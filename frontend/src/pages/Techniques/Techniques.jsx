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
                backgroundColor: category.color, // Se usa el color del JSON
                //color: "white",
                borderRadius: "12px",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                width: "150px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
              }}
            >
              <CardContent>
                <Typography variant="h6">{category.name}</Typography>
              </CardContent>
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