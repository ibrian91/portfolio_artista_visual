import React from 'react';
import { Card, Typography } from "@mui/material";
import { renderDynamicContent } from '../../utils/techniquesUtils';

const GroupGrid = ({
  groups,
  isLoading,
  showNoImagesMessage,
  onGroupClick,
  paginationControls
}) => {

  // Estado de carga
  if (isLoading) {
    return (
      <Card
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "150px",
          height: "155px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="subtitle1"
          color="white"
          sx={{
            textAlign: "center",
            padding: "10px",
            fontWeight: "bold",
          }}
        >
          Cargando...
        </Typography>
      </Card>
    );
  }

  // Grupos disponibles
  if (groups.length > 0) {
    return (
      <>
        {groups.map((group, idx) => (
          <Card
            key={idx}
            onClick={() => onGroupClick(group)}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              width: "150px",
              height: "155px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {renderDynamicContent(group)}
          </Card>
        ))}
        {paginationControls}
      </>
    );
  }

  // Mensaje cuando no hay imágenes
  if (showNoImagesMessage) {
    return (
      <Card
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "300px",
          height: "155px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="subtitle1"
          color="white"
          sx={{
            textAlign: "center",
            padding: "20px",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          No hay imágenes cargadas para esta categoría
        </Typography>
      </Card>
    );
  }

  // Estado vacío por defecto
  return null;
};

export default GroupGrid;
