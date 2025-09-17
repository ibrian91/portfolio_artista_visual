import React, { useState, useEffect } from 'react';
import { Card, Typography, Box } from "@mui/material";
import { ImageViewer } from './index';

const GroupImagesView = ({
  groupName,
  images = [],
  isLoading,
  onImageClick
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Asegurar que images sea un array
  const safeImages = Array.isArray(images) ? images : [];

  // Abrir automáticamente el viewer cuando hay imágenes disponibles
  useEffect(() => {
    if (safeImages.length > 0 && !isLoading && selectedImageIndex === null) {
      console.log('🚀 Abriendo ImageViewer automáticamente con', safeImages.length, 'imágenes');
      setSelectedImageIndex(0);
      setIsViewerOpen(true);
    }
  }, [safeImages.length, isLoading]);

  const handleImageClick = (image, index) => {
    console.log('🖼️ Click en imagen:', index, image.image_name);
    setSelectedImageIndex(index);
    setIsViewerOpen(true);

    // Mantener compatibilidad con onImageClick existente
    if (onImageClick) {
      onImageClick(image);
    }
  };

  const handleCloseViewer = () => {
    console.log('❌ Cerrando viewer');
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
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

  // Si no hay imágenes, mostrar mensaje
  if (safeImages.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
          eh papa pone imagen
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Vista de miniaturas (solo si el viewer está cerrado) */}
      {!isViewerOpen && (
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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

          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            width="100%"
          >
            {safeImages.map((image, idx) => (
              <Card
                key={idx}
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  width: "200px",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out",
                  '&:hover': {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(image, idx);
                }}
              >
                <img
                  src={`http://localhost:5000${image.file_url}`}
                  alt={image.image_name || `Imagen ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    console.error('❌ Error cargando imagen:', image.file_url);
                  }}
                />
                {image.description && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "5px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {image.description}
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Modal del visor de imágenes */}
      {isViewerOpen && selectedImageIndex !== null && (
        <>
          {console.log('🎯 Renderizando ImageViewer:', { isViewerOpen, selectedImageIndex, groupName })}
          <ImageViewer
            images={safeImages}
            initialIndex={selectedImageIndex}
            onClose={handleCloseViewer}
            groupName={groupName}
          />
        </>
      )}
    </>
  );
};

export default GroupImagesView;
