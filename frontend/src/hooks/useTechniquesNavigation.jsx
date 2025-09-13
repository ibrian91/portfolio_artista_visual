import { useState } from 'react';

const useTechniquesNavigation = (initialTechnique) => {
  const [selectedTechnique, setSelectedTechnique] = useState(initialTechnique);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [variantIndex, setVariantIndex] = useState(0);

  const handleCategoryClick = (category, loadDynamicGroupsCallback) => {
    console.log('🖱️ Category clicked:', category);
    console.log('🎨 Current selectedTechnique:', selectedTechnique);
    console.log('📂 Category name:', category.name);

    setSelectedCategory(category);
    if (loadDynamicGroupsCallback) {
      loadDynamicGroupsCallback(selectedTechnique, category.name);
    }
  };

  const handleItemClick = (item, useDynamicImages, loadGroupImagesCallback) => {
    if (useDynamicImages) {
      console.log('🖱️ Group clicked:', item.group_name);
      setSelectedGroup(item);
      if (loadGroupImagesCallback) {
        loadGroupImagesCallback(selectedTechnique, selectedCategory.name, item.group_name);
      }
    } else {
      setSelectedItem(item);
    }
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
      setVariantIndex(0);
    } else if (selectedGroup) {
      setSelectedGroup(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const resetNavigation = () => {
    setSelectedCategory(null);
    setSelectedItem(null);
    setSelectedGroup(null);
    setVariantIndex(0);
  };

  return {
    // Estados
    selectedTechnique,
    selectedCategory,
    selectedItem,
    selectedGroup,
    variantIndex,
    setVariantIndex,

    // Funciones
    handleCategoryClick,
    handleItemClick,
    handleBack,
    resetNavigation,

    // Utilidades
    hasSelection: selectedCategory || selectedItem || selectedGroup,
    isViewingGroup: !!selectedGroup,
    isViewingItem: !!selectedItem,
  };
};

export default useTechniquesNavigation;
