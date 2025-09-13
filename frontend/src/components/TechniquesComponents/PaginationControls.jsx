import React from 'react';
import { Box, Button } from "@mui/material";
import { MAX_VISIBLE_PAGES } from '../../utils/constants';

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const renderPageButtons = () => {
    const buttons = [];
    let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "contained" : "outlined"}
          size="small"
          onClick={() => onPageChange(i)}
          sx={{
            minWidth: 32,
            color: currentPage === i ? "#fff" : "#000",
            backgroundColor: currentPage === i ? "#000" : "#fff",
            borderColor: "#000",
            fontWeight: "bold",
            textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
            letterSpacing: 2,
            '&:hover': {
              backgroundColor: currentPage === i ? "#333" : "#f0f0f0",
            },
          }}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={2}
      gap={1}
      sx={{
        color: "#000",
        textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
        letterSpacing: 4,
        fontWeight: "bold",
        fontSize: "1.2rem",
      }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          color: "#000",
          borderColor: "#000",
          backgroundColor: "#fff",
          fontWeight: "bold",
          textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
          letterSpacing: 2,
          '&.Mui-disabled': {
            opacity: 0.5,
          },
          '&:hover': {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        Anterior
      </Button>

      {renderPageButtons()}

      <Button
        variant="outlined"
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{
          color: "#000",
          borderColor: "#000",
          backgroundColor: "#fff",
          fontWeight: "bold",
          textShadow: "0 2px 8px #fff, 2px 2px 4px rgba(0,0,0,0.4)",
          letterSpacing: 2,
          '&.Mui-disabled': {
            opacity: 0.5,
          },
          '&:hover': {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        Siguiente
      </Button>
    </Box>
  );
};

export default PaginationControls;
