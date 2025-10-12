import React, { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";

const RotatingImageViewer = ({
  rotatingImage,
  onClose,
  groupName,
  hasMockUp = false,
  hasRegularImages = false,
  onBackToMockUp = null,
  onNext = null
}) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!rotatingImage) {
    return null;
  }

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

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
          {groupName} - Rotación 3D
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

      {/* Contenedor de la imagen con rotación 3D */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '70vw',
          height: '70vh',
          maxWidth: '800px',
          maxHeight: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1500px', // Perspectiva 3D
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: isPaused ? 'none' : 'rotate3D 6s linear infinite',
            '@keyframes rotate3D': {
              '0%': {
                transform: 'rotateY(0deg)',
              },
              '100%': {
                transform: 'rotateY(360deg)',
              },
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
                transform: 'scaleX(-1)', // Espejo horizontal
              }}
              onError={(e) => {
                console.error('❌ Error cargando imagen rotatoria:', rotatingImage.file_url);
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Flecha izquierda - Volver a MockUp */}
      {hasMockUp && onBackToMockUp && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          sx={{
            position: "absolute",
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: "white",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            fontSize: "3rem",
            minWidth: "60px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: '2px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              bgcolor: "rgba(255, 255, 255, 0.2)",
              border: '2px solid rgba(255, 255, 255, 0.6)',
            },
            zIndex: 10001,
          }}
        >
          ‹
        </Button>
      )}

      {/* Flecha derecha - Ir a imágenes regulares */}
      {hasRegularImages && onNext && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          sx={{
            position: "absolute",
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: "white",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            fontSize: "3rem",
            minWidth: "60px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: '2px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              bgcolor: "rgba(255, 255, 255, 0.2)",
              border: '2px solid rgba(255, 255, 255, 0.6)',
            },
            zIndex: 10001,
          }}
        >
          ›
        </Button>
      )}

      {/* Controles */}
      <Box
        position="absolute"
        bottom={100}
        display="flex"
        gap={2}
        zIndex={10001}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={handleTogglePause}
          sx={{
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
        </Button>
      </Box>

      {/* Información de la imagen */}
      {(rotatingImage.image_name || rotatingImage.description) && (
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
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.7, display: 'block' }}>
            Presiona ESPACIO para pausar/reanudar | ESC para salir
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RotatingImageViewer;
