import React, { useState, useEffect } from 'react';
import { Typography, Box } from "@mui/material";
import { ImageViewer, RotatingImageViewer } from './index';

const GroupImagesView = ({
  groupName,
  images = [],
  isLoading,
  onBackToGroups
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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

  // Mockup se muestra como imagen normal: va primero en el viewer regular
  const allViewerImages = [...(mockupImage ? [mockupImage] : []), ...regularImages];

  // Abrir automáticamente según el tipo de imagen especial
  // Flujo: Rotating → MockUp (como imagen normal) → Imágenes Regulares
  useEffect(() => {
    if (safeImages.length > 0 && !isLoading && selectedImageIndex === null && !showRotating && !isViewerOpen) {
      if (rotatingImage) {
        // Prioridad 1: Rotating Image
        setShowRotating(true);
      } else if (allViewerImages.length > 0) {
        // Prioridad 2: ImageViewer normal (mockup como primera si existe + regulares)
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

  const handleBackToBeginning = () => {
    // Volver al inicio del ciclo (Rotating si existe, sino ImageViewer desde el índice 0)
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
    setShowRotating(false);
    if (rotatingImage) {
      setShowRotating(true);
    } else if (allViewerImages.length > 0) {
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    } else if (onBackToGroups) {
      onBackToGroups();
    }
  };

  const handleRotatingExit = () => {
    setShowRotating(false);
    
    // Después del Rotating, mostrar imágenes (mockup + regulares)
    if (allViewerImages.length > 0) {
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    } else {
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

  const handleGoToImage = (index) => {
    // Desde el RotatingViewer, ir directo a una imagen por índice
    setShowRotating(false);
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
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
      {/* Rotating Image Viewer - Rotación 3D */}
      {showRotating && rotatingImage && (
        <RotatingImageViewer
          rotatingImage={rotatingImage}
          onClose={handleRotatingExit}
          groupName={groupName}
          hasMockUp={false}
          hasRegularImages={allViewerImages.length > 0}
          onBackToMockUp={null}
          onNext={allViewerImages.length > 0 ? handleRotatingExit : null}
          totalImages={allViewerImages.length}
          onGoToImage={handleGoToImage}
        />
      )}

      {/* Image Viewer - mockup (primera) + imágenes regulares */}
      {isViewerOpen && selectedImageIndex !== null && !showRotating && (
        <ImageViewer
          images={allViewerImages}
          initialIndex={selectedImageIndex}
          onClose={handleCloseViewer}
          groupName={groupName}
          hasSpecialImage={!!rotatingImage}
          onBackToPrevious={rotatingImage ? handleBackToRotating : null}
          onBackToBeginning={rotatingImage ? handleBackToBeginning : null}
        />
      )}
    </>
  );
};

export default GroupImagesView;
