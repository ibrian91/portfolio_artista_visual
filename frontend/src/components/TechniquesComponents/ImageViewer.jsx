import React, { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";

const ImageViewer = ({
  images = [],
  initialIndex = 0,
  onClose,
  groupName,
  hasSpecialImage = false,
  onBackToPrevious = null, // Callback para ir a la imagen especial anterior (Rotating)
  onBackToBeginning = null // Callback para volver al inicio del ciclo (MockUp)
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    // Si estamos en la primera imagen Y hay callback, ir a imagen especial anterior
    if (currentIndex === 0 && hasSpecialImage && onBackToPrevious) {
      onBackToPrevious();
    } else {
      // Navegación normal circular
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    // Si estamos en la última imagen Y hay callback, volver al inicio del ciclo
    if (currentIndex === images.length - 1 && hasSpecialImage && onBackToBeginning) {
      onBackToBeginning();
    } else {
      // Navegación normal circular
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bgcolor="rgba(0, 0, 0, 0.95)"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      onClick={onClose}
    >
      {/* Header */}
      <Box
        flexShrink={0}
        bgcolor="rgba(0, 0, 0, 0.8)"
        color="white"
        p={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        zIndex={10001}
      >
        <Box />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          sx={{
            color: 'white',
            minWidth: 'auto',
            padding: '8px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          ✕
        </Button>
      </Box>

      {/* Fila: flecha izquierda | imagen | flecha derecha */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        width="100vw"
        flex={1}
        minHeight={0}
        px={2}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flecha anterior */}
        <Box sx={{ flexShrink: 0, width: "clamp(48px, 8vw, 80px)", display: "flex", justifyContent: "center" }}>
          {images.length > 1 && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              sx={{
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                minWidth: "clamp(36px, 5vw, 50px)",
                width: "clamp(36px, 5vw, 50px)",
                height: "clamp(36px, 5vw, 50px)",
                borderRadius: "50%",
                '&:hover': { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              ‹
            </Button>
          )}
        </Box>

        {/* Imagen principal */}
        <Box
          flex={0.8}
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <img
            src={`http://localhost:5000${currentImage.file_url}`}
            alt={currentImage.image_name || `Imagen ${currentIndex + 1}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            }}
            onError={(e) => {
              console.error('❌ Error cargando imagen:', currentImage.file_url);
            }}
          />
        </Box>

        {/* Flecha siguiente */}
        <Box sx={{ flexShrink: 0, width: "clamp(48px, 8vw, 80px)", display: "flex", justifyContent: "center" }}>
          {images.length > 1 && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              sx={{
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                minWidth: "clamp(36px, 5vw, 50px)",
                width: "clamp(36px, 5vw, 50px)",
                height: "clamp(36px, 5vw, 50px)",
                borderRadius: "50%",
                '&:hover': { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              ›
            </Button>
          )}
        </Box>
      </Box>

      {/* Indicadores + info: puntos arriba, nombre/descripción abajo */}
      {(images.length > 1 || (hasSpecialImage && onBackToPrevious) || currentImage.image_name || currentImage.description) && (
        <Box
          flexShrink={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1}
          width="100%"
          maxWidth="80%"
          alignSelf="center"
          pb={2}
          pt={1}
          zIndex={10001}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Puntos de navegación */}
          {(images.length > 1 || (hasSpecialImage && onBackToPrevious)) && (
            <Box display="flex" gap={1}>
              {/* Punto de la imagen rotatoria */}
              {hasSpecialImage && onBackToPrevious && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackToPrevious();
                  }}
                />
              )}
              {images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </Box>
          )}

          {/* Nombre y descripción */}
          {(currentImage.image_name || currentImage.description) && (
            <Box
              bgcolor="rgba(0, 0, 0, 0.8)"
              color="white"
              p={2}
              borderRadius={2}
              textAlign="center"
              width="100%"
            >
              {currentImage.image_name && (
                <Typography variant="h6" sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                  {currentImage.image_name}
                </Typography>
              )}
              {currentImage.description && (
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  {currentImage.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImageViewer;
