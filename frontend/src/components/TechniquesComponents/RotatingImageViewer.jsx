import React, { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";

const RotatingImageViewer = ({
  rotatingImage,
  onClose,
  groupName,
  hasMockUp = false,
  hasRegularImages = false,
  onBackToMockUp = null,
  onNext = null,
  totalImages = 0,
  onGoToImage = null
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  if (!rotatingImage) {
    return null;
  }

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Manejo de arrastre del mouse
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentRotation(rotation);
    setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const rotationChange = deltaX * 0.5; // Sensibilidad del arrastre
    setRotation(currentRotation + rotationChange);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPaused(false); // Reanudar rotación automática
    }
  };

  // Efecto para manejar mouse events globales
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startX, currentRotation]);

  const handlePrevious = () => {
    if (hasMockUp && onBackToMockUp) {
      onBackToMockUp();
    }
  };

  const handleNext = () => {
    if (hasRegularImages && onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  // Manejar teclas
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') { // Espacio para pausar/reanudar
        e.preventDefault();
        handleTogglePause();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, hasMockUp, hasRegularImages]);

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
        <Typography variant="h6" sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
        
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
            mr: 1,
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          ✕
        </Button>
      </Box>

      {/* Fila: flecha izquierda | imagen rotatoria | flecha derecha */}
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
        {/* Flecha izquierda */}
        <Box sx={{ flexShrink: 0, width: "clamp(48px, 8vw, 80px)", display: "flex", justifyContent: "center" }}>
          {hasMockUp && onBackToMockUp && (
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

        {/* Contenedor de la imagen con rotación 3D */}
        <Box
          flex={0.8}
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onMouseDown={handleMouseDown}
          sx={{
            perspective: '1500px',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg)`,
              animation: isPaused || isDragging ? 'none' : 'continuousRotate 6s linear infinite',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              '@keyframes continuousRotate': {
                'from': { transform: 'rotateY(0deg)' },
                'to': { transform: 'rotateY(360deg)' },
              },
            }}
          >
            {/* Cara frontal */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
              }}
            >
              <img
                src={`http://localhost:5000${rotatingImage.file_url}`}
                alt={rotatingImage.image_name || 'Imagen rotatoria'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={(e) => {
                  console.error('❌ Error cargando imagen rotatoria:', rotatingImage.file_url);
                }}
              />
            </Box>

            {/* Cara trasera (imagen invertida horizontalmente) */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
              }}
            >
              <img
                src={`http://localhost:5000${rotatingImage.file_url}`}
                alt={rotatingImage.image_name || 'Imagen rotatoria - reverso'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  transform: 'scaleX(-1)',
                }}
                onError={(e) => {
                  console.error('❌ Error cargando imagen rotatoria:', rotatingImage.file_url);
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Flecha derecha */}
        <Box sx={{ flexShrink: 0, width: "clamp(48px, 8vw, 80px)", display: "flex", justifyContent: "center" }}>
          {hasRegularImages && onNext && (
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
      {(totalImages > 0 || rotatingImage.image_name || rotatingImage.description) && (
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
          {totalImages > 0 && (
            <Box display="flex" gap={1}>
              {/* Punto activo: imagen rotatoria */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "white",
                  cursor: "default",
                  flexShrink: 0,
                }}
              />
              {/* Puntos de las imágenes siguientes */}
              {Array.from({ length: totalImages }).map((_, index) => (
                <Box
                  key={index}
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
                    if (onGoToImage) onGoToImage(index);
                  }}
                />
              ))}
            </Box>
          )}

          {/* Nombre y descripción */}
          {(rotatingImage.image_name || rotatingImage.description) && (
            <Box
              bgcolor="rgba(0, 0, 0, 0.8)"
              color="white"
              p={2}
              borderRadius={2}
              textAlign="center"
              width="100%"
            >
              {rotatingImage.image_name && (
                <Typography variant="h6" sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                  {rotatingImage.image_name}
                </Typography>
              )}
              {rotatingImage.description && (
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  {rotatingImage.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RotatingImageViewer;
