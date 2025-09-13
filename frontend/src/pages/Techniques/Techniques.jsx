import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

// Importar hooks personalizados
import {
  useDynamicGroups,
  useGroupImages,
  usePagination
} from "../../hooks";

// Importar componentes separados
import {
  CategoryGrid,
  GroupGrid,
  GroupImagesView,
  ImageCarousel,
  PaginationControls
} from "../../components/TechniquesComponents";

// Importar constantes
import { ITEMS_PER_PAGE } from "../../utils/constants";

const Techniques = () => {
  const location = useLocation();
  const categories = location.state?.categories || {};
  const initialTechnique = location.state?.categories?.title || "Dibujo";

  // Estado local para navegación
  const [selectedTechnique, setSelectedTechnique] = useState(initialTechnique);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [variantIndex, setVariantIndex] = useState(0);

  // Usar hooks personalizados para manejar el estado
  const dynamicGroups = useDynamicGroups();
  const groupImages = useGroupImages();
  const pagination = usePagination(ITEMS_PER_PAGE);

  // Funciones de manejo de eventos
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    dynamicGroups.loadDynamicGroups(selectedTechnique, category.name);
    pagination.resetPage();
  };

  const handleItemClick = (item) => {
    if (dynamicGroups.useDynamicImages) {
      setSelectedGroup(item);
      groupImages.loadGroupImages(
        selectedTechnique,
        selectedCategory.name,
        item.group_name
      );
    } else {
      setSelectedItem(item);
    }
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else if (selectedGroup) {
      setSelectedGroup(null);
      groupImages.resetGroupImages();
    } else if (selectedCategory) {
      setSelectedCategory(null);
      dynamicGroups.resetDynamicGroups();
      pagination.resetPage();
    }
  };

  // Calcular items paginados
  const getPaginatedItems = () => {
    if (!selectedCategory || selectedItem) return [];

    if (dynamicGroups.useDynamicImages && dynamicGroups.dynamicGroups.length > 0) {
      return pagination.paginate(dynamicGroups.dynamicGroups);
    } else if (!dynamicGroups.useDynamicImages && !dynamicGroups.showNoImagesMessage && selectedCategory && selectedCategory.collections) {
      const allItems = selectedCategory.collections.flatMap(
        (collection) => collection.items
      );
      return pagination.paginate(allItems);
    }
    return [];
  };

  const paginatedItems = getPaginatedItems();

  // Obtener información de paginación
  const getPaginationInfo = () => {
    if (dynamicGroups.useDynamicImages && dynamicGroups.dynamicGroups.length > 0) {
      return pagination.getPaginationInfo(dynamicGroups.dynamicGroups);
    } else if (!dynamicGroups.useDynamicImages && !dynamicGroups.showNoImagesMessage && selectedCategory && selectedCategory.collections) {
      const allItems = selectedCategory.collections.flatMap(
        (collection) => collection.items
      );
      return pagination.getPaginationInfo(allItems);
    }
    return pagination.getPaginationInfo([]);
  };

  const paginationInfo = getPaginationInfo();

  return (
    <Box
      mt={10}
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      color="white"
    >
      {/* Botón de volver */}
      {(selectedCategory || selectedItem) && (
        <button onClick={handleBack} style={{ marginBottom: 20 }}>
          Volver
        </button>
      )}

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        width="100%"
        maxWidth="800px"
        minHeight="320px"
      >
        {/* Mostrar categorías */}
        {!selectedCategory && !selectedGroup && categories.categoria && (
          <CategoryGrid
            categories={categories.categoria}
            onCategoryClick={handleCategoryClick}
          />
        )}

        {/* Mostrar grupos paginados */}
        {selectedCategory && !selectedItem && !selectedGroup && (
          <GroupGrid
            groups={paginatedItems}
            isLoading={dynamicGroups.isLoadingDynamic}
            showNoImagesMessage={dynamicGroups.showNoImagesMessage}
            onGroupClick={handleItemClick}
            paginationControls={
              <PaginationControls
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={pagination.setPage}
              />
            }
          />
        )}

        {/* Mostrar imágenes del grupo seleccionado */}
        {selectedGroup && (
          <GroupImagesView
            groupName={selectedGroup.group_name}
            images={groupImages.images}
            isLoading={groupImages.isLoading}
            onImageClick={(image) => {
              console.log('Imagen clickeada:', image);
            }}
          />
        )}
      </Box>

      {/* Controles de paginación */}
      {selectedCategory && !selectedItem && !selectedGroup && paginatedItems.length > 0 && paginationInfo.totalPages > 1 && (
        <PaginationControls
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={pagination.setPage}
        />
      )}

      {/* Carrusel de variantes */}
      {selectedItem && selectedItem.variants && (
        <ImageCarousel
          selectedItem={selectedItem}
          onBack={handleBack}
        />
      )}
    </Box>
  );
};

export default Techniques;