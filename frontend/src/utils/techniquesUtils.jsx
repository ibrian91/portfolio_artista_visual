import React from 'react';

// Constantes
import { ITEMS_PER_PAGE } from './constants';

export { ITEMS_PER_PAGE };

// Función auxiliar para renderizar el contenido de una categoría
export const renderLogoContent = (element) => {
  if (element.image) {
    return (
      <img
        src={element.image}
        alt={element.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {element.name}
      </div>
    );
  }
};

// Función auxiliar para renderizar contenido dinámico de grupos
export const renderDynamicContent = (group) => {
  if (group.cover_image_url) {
    const imageUrl = `http://localhost:5000${group.cover_image_url}`;

    return (
      <img
        src={imageUrl}
        alt={group.group_name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        onError={(e) => {
          console.error('❌ Error cargando imagen:', imageUrl);
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {group.group_name}
      </div>
    );
  }
};
