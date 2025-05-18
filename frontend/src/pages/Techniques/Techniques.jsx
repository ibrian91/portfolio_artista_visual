import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Card } from "@mui/material";

const Techniques = () => {
  const location = useLocation();
  const categories = location.state?.categories || {};

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variantIndex, setVariantIndex] = useState(0);

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

  const renderLogoContent = (element) => {
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
  }

  const renderCardContent = (element) => {
    if (element.image) {
      return (
        <Box
        component="img"
        src={encodeURI(element.image)}
        alt={element.name}
        sx={{
          width: "80vw",
          height: "auto",
          maxHeight: "90vh",
          objectFit: "contain",
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
<Typography
  variant="h3"
  fontWeight="bold"
  mb={3}
  sx={{
    color: "#000",
    textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
    letterSpacing: 4,
  }}
>
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
                {renderLogoContent(category)}
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
                  {renderLogoContent(item)}
                </Card>
              ))
            )
          : null}

        {/* Mostrar variante en carrusel si hay item seleccionado */}
        {selectedItem && selectedItem.variants.length > 0 && (
  <Box
    position="fixed"
    top={0}
    left={0}
    width="100vw"
    height="100vh"
    bgcolor="black"
    zIndex={9999}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
  >
    {/* Botón Volver */}
    <button
      onClick={handleBack}
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10000,
        background: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Volver
    </button>

    {/* Contenedor de la imagen con flechas */}
    <Box
      position="relative"
      width="80vw"
      height="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Flecha izquierda */}
      <button
        onClick={() =>
          setVariantIndex((prev) =>
            prev === 0 ? selectedItem.variants.length - 1 : prev - 1
          )
        }
        style={{
          position: "absolute",
          left: 0,
          zIndex: 10000,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "3rem",
          cursor: "pointer",
        }}
      >
        ◀
      </button>

      {/* Imagen */}
      <Box
        component="img"
        src={encodeURI(selectedItem.variants[variantIndex].image)}
        alt={selectedItem.variants[variantIndex].name}
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />

      {/* Flecha derecha */}
      <button
        onClick={() =>
          setVariantIndex((prev) =>
            prev === selectedItem.variants.length - 1 ? 0 : prev + 1
          )
        }
        style={{
          position: "absolute",
          right: 0,
          zIndex: 10000,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "3rem",
          cursor: "pointer",
        }}
      >
        ▶
      </button>
    </Box>

    {/* Descripción */}
    <Typography
      variant="subtitle1"
      color="white"
      mt={2}
      textAlign="center"
      maxWidth="80vw"
    >
      {selectedItem.variants[variantIndex].name}
    </Typography>
  </Box>
)}
      </Box>
    </Box>
  );
};

export default Techniques;