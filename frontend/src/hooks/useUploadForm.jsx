import { useState } from "react";
import {
  VALIDATION_CONSTANTS,
  validateUploadForm,
  isValidFileType,
  isValidFileSize,
  sanitizeText
} from "../utils/validation/formValidation.js";

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
  });

  // Estados de UI
  const [nameImageCount, setNameImageCount] = useState(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
  const [descriptionImageCount, setDescriptionImageCount] = useState(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);
  const [uploadKeyError, setUploadKeyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Función para actualizar campos del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función para manejar cambios en inputs de texto con límite
  const handleTextChange = (field, value, maxLength, setCount) => {
    const sanitizedValue = sanitizeText(value);
    if (sanitizedValue.length > maxLength) {
      value = sanitizedValue.slice(0, maxLength);
    } else {
      value = sanitizedValue;
    }
    updateField(field, value);
    setCount(maxLength - value.length);
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

  // Validación del formulario usando función auxiliar
  const validation = validateUploadForm(formData);
  const isFormValid = validation.isValid;

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

    const formDataToSend = new FormData();
    formDataToSend.append("technique_name", formData.selectedTechnique);
    formDataToSend.append("category_name", formData.selectedCategory);
    formDataToSend.append("image_name", formData.imageName);
    formDataToSend.append("description", formData.descriptionImage);
    formDataToSend.append("is_mockup_image", formData.isMockupImage);
    formDataToSend.append("is_rotating_image", formData.isRotatingImage);
    formDataToSend.append("upload_key", formData.uploadKey);
    formDataToSend.append("images", formData.imageFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload/portfolio-image", {
        method: "POST",
        body: formDataToSend,
        headers: {
          "x-upload-key": formData.uploadKey
        }
      });

      if (response.status === 401) {
        setUploadKeyError("Clave no válida");
        return false;
      }

      if (response.status === 201) {
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
        });
        setNameImageCount(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
        setDescriptionImageCount(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);
        return true;
      }

      setUploadKeyError("Error al subir la imagen");
      return false;
    } catch (error) {
      setUploadKeyError("Error de red o servidor");
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
    updateField,
    handleTextChange,
    handleTechniqueChange,
    handleExistingGroup,
    handleNewGroup,
    handleFileChange,
    uploadImage,
  };
};
