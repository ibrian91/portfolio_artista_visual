import { useState, useEffect } from "react";
import { validateDeleteForm } from "../utils/validation/formValidation.js";
import ApiService from "../services/ApiService.js";

export const useDeleteFormV2 = () => {
  console.log('🔍🔍🔍 useDeleteFormV2 hook initialized - NEW FILE 🔍🔍🔍');
  
  // Estados del formulario de eliminación
  const [formData, setFormData] = useState({
    selectedTechnique: "",
    selectedCategory: "",
    deleteEntireGroup: null, // true = eliminar grupo completo, false = eliminar imagen específica
    selectedGroup: "",
    selectedImageId: "",
  });

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imagesError, setImagesError] = useState(null);

  // Función para actualizar campos del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función para manejar selección de técnica (resetea categoría)
  const handleTechniqueChange = (value) => {
    setFormData(prev => ({
      ...prev,
      selectedTechnique: value,
      selectedCategory: "",
      selectedGroup: "",
      selectedImageId: "",
      deleteEntireGroup: null
    }));
    setAvailableGroups([]);
    setAvailableImages([]);
  };

  // Función para manejar selección de categoría (carga grupos)
  const handleCategoryChange = (value) => {
    console.log('🔍 handleCategoryChange called with:', value);
    console.log('🔍 Previous formData:', formData);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        selectedCategory: value,
        selectedGroup: "",
        selectedImageId: "",
        deleteEntireGroup: null
      };
      console.log('🔍 New formData will be:', newData);
      return newData;
    });
    
    setAvailableImages([]);
  };

  // Efecto para cargar grupos cuando se selecciona técnica y categoría
  useEffect(() => {
    const fetchGroups = async () => {
      if (!formData.selectedTechnique || !formData.selectedCategory) {
        setAvailableGroups([]);
        return;
      }

      setIsLoadingGroups(true);
      setGroupsError(null);

      try {
        const groups = await ApiService.getGroups(
          formData.selectedTechnique,
          formData.selectedCategory
        );
        setAvailableGroups(groups || []);
      } catch (error) {
        console.error("Error al cargar grupos:", error);
        setGroupsError("Error al cargar los grupos");
        setAvailableGroups([]);
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [formData.selectedTechnique, formData.selectedCategory]);

  // Efecto para cargar imágenes cuando se selecciona un grupo (solo en modo eliminar imagen)
  useEffect(() => {
    const fetchImages = async () => {
      if (!formData.selectedGroup || formData.deleteEntireGroup !== false) {
        setAvailableImages([]);
        return;
      }

      setIsLoadingImages(true);
      setImagesError(null);

      try {
        const images = await ApiService.getImages(
          formData.selectedTechnique,
          formData.selectedCategory,
          formData.selectedGroup
        );
        setAvailableImages(images || []);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
        setImagesError("Error al cargar las imágenes");
        setAvailableImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [formData.selectedGroup, formData.deleteEntireGroup, formData.selectedTechnique, formData.selectedCategory]);

  // Función para eliminar imagen o grupo
  const deleteImage = async () => {
    // Validar formulario antes de enviar
    const validation = validateDeleteForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      if (formData.deleteEntireGroup) {
        // Eliminar grupo completo
        const confirmDelete = window.confirm(
          `⚠️ ¿Estás seguro de eliminar el grupo "${formData.selectedGroup}" con todas sus imágenes?\n\nEsta acción no se puede deshacer.`
        );
        
        if (!confirmDelete) {
          setIsSubmitting(false);
          return false;
        }

        await ApiService.deleteGroup(
          formData.selectedTechnique,
          formData.selectedCategory,
          formData.selectedGroup
        );
        
        alert(`✅ Grupo "${formData.selectedGroup}" eliminado correctamente`);
      } else {
        // Eliminar imagen específica
        const selectedImage = availableImages.find(img => img.id === parseInt(formData.selectedImageId));
        const confirmDelete = window.confirm(
          `⚠️ ¿Estás seguro de eliminar la imagen "${selectedImage?.image_name}"?\n\nEsta acción no se puede deshacer.`
        );
        
        if (!confirmDelete) {
          setIsSubmitting(false);
          return false;
        }

        await ApiService.deleteImage(
          formData.selectedImageId
        );
        
        alert(`✅ Imagen "${selectedImage?.image_name}" eliminada correctamente`);
      }

      // Limpiar formulario
      setFormData({
        selectedTechnique: "",
        selectedCategory: "",
        deleteEntireGroup: null,
        selectedGroup: "",
        selectedImageId: "",
      });
      setAvailableGroups([]);
      setAvailableImages([]);
      
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error('Error al eliminar:', error);
      
      if (error.response?.status === 401) {
        alert("❌ No autorizado");
      } else if (error.response?.status === 404) {
        alert("❌ No se encontró el elemento a eliminar");
      } else {
        alert("❌ Error al eliminar: " + (error.response?.data?.error || error.message));
      }
      
      setIsSubmitting(false);
      return false;
    }
  };

  // Validación del formulario usando función auxiliar
  const validation = validateDeleteForm(formData);
  const isFormValid = validation.isValid;

  const hookReturn = {
    formData,
    isSubmitting,
    isFormValid,
    validationErrors,
    availableGroups,
    isLoadingGroups,
    groupsError,
    availableImages,
    isLoadingImages,
    imagesError,
    updateField,
    handleTechniqueChange,
    handleCategoryChange,
    deleteImage,
  };
  
  console.log('🔍 useDeleteFormV2 returning:', Object.keys(hookReturn));
  console.log('🔍 handleCategoryChange type:', typeof handleCategoryChange);

  return hookReturn;
};
