import React, { useState, useEffect } from 'react';
import { Typography, Box } from "@mui/material";
import { ImageViewer, MockUpViewer } from './index';

const GroupImagesView = ({
  groupName,
  images = [],
  isLoading,
  onBackToGroups
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showMockUp, setShowMockUp] = useState(false);

  // Asegurar que images sea un array
  const safeImages = Array.isArray(images) ? images : [];

  // Debug: ver qué imágenes llegan
  useEffect(() => {
    if (safeImages.length > 0) {
      console.log('🖼️ Imágenes recibidas en GroupImagesView:', safeImages.map(img => ({
        name: img.image_name,
        is_mockup: img.is_mockup_image
      })));
    }
  }, [safeImages]);

  // Separar MockUp de otras imágenes (verificación estricta)
  const mockupImage = safeImages.find(img => img.is_mockup_image === true);
  const regularImages = safeImages.filter(img => img.is_mockup_image !== true);

  // Abrir automáticamente el MockUp si existe, sino el viewer normal
  useEffect(() => {
    if (safeImages.length > 0 && !isLoading && selectedImageIndex === null && !showMockUp && !isViewerOpen) {
      if (mockupImage) {
        // Si hay MockUp, mostrarlo primero en fullscreen
        console.log('✅ Detectado MockUp:', mockupImage.image_name);
        setShowMockUp(true);
      } else {
        // Si no hay MockUp, abrir viewer normal con TODAS las imágenes
        console.log('✅ No hay MockUp, mostrando viewer normal con', safeImages.length, 'imágenes');
        setSelectedImageIndex(0);
        setIsViewerOpen(true);
      }
    }
  }, [safeImages.length, isLoading, mockupImage]);

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
    // Llamar al callback para volver a los grupos
    if (onBackToGroups) {
      onBackToGroups();
    }
  };

  const handleMockUpExit = () => {
    setShowMockUp(false);
    
    // Si hay imágenes regulares, mostrar el viewer normal
    if (regularImages.length > 0) {
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    } else {
      // Si solo había MockUp, volver a grupos
      if (onBackToGroups) {
        onBackToGroups();
      }
    }
  };

  const handleBackToMockUp = () => {
    // Cerrar el viewer normal y volver a mostrar el MockUp
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
    setShowMockUp(true);
  };

  // Si está cargando, mostrar mensaje de carga
  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          {groupName}
        </Typography>
        <Typography
          variant="subtitle1"
          color="white"
          sx={{
            textAlign: "center",
            padding: "20px",
            fontWeight: "bold",
          }}
        >
          Cargando imágenes...
        </Typography>
      </Box>
    );
  }

  // Si no hay imágenes, mostrar mensaje y volver automáticamente
  if (safeImages.length === 0) {
    React.useEffect(() => {
      if (onBackToGroups) {
        onBackToGroups();
      }
    }, []);
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          {groupName}
        </Typography>
        <Typography
          variant="subtitle1"
          color="white"
          sx={{
            textAlign: "center",
            padding: "20px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          No hay imágenes en este grupo
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* MockUp Viewer - Pantalla completa real */}
      {showMockUp && mockupImage && (
        <MockUpViewer
          mockupImage={mockupImage}
          remainingImages={regularImages}
          onExit={handleMockUpExit}
          groupName={groupName}
        />
      )}

      {/* Image Viewer normal - para imágenes regulares */}
      {isViewerOpen && selectedImageIndex !== null && !showMockUp && (
        <ImageViewer
          images={mockupImage ? regularImages : safeImages}
          initialIndex={selectedImageIndex}
          onClose={handleCloseViewer}
          groupName={groupName}
          hasMockUp={!!mockupImage}
          onBackToMockUp={mockupImage ? handleBackToMockUp : null}
        />
      )}
    </>
  );
};

export default GroupImagesView;
