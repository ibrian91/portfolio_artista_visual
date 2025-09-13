import React from 'react';
import { Box, Typography, Button } from "@mui/material";

const ImageCarousel = ({
  item,
  variantIndex,
  onVariantChange,
  onBack
}) => {
  if (!item?.variants || item.variants.length === 0) {
    return null;
  }

  const currentVariant = item.variants[variantIndex];

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bgcolor="black"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        onClick={onBack}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10000,
          background: "white",
          color: "black",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          '&:hover': {
            background: "#f0f0f0",
          },
        }}
      >
        Volver
      </Button>

      <Box
        position="relative"
        width="80vw"
        height="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          onClick={() => onVariantChange((prev) =>
            prev === 0 ? item.variants.length - 1 : prev - 1
          )}
          sx={{
            position: "absolute",
            left: 0,
            zIndex: 10000,
            background: "transparent",
            color: "white",
            fontSize: "3rem",
            cursor: "pointer",
            minWidth: "auto",
            padding: "20px",
            '&:hover': {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          ◀
        </Button>

        <img
          src={currentVariant.image}
          alt={currentVariant.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />

        <Button
          onClick={() => onVariantChange((prev) =>
            prev === item.variants.length - 1 ? 0 : prev + 1
          )}
          sx={{
            position: "absolute",
            right: 0,
            zIndex: 10000,
            background: "transparent",
            color: "white",
            fontSize: "3rem",
            cursor: "pointer",
            minWidth: "auto",
            padding: "20px",
            '&:hover': {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          ▶
        </Button>
      </Box>

      <Typography
        variant="subtitle1"
        color="white"
        mt={2}
        textAlign="center"
        maxWidth="80vw"
        sx={{
          textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
        }}
      >
        {currentVariant.name}
      </Typography>
    </Box>
  );
};

export default ImageCarousel;
