import React, { useState, useEffect } from 'react';
import { Typography, Box } from "@mui/material";
import { ImageViewer, MockUpViewer, RotatingImageViewer } from './index';

const GroupImagesView = ({
  groupName,
  images = [],
  isLoading,
  onBackToGroups
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showMockUp, setShowMockUp] = useState(false);
  const [showRotating, setShowRotating] = useState(false);

  // Asegurar que images sea un array
  const safeImages = Array.isArray(images) ? images : [];

  // Si no hay imágenes y ya no está cargando, volver automáticamente
  useEffect(() => {
    if (safeImages.length === 0 && !isLoading && onBackToGroups) {
      onBackToGroups();
    }
  }, [safeImages.length, isLoading, onBackToGroups]);

  // Separar imágenes especiales de las regulares (verificación estricta)
  const mockupImage = safeImages.find(img => img.is_mockup_image === true || img.is_mockup_image === 1);
  const rotatingImage = safeImages.find(img => img.is_rotating_image === true || img.is_rotating_image === 1);
  const regularImages = safeImages.filter(img => 
    (img.is_mockup_image !== true && img.is_mockup_image !== 1) && 
    (img.is_rotating_image !== true && img.is_rotating_image !== 1)
  );

  // Abrir automáticamente según el tipo de imagen especial
  // Flujo: MockUp → Rotating → Imágenes Regulares
  useEffect(() => {
    if (safeImages.length > 0 && !isLoading && selectedImageIndex === null && !showMockUp && !showRotating && !isViewerOpen) {
      if (mockupImage) {
        // Prioridad 1: MockUp en fullscreen
        setShowMockUp(true);
      } else if (rotatingImage) {
        // Prioridad 2: Rotating Image
        setShowRotating(true);
      } else {
        // Si no hay imágenes especiales, abrir viewer normal
        setSelectedImageIndex(0);
        setIsViewerOpen(true);
      }
    }
  }, [safeImages.length, isLoading, mockupImage, rotatingImage]);

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
    
    // Después del MockUp, verificar si hay Rotating Image
    if (rotatingImage) {
      console.log('✅ Mostrando Rotating después del MockUp');
      setShowRotating(true);
    } else if (regularImages.length > 0) {
      // Si no hay Rotating, mostrar imágenes regulares
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    } else {
      // Si solo había MockUp, volver a grupos
      if (onBackToGroups) {
        onBackToGroups();
      }
    }
  };

  const handleBackToBeginning = () => {
    // Volver al inicio del ciclo completo (MockUp si existe, sino Rotating)
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
    
    // Siempre volver al inicio: MockUp primero, luego Rotating
    if (mockupImage) {
      console.log('✅ Volviendo al inicio del ciclo: MockUp');
      setShowMockUp(true);
    } else if (rotatingImage) {
      console.log('✅ Volviendo al inicio del ciclo: Rotating');
      setShowRotating(true);
    }
  };

  const handleRotatingExit = () => {
    setShowRotating(false);
    
    // Después del Rotating, mostrar imágenes regulares
    if (regularImages.length > 0) {
      console.log('✅ Mostrando imágenes regulares después del Rotating');
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    } else {
      // Si solo había Rotating (y tal vez MockUp), volver a grupos
      if (onBackToGroups) {
        onBackToGroups();
      }
    }
  };

  const handleBackToRotating = () => {
    // Cerrar el viewer normal y volver al Rotating
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
    setShowRotating(true);
  };

  const handleBackToMockUpFromRotating = () => {
    // Cerrar Rotating y volver al MockUp
    setShowRotating(false);
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

  // Si no hay imágenes, mostrar mensaje (el useEffect de arriba se encarga de volver)
  if (safeImages.length === 0) {
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

      {/* Rotating Image Viewer - Rotación 3D */}
      {showRotating && rotatingImage && (
        <RotatingImageViewer
          rotatingImage={rotatingImage}
          onClose={handleRotatingExit}
          groupName={groupName}
          hasMockUp={!!mockupImage}
          hasRegularImages={regularImages.length > 0}
          onBackToMockUp={mockupImage ? handleBackToMockUpFromRotating : null}
          onNext={regularImages.length > 0 ? handleRotatingExit : null}
        />
      )}

      {/* Image Viewer normal - para imágenes regulares */}
      {isViewerOpen && selectedImageIndex !== null && !showMockUp && !showRotating && (
        <ImageViewer
          images={regularImages}
          initialIndex={selectedImageIndex}
          onClose={handleCloseViewer}
          groupName={groupName}
          hasSpecialImage={!!(rotatingImage || mockupImage)}
          onBackToPrevious={rotatingImage ? handleBackToRotating : mockupImage ? handleBackToBeginning : null}
          onBackToBeginning={(rotatingImage || mockupImage) ? handleBackToBeginning : null}
        />
      )}
    </>
  );
};

export default GroupImagesView;
