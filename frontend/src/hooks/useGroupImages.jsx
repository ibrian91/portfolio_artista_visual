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
      const images = await ApiService.getImagesByGroup(technique, category, groupName);
      console.log('✅ API Response (array):', images);

      // ApiService ahora devuelve directamente el array de imágenes
      if (Array.isArray(images) && images.length > 0) {
        setGroupImages(images);
      } else {
        setGroupImages([]);
        console.log('📝 No images found or empty array');
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
