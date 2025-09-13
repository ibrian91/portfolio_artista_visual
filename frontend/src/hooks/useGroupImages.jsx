import { useState } from 'react';
import ApiService from '../services/ApiService.js';

const useGroupImages = () => {
  const [groupImages, setGroupImages] = useState([]);
  const [isLoadingGroupImages, setIsLoadingGroupImages] = useState(false);

  const loadGroupImages = async (technique, category, groupName) => {
    console.log('🔍 loadGroupImages called with:', { technique, category, groupName });
    setIsLoadingGroupImages(true);

    try {
      console.log('📡 Making API call to getImagesByGroup...');
      const response = await ApiService.getImagesByGroup(technique, category, groupName);
      console.log('✅ API Response:', response);

      if (response.images && response.images.length > 0) {
        setGroupImages(response.images);
      } else {
        setGroupImages([]);
        if (response.message) {
          console.log('📝 Backend message:', response.message);
        }
      }
    } catch (error) {
      console.error('❌ Error cargando imágenes del grupo:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setGroupImages([]);
    } finally {
      setIsLoadingGroupImages(false);
    }
  };

  const resetGroupImages = () => {
    setGroupImages([]);
    setIsLoadingGroupImages(false);
  };

  return {
    // Estados
    images: groupImages,
    isLoading: isLoadingGroupImages,

    // Funciones
    loadGroupImages,
    resetGroupImages,

    // Utilidades
    hasImages: groupImages.length > 0,
  };
};

export default useGroupImages;
