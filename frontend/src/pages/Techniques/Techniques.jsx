import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Card, Button } from "@mui/material";

const ITEMS_PER_PAGE = 8;

const Techniques = () => {
  const location = useLocation();
  const categories = location.state?.categories || {};

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [page, setPage] = useState(1);

  const handleCategoryClick = (category) => {
    if (category.name === "Lapiz" && category.collections) {
      setSelectedCategory(category);
      setPage(1);
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
      setPage(1);
    }
  };

  // Renderiza la imagen sin blur ni lazy loading
  const renderLogoContent = (element) => {
    if (element.image) {
      return (
        <img
          src={encodeURI(element.image)}
          alt={element.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
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

  // --- PAGINACIÓN PARA ITEMS ---
  let paginatedItems = [];
  let totalPages = 1;
  if (selectedCategory && !selectedItem) {
    const allItems = selectedCategory.collections.flatMap((collection) => collection.items);
    totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    paginatedItems = allItems.slice(start, start + ITEMS_PER_PAGE);
  }

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
        minHeight="320px"
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

        {/* Mostrar items paginados si hay categoría seleccionada */}
        {selectedCategory && !selectedItem
          ? paginatedItems.map((item, idx) => (
              <Card
                key={idx}
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
          : null}
      </Box>

      {/* Paginación */}
      {selectedCategory && !selectedItem && totalPages > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
          gap={1}
          sx={{
            color: "#000",
            textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
            letterSpacing: 4,
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            sx={{
              color: "#000",
              borderColor: "#000",
              backgroundColor: "#fff",
              fontWeight: "bold",
              textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
              letterSpacing: 2,
              '&.Mui-disabled': {
                opacity: 0.5,
              },
            }}
          >
            Anterior
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "contained" : "outlined"}
              size="small"
              onClick={() => setPage(i + 1)}
              sx={{
                minWidth: 32,
                color: page === i + 1 ? "#fff" : "#000",
                backgroundColor: page === i + 1 ? "#000" : "#fff",
                borderColor: "#000",
                fontWeight: "bold",
                textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
                letterSpacing: 2,
              }}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            sx={{
              color: "#000",
              borderColor: "#000",
              backgroundColor: "#fff",
              fontWeight: "bold",
              textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
              letterSpacing: 2,
              '&.Mui-disabled': {
                opacity: 0.5,
              },
            }}
          >
            Siguiente
          </Button>
        </Box>
      )}

      {/* Carrusel de variantes sin blur ni lazy loading */}
      {selectedItem && selectedItem.variants && selectedItem.variants.length > 0 && (
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

          <Box
            position="relative"
            width="80vw"
            height="70vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
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

            <img
              src={encodeURI(selectedItem.variants[variantIndex].image)}
              alt={selectedItem.variants[variantIndex].name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />

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
  );
};

export default Techniques;