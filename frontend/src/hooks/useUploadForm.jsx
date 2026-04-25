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
    imageFiles: [], // Array para subida masiva (grupo existente)
    imageFilesMetadata: [], // Array con {file, name, description} para cada archivo
    grupoExistente: null,
    grupoSeleccionado: "",
    nombreNuevoGrupo: "",
    isMockupImage: false,
    isRotatingImage: false,
    isSmallImage: false,
    descriptionImage: "",
    coverImageFile: null, // Nuevo campo para imagen de portada
  });

  // Estados de UI
  const [nameImageCount, setNameImageCount] = useState(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
  const [descriptionImageCount, setDescriptionImageCount] = useState(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);
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

  // Auto-seleccionar "nuevo grupo" cuando no hay grupos disponibles
  useEffect(() => {
    if (availableGroups.length === 0 && formData.selectedTechnique && formData.selectedCategory) {
      setFormData(prev => ({
        ...prev,
        grupoExistente: false,
        grupoSeleccionado: "",
        isMockupImage: false,
        isRotatingImage: false,
        isSmallImage: true
      }));
    }
  }, [availableGroups.length, formData.selectedTechnique, formData.selectedCategory]);

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
      nombreNuevoGrupo: "",
      imageFiles: [], // Limpiar archivos múltiples al cambiar a grupo existente
      imageFilesMetadata: [] // Limpiar metadata
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
      grupoSeleccionado: "",
      imageFiles: [], // Limpiar archivos múltiples al cambiar a grupo nuevo
      imageFilesMetadata: [] // Limpiar metadata
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
      // NO limpiar imageFiles/imageFilesMetadata en modo carga masiva
      // Solo limpiar si NO estamos en modo carga masiva (grupo existente + imagen chiquita)
      const isBulkUploadMode = formData.grupoExistente === true && formData.isSmallImage && !formData.isMockupImage && !formData.isRotatingImage;
      if (!isBulkUploadMode) {
        updateField("imageFiles", []); // Limpiar archivos múltiples solo si NO es modo masivo
        updateField("imageFilesMetadata", []); // Limpiar metadata solo si NO es modo masivo
      }
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

  // Función para manejar múltiples archivos (grupo existente)
  const handleMultipleFilesChange = (files, shouldAppend = true) => {
    const MAX_FILES = 5;
    const newFileArray = Array.from(files);
    
    // Si shouldAppend es true, combinar con archivos existentes
    const existingMetadata = shouldAppend ? formData.imageFilesMetadata : [];
    const combinedLength = existingMetadata.length + newFileArray.length;
    
    // Verificar que no exceda el máximo
    if (combinedLength > MAX_FILES) {
      setValidationErrors(prev => ({
        ...prev,
        imageFiles: `Solo puedes subir hasta ${MAX_FILES} archivos. Ya tienes ${existingMetadata.length} seleccionados.`
      }));
      return;
    }
    
    const errors = [];
    const validFilesMetadata = [];

    newFileArray.forEach((file, index) => {
      if (!isValidFileType(file)) {
        errors.push(`${file.name}: Solo se permiten .jpg, .jpeg o .png`);
      } else if (!isValidFileSize(file)) {
        errors.push(`${file.name}: No debe superar 10MB`);
      } else {
        // Crear metadata para cada archivo con nombre por defecto
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        validFilesMetadata.push({
          file: file,
          name: fileNameWithoutExt,
          description: ""
        });
      }
    });

    if (errors.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        imageFiles: errors.join(". ")
      }));
      // Agregar solo los archivos válidos
      const newMetadata = [...existingMetadata, ...validFilesMetadata];
      updateField("imageFilesMetadata", newMetadata);
      updateField("imageFiles", newMetadata.map(m => m.file)); // Mantener array simple para compatibilidad
      updateField("imageFile", null); // Limpiar archivo individual
    } else {
      const newMetadata = [...existingMetadata, ...validFilesMetadata];
      updateField("imageFilesMetadata", newMetadata);
      updateField("imageFiles", newMetadata.map(m => m.file)); // Mantener array simple para compatibilidad
      updateField("imageFile", null); // Limpiar archivo individual
      setValidationErrors(prev => ({
        ...prev,
        imageFiles: null
      }));
    }
  };

  // Función para eliminar un archivo de la selección
  const removeFileFromSelection = (index) => {
    const newMetadata = formData.imageFilesMetadata.filter((_, idx) => idx !== index);
    updateField("imageFilesMetadata", newMetadata);
    updateField("imageFiles", newMetadata.map(m => m.file));
    
    // Limpiar error si ya no hay problema
    if (newMetadata.length <= 5) {
      setValidationErrors(prev => ({
        ...prev,
        imageFiles: null
      }));
    }
  };

  // Función para actualizar nombre de un archivo específico
  const updateFileMetadata = (index, field, value) => {
    const newMetadata = [...formData.imageFilesMetadata];
    newMetadata[index] = {
      ...newMetadata[index],
      [field]: value
    };
    updateField("imageFilesMetadata", newMetadata);
  };

  // Función para agregar imagen actual a la cola (para carga masiva)
  const addImageToQueue = () => {
    // Validar que haya archivo, nombre y descripción
    if (!formData.imageFile) {
      setValidationErrors(prev => ({ ...prev, imageFile: "Debes seleccionar un archivo" }));
      return false;
    }
    if (!formData.imageName || formData.imageName.trim() === "") {
      setValidationErrors(prev => ({ ...prev, imageName: "El nombre es obligatorio" }));
      return false;
    }

    // Verificar límite de 5 imágenes
    if (formData.imageFilesMetadata.length >= 5) {
      alert("⚠️ Ya tienes 5 imágenes en la cola. Sube estas primero antes de agregar más.");
      return false;
    }

    // Agregar a la cola
    const newMetadata = {
      file: formData.imageFile,
      name: formData.imageName,
      description: formData.descriptionImage
    };

    setFormData(prev => ({
      ...prev,
      imageFilesMetadata: [...prev.imageFilesMetadata, newMetadata],
      imageFiles: [...prev.imageFiles, formData.imageFile],
      // Limpiar campos para la siguiente imagen
      imageFile: null,
      imageName: "",
      descriptionImage: ""
    }));

    // Limpiar errores
    setValidationErrors({});
    
    return true;
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

      // Determinar si es subida múltiple (grupo existente con varios archivos)
      const isMultipleUpload = formData.grupoExistente === true && formData.imageFilesMetadata.length > 0;
      const itemsToUpload = isMultipleUpload 
        ? formData.imageFilesMetadata 
        : [{ file: formData.imageFile, name: formData.imageName, description: formData.descriptionImage }];
      
      let successCount = 0;
      let failCount = 0;

      // Subir cada archivo
      for (let i = 0; i < itemsToUpload.length; i++) {
        const item = itemsToUpload[i];
        if (!item.file) continue;

        try {
          const formDataToSend = new FormData();
          formDataToSend.append("technique", formData.selectedTechnique);
          formDataToSend.append("category", formData.selectedCategory);
          formDataToSend.append("group_name", formData.grupoExistente === true ? formData.grupoSeleccionado : formData.nombreNuevoGrupo);
          
          // Usar nombre y descripción del item (metadata o formulario individual)
          formDataToSend.append("image_name", item.name);
          formDataToSend.append("description", item.description || "");
          formDataToSend.append("is_mockup_image", formData.isMockupImage);
          formDataToSend.append("is_rotating_image", formData.isRotatingImage);
          formDataToSend.append("is_small_image", formData.isSmallImage);
          formDataToSend.append("upload_key", formData.uploadKey);
          formDataToSend.append("image", item.file);

          // Subir la imagen usando el servicio
          await ApiService.uploadImage(formDataToSend);
          successCount++;
        } catch (fileError) {
          console.error(`Error subiendo archivo ${i + 1}:`, fileError);
          failCount++;
        }
      }

      // Mostrar mensaje de resultado
      if (isMultipleUpload) {
        if (failCount === 0) {
          alert(`✅ ${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''} correctamente`);
        } else {
          alert(`⚠️ ${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''} correctamente, ${failCount} fallaron`);
        }
      } else {
        alert("Imagen subida correctamente");
      }

      // Limpiar formulario
      setFormData({
        selectedTechnique: "",
        selectedCategory: "",
        imageName: "",
        imageFile: null,
        imageFiles: [],
        imageFilesMetadata: [],
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
    isSubmitting,
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
    handleMultipleFilesChange,
    removeFileFromSelection,
    updateFileMetadata,
    addImageToQueue,
    resetCounters: () => {
      setNameImageCount(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
      setDescriptionImageCount(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);
    },
    uploadImage,
  };
};
