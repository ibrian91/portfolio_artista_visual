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
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
    >
      {/* Header con información */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bgcolor="rgba(0, 0, 0, 0.8)"
        color="white"
        p={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        zIndex={10001}
      >
        <Typography variant="h6" sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {groupName} - {currentIndex + 1} de {images.length}
        </Typography>
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

      {/* Contenedor de la imagen */}
      <Box
        position="relative"
        width="90vw"
        height="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón anterior */}
        {images.length > 1 && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            sx={{
              position: "absolute",
              left: -60,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              fontSize: "2rem",
              minWidth: "50px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              '&:hover': {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            ‹
          </Button>
        )}

        {/* Imagen principal */}
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

        {/* Botón siguiente */}
        {images.length > 1 && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: "absolute",
              right: -60,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              fontSize: "2rem",
              minWidth: "50px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              '&:hover': {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            ›
          </Button>
        )}
      </Box>

      {/* Información de la imagen */}
      {(currentImage.image_name || currentImage.description) && (
        <Box
          position="absolute"
          bottom={20}
          left="50%"
          sx={{ transform: "translateX(-50%)" }}
          bgcolor="rgba(0, 0, 0, 0.8)"
          color="white"
          p={2}
          borderRadius={2}
          maxWidth="80%"
          textAlign="center"
          zIndex={10001}
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

      {/* Indicadores de navegación */}
      {images.length > 1 && (
        <Box
          position="absolute"
          bottom={80}
          left="50%"
          sx={{ transform: "translateX(-50%)" }}
          display="flex"
          gap={1}
          zIndex={10001}
        >
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
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageViewer;
