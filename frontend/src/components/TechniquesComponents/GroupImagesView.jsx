import React from 'react';
import { Card, Typography, Box } from "@mui/material";

const GroupImagesView = ({
  groupName,
  images = [],
  isLoading,
  onImageClick
}) => {
  // Asegurar que images sea un array
  const safeImages = Array.isArray(images) ? images : [];
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

      {isLoading ? (
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
      ) : safeImages.length > 0 ? (
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
              }}
              onClick={() => onImageClick?.(image)}
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
      ) : (
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
      )}
    </Box>
  );
};

export default GroupImagesView;
