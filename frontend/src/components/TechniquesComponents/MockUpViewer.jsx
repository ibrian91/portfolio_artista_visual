import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from "@mui/material";

const MockUpViewer = ({
  mockupImage,
  remainingImages = [],
  onExit,
  groupName
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Entrar en modo fullscreen al montar el componente
  useEffect(() => {
    enterFullscreen();
    
    // Cleanup al desmontar
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      const element = containerRef.current;
      if (element) {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
          await element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari y Opera
          await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
          await element.msRequestFullscreen();
        }
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error('Error al entrar en modo fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari y Opera
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error('Error al salir de modo fullscreen:', err);
    }
  };

  const handleNext = async () => {
    await exitFullscreen();
    if (onExit) {
      onExit();
    }
  };

  // Detectar cuando el usuario sale del fullscreen manualmente (ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        if (onExit) {
          onExit();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [onExit]);

  // Controles de teclado para navegación
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Flecha derecha: avanzar a las imágenes normales
      if (e.key === 'ArrowRight' && remainingImages.length > 0) {
        handleNext();
      }
      // ESC también puede salir (ya manejado por fullscreen, pero por si acaso)
      else if (e.key === 'Escape') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [remainingImages.length]);

  if (!mockupImage) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      {/* Imagen MockUp a pantalla completa */}
      <img
        src={`http://localhost:5000${mockupImage.file_url}`}
        alt={mockupImage.image_name || 'MockUp'}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        onError={(e) => {
          console.error('❌ Error cargando MockUp:', mockupImage.file_url);
        }}
      />

      {/* Flecha para continuar - Solo si hay más imágenes */}
      {remainingImages.length > 0 && (
        <Button
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            fontSize: '3rem',
            minWidth: '60px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.6)',
            },
            zIndex: 10001,
          }}
          aria-label="Siguiente"
        >
          ›
        </Button>
      )}

      {/* Indicador de grupo (opcional) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          zIndex: 10001,
        }}
      >
        {groupName} - MockUp
      </Box>
    </Box>
  );
};

export default MockUpViewer;
