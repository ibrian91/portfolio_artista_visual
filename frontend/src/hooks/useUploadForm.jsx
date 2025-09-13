import { useState, useEffect } from "react";
import {
  VALIDATION_CONSTANTS,
  validateUploadForm,
  isValidFileType,
  isValidFileSize,
  sanitizeText
} from "../utils/validation/formValidation.js";
import ApiService from "../services/ApiService.js";

export const useUploadForm = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    selectedTechnique: "",
    selectedCategory: "",
    imageName: "",
    imageFile: null,
    grupoExistente: null,
    grupoSeleccionado: "",
    nombreNuevoGrupo: "",
    isMockupImage: false,
    isRotatingImage: false,
    isSmallImage: false,
    uploadKey: "",
    descriptionImage: "",
    coverImageFile: null, // Nuevo campo para imagen de portada
  });

  // Estados de UI
  const [nameImageCount, setNameImageCount] = useState(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
  const [descriptionImageCount, setDescriptionImageCount] = useState(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);
  const [uploadKeyError, setUploadKeyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estados para grupos dinámicos
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState("");

  // Función para cargar grupos dinámicamente
  const loadGroups = async () => {
    if (!formData.selectedTechnique || !formData.selectedCategory) {
      setAvailableGroups([]);
      return;
    }

    setIsLoadingGroups(true);
    setGroupsError("");

    try {
      const groups = await ApiService.getGroupsWithCovers(formData.selectedTechnique, formData.selectedCategory);
      setAvailableGroups(groups);
    } catch (error) {
      console.error('Error cargando grupos:', error);
      setGroupsError("Error al cargar los grupos disponibles");
      setAvailableGroups([]);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Cargar grupos cuando cambien técnica o categoría
  useEffect(() => {
    loadGroups();
  }, [formData.selectedTechnique, formData.selectedCategory]);

  // Función para actualizar campos del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función para manejar cambios en inputs de texto con límite
  const handleTextChange = (field, value, maxLength, setCount) => {
    // No sanitizar espacios - permitir que el usuario escriba normalmente
    const cleanValue = value.slice(0, maxLength);
    updateField(field, cleanValue);
    if (setCount) {
      setCount(maxLength - cleanValue.length);
    }
  };

  // Función para manejar selección de técnica (resetea categoría)
  const handleTechniqueChange = (value) => {
    setFormData(prev => ({
      ...prev,
      selectedTechnique: value,
      selectedCategory: ""
    }));
  };

  // Función para manejar selección de grupo existente
  const handleExistingGroup = () => {
    setFormData(prev => ({
      ...prev,
      grupoExistente: true,
      isMockupImage: false,
      isRotatingImage: false,
      isSmallImage: false,
      nombreNuevoGrupo: ""
    }));
  };

  // Función para manejar selección de grupo nuevo
  const handleNewGroup = () => {
    setFormData(prev => ({
      ...prev,
      grupoExistente: false,
      isMockupImage: false,
      isRotatingImage: false,
      isSmallImage: true, // chiquita por defecto
      grupoSeleccionado: ""
    }));
  };

  // Función para manejar archivo
  const handleFileChange = (file) => {
    if (file) {
      if (!isValidFileType(file)) {
        updateField("imageFile", null);
        setValidationErrors(prev => ({
          ...prev,
          imageFile: "Solo se permiten archivos .jpg, .jpeg o .png"
        }));
        return;
      }

      if (!isValidFileSize(file)) {
        updateField("imageFile", null);
        setValidationErrors(prev => ({
          ...prev,
          imageFile: "El archivo no debe superar los 10MB"
        }));
        return;
      }

      updateField("imageFile", file);
      setValidationErrors(prev => ({
        ...prev,
        imageFile: null
      }));
    } else {
      updateField("imageFile", null);
      setValidationErrors(prev => ({
        ...prev,
        imageFile: null
      }));
    }
  };

  // Función para manejar imagen de portada
  const handleCoverFileChange = (file) => {
    if (file) {
      if (!isValidFileType(file)) {
        updateField("coverImageFile", null);
        setValidationErrors(prev => ({
          ...prev,
          coverImageFile: "Solo se permiten archivos .jpg, .jpeg o .png"
        }));
        return;
      }

      if (!isValidFileSize(file)) {
        updateField("coverImageFile", null);
        setValidationErrors(prev => ({
          ...prev,
          coverImageFile: "El archivo no debe superar los 10MB"
        }));
        return;
      }

      updateField("coverImageFile", file);
      setValidationErrors(prev => ({
        ...prev,
        coverImageFile: null
      }));
    } else {
      updateField("coverImageFile", null);
      setValidationErrors(prev => ({
        ...prev,
        coverImageFile: null
      }));
    }
  };

  // Validación del formulario usando función auxiliar
  const validation = validateUploadForm(formData);
  const isFormValid = validation.isValid;

  // Función para verificar si un grupo ya existe
  const checkGroupExists = (groupName) => {
    return availableGroups.some(group => group.group_name === groupName);
  };

  // Función para subir imagen
  const uploadImage = async () => {
    // Validar formulario antes de enviar
    const validation = validateUploadForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    setUploadKeyError("");
    setValidationErrors({});

    try {
      // Si es un grupo nuevo, verificar que no exista antes de crearlo
      if (formData.grupoExistente === false) {
        if (checkGroupExists(formData.nombreNuevoGrupo)) {
          setUploadKeyError(`El grupo "${formData.nombreNuevoGrupo}" ya existe. Por favor, elige un nombre diferente o selecciona este grupo de la lista de grupos existentes.`);
          return false;
        }

        const coverImage = formData.coverImageFile || formData.imageFile; // Usar imagen de portada específica o la imagen principal
        await ApiService.createGroupWithCover({
          technique: formData.selectedTechnique,
          category: formData.selectedCategory,
          group_name: formData.nombreNuevoGrupo,
          upload_key: formData.uploadKey
        }, coverImage);
      }

      // Preparar FormData para la subida
      const formDataToSend = new FormData();
      formDataToSend.append("technique", formData.selectedTechnique);
      formDataToSend.append("category", formData.selectedCategory);
      formDataToSend.append("group_name", formData.grupoExistente === true ? formData.grupoSeleccionado : formData.nombreNuevoGrupo);
      formDataToSend.append("image_name", formData.imageName);
      formDataToSend.append("description", formData.descriptionImage);
      formDataToSend.append("is_mockup_image", formData.isMockupImage);
      formDataToSend.append("is_rotating_image", formData.isRotatingImage);
      formDataToSend.append("is_small_image", formData.isSmallImage);
      formDataToSend.append("upload_key", formData.uploadKey);
      formDataToSend.append("image", formData.imageFile);

      // Subir la imagen usando el servicio
      const result = await ApiService.uploadImage(formDataToSend);

      alert("Imagen subida correctamente");

      // Limpiar formulario
      setFormData({
        selectedTechnique: "",
        selectedCategory: "",
        imageName: "",
        imageFile: null,
        grupoExistente: null,
        grupoSeleccionado: "",
        nombreNuevoGrupo: "",
        isMockupImage: false,
        isRotatingImage: false,
        isSmallImage: false,
        uploadKey: "",
        descriptionImage: "",
        coverImageFile: null,
      });
      // Resetear contadores usando las funciones del componente padre
      if (typeof window !== 'undefined' && window.resetCounters) {
        window.resetCounters();
      }
      return true;
    } catch (error) {
      console.error('Error en uploadImage:', error);

      // Manejar errores específicos
      if (error.response?.status === 409) {
        setUploadKeyError(`El grupo "${formData.nombreNuevoGrupo}" ya existe en ${formData.selectedTechnique} > ${formData.selectedCategory}. Por favor, elige un nombre diferente o selecciona "Grupo existente".`);
      } else if (error.response?.status === 401) {
        setUploadKeyError("Clave de acceso incorrecta. Verifica tu clave de subida.");
      } else if (error.response?.status === 400) {
        setUploadKeyError(error.response?.data?.error || "Datos inválidos. Verifica la información del formulario.");
      } else {
        setUploadKeyError(error.message || "Error al subir la imagen");
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    nameImageCount,
    descriptionImageCount,
    uploadKeyError,
    isSubmitting,
    isFormValid,
    validationErrors,
    availableGroups,
    isLoadingGroups,
    groupsError,
    updateField,
    handleTextChange,
    handleTechniqueChange,
    handleExistingGroup,
    handleNewGroup,
    handleFileChange,
    handleCoverFileChange,
    resetCounters: () => {
      setNameImageCount(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
      setDescriptionImageCount(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);
    },
    uploadImage,
  };
};
