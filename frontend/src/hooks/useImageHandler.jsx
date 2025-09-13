// Hook para manejo de imágenes
import { useState, useCallback } from 'react';

const useImageHandler = () => {
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = useCallback((imageUrl) => {
    console.error('❌ Error cargando imagen:', imageUrl);
    setImageErrors(prev => new Set([...prev, imageUrl]));
  }, []);

  const isImageBroken = useCallback((imageUrl) => {
    return imageErrors.has(imageUrl);
  }, [imageErrors]);

  const clearImageErrors = useCallback(() => {
    setImageErrors(new Set());
  }, []);

  const getImageUrl = useCallback((relativeUrl) => {
    if (!relativeUrl) return '';
    return `http://localhost:5000${relativeUrl}`;
  }, []);

  const preloadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }, []);

  return {
    handleImageError,
    isImageBroken,
    clearImageErrors,
    getImageUrl,
    preloadImage,
    brokenImagesCount: imageErrors.size,
  };
};

export default useImageHandler;
