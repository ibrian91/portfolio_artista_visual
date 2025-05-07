import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Card } from "@mui/material";

const Techniques = () => {
  const location = useLocation();
  const categories = location.state?.categories || {};

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCategoryClick = (category) => {
    if (category.name === "Lapiz" && category.collections) {
      setSelectedCategory(category);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const renderCardContent = (element) => {
    if (element.image) {
      return (
        <Box
        component="img"
        src={encodeURI(element.image)}
        alt={element.name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      );
    } else {
      return (
        <Typography
          variant="subtitle1"
          color="black"
          sx={{
            textAlign: "center",
            padding: "10px",
            fontWeight: "bold",
          }}
        >
          {element.name}
        </Typography>
      );
    }
  };

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
        {selectedItem
          ? selectedItem.name
          : selectedCategory
          ? selectedCategory.name
          : categories.title}
      </Typography>

      {(selectedCategory || selectedItem) && (
        <button onClick={handleBack} style={{ marginBottom: 20 }}>
          Volver
        </button>
      )}

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        width="100%"
        maxWidth="800px"
      >
        {/* Mostrar categorías si no hay selección */}
        {!selectedCategory && categories.categoria
          ? categories.categoria.map((category, index) => (
              <Card
                key={index}
                onClick={() => handleCategoryClick(category)}
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  width: "150px",
                  height: "155px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {renderCardContent(category)}
              </Card>
            ))
          : null}

        {/* Mostrar items si hay categoría seleccionada */}
        {selectedCategory && !selectedItem
          ? selectedCategory.collections.flatMap((collection, i) =>
              collection.items.map((item, j) => (
                <Card
                  key={`${i}-${j}`}
                  onClick={() => handleItemClick(item)}
                  sx={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    width: "150px",
                    height: "155px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  {renderCardContent(item)}
                </Card>
              ))
            )
          : null}

        {/* Mostrar variantes si hay item seleccionado */}
        {selectedItem
          ? selectedItem.variants.map((variant, index) => (
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
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {renderCardContent(variant)}
              </Card>
            ))
          : null}
      </Box>
    </Box>
  );
};

export default Techniques;