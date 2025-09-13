import { useState } from 'react';
import ApiService from '../services/ApiService.js';

const useDynamicGroups = () => {
  const [dynamicGroups, setDynamicGroups] = useState([]);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);
  const [useDynamicImages, setUseDynamicImages] = useState(false);
  const [showNoImagesMessage, setShowNoImagesMessage] = useState(false);

  const loadDynamicGroups = async (technique, category) => {
    console.log('🔍 loadDynamicGroups called with:', { technique, category });
    setIsLoadingDynamic(true);
    setShowNoImagesMessage(false);

    try {
      console.log('📡 Making API call to getGroupsWithCovers...');
      const groups = await ApiService.getGroupsWithCovers(technique, category);
      console.log('✅ API Response:', groups);

      if (groups && groups.length > 0) {
        console.log('📸 Setting dynamic groups:', groups.length, 'groups found');
        setDynamicGroups(groups);
        setUseDynamicImages(true);
        setShowNoImagesMessage(false);
      } else {
        console.log('❌ No groups found, showing "no images" message');
        setDynamicGroups([]);
        setUseDynamicImages(false);
        setShowNoImagesMessage(true);
      }
    } catch (error) {
      console.error('❌ Error cargando grupos dinámicos:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setDynamicGroups([]);
      setUseDynamicImages(false);
      setShowNoImagesMessage(true);
    } finally {
      setIsLoadingDynamic(false);
    }
  };

  const resetDynamicGroups = () => {
    setDynamicGroups([]);
    setIsLoadingDynamic(false);
    setUseDynamicImages(false);
    setShowNoImagesMessage(false);
  };

  return {
    // Estados
    dynamicGroups,
    isLoadingDynamic,
    useDynamicImages,
    showNoImagesMessage,

    // Funciones
    loadDynamicGroups,
    resetDynamicGroups,

    // Utilidades
    hasDynamicGroups: dynamicGroups.length > 0,
  };
};

export default useDynamicGroups;
