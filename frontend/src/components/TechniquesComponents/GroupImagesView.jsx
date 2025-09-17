import React, { useState, useEffect } from 'react';
import { Typography, Box } from "@mui/material";
import { ImageViewer } from './index';

const GroupImagesView = ({
  groupName,
  images = [],
  isLoading,
  onBackToGroups
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Asegurar que images sea un array
  const safeImages = Array.isArray(images) ? images : [];

  // Abrir automáticamente el viewer cuando hay imágenes disponibles
  useEffect(() => {
    if (safeImages.length > 0 && !isLoading && selectedImageIndex === null) {
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    }
  }, [safeImages.length, isLoading]);

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
    // Llamar al callback para volver a los grupos
    if (onBackToGroups) {
      onBackToGroups();
    }
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
      {/* Modal del visor de imágenes - se abre automáticamente */}
      {isViewerOpen && selectedImageIndex !== null && (
        <ImageViewer
          images={safeImages}
          initialIndex={selectedImageIndex}
          onClose={handleCloseViewer}
          groupName={groupName}
        />
      )}
    </>
  );
};

export default GroupImagesView;
