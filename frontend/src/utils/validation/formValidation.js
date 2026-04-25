/**
 * Utilidades de validación para formularios
 */

// Constantes de validación
export const VALIDATION_CONSTANTS = {
  MAX_NAME_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 100,
  ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

/**
 * Valida si un archivo tiene una extensión permitida
 * @param {File} file - Archivo a validar
 * @returns {boolean} - True si es válido
 */
export const isValidFileType = (file) => {
  if (!file) return false;

  const fileName = file.name || '';
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  return VALIDATION_CONSTANTS.ALLOWED_FILE_TYPES.includes(fileExtension);
};

/**
 * Valida si un archivo no excede el tamaño máximo
 * @param {File} file - Archivo a validar
 * @returns {boolean} - True si es válido
 */
export const isValidFileSize = (file) => {
  if (!file) return false;

  return file.size <= VALIDATION_CONSTANTS.MAX_FILE_SIZE;
};

/**
 * Valida si un texto tiene longitud válida
 * @param {string} text - Texto a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {boolean} - True si es válido
 */
export const isValidTextLength = (text, maxLength) => {
  if (!text) return false;

  return text.trim().length > 0 && text.length <= maxLength;
};

/**
 * Valida si una cadena no está vacía
 * @param {string} value - Valor a validar
 * @returns {boolean} - True si es válido
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Valida el formulario de subida completo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Resultado de validación con errores
 */
export const validateUploadForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Validar técnica seleccionada
  if (!isNotEmpty(formData.selectedTechnique)) {
    errors.selectedTechnique = "Debe seleccionar una técnica";
    isValid = false;
  }

  // Validar categoría seleccionada
  if (!isNotEmpty(formData.selectedCategory)) {
    errors.selectedCategory = "Debe seleccionar una categoría";
    isValid = false;
  }

  // Validar nombre de imagen (solo obligatorio para grupo nuevo o subida única)
  const isMultipleUpload = formData.grupoExistente === true && formData.imageFiles && formData.imageFiles.length > 0;
  if (!isMultipleUpload && !isValidTextLength(formData.imageName, VALIDATION_CONSTANTS.MAX_NAME_LENGTH)) {
    errors.imageName = `El nombre debe tener entre 1 y ${VALIDATION_CONSTANTS.MAX_NAME_LENGTH} caracteres`;
    isValid = false;
  }

  // Validar descripción (opcional para subida múltiple)
  if (!isMultipleUpload && !isValidTextLength(formData.descriptionImage, VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH)) {
    errors.descriptionImage = `La descripción debe tener entre 1 y ${VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH} caracteres`;
    isValid = false;
  }

  // Validar archivo(s)
  // Si es grupo existente y hay múltiples archivos, validar array
  if (formData.grupoExistente === true && formData.imageFiles && formData.imageFiles.length > 0) {
    // Validar múltiples archivos (grupo existente)
    if (formData.imageFiles.length > 5) {
      errors.imageFiles = "No se pueden subir más de 5 archivos a la vez";
      isValid = false;
    }
  } else if (!formData.imageFile) {
    // Validar archivo único (grupo nuevo)
    errors.imageFile = "Debe seleccionar un archivo";
    isValid = false;
  } else {
    if (!isValidFileType(formData.imageFile)) {
      errors.imageFile = "Solo se permiten archivos .jpg, .jpeg o .png";
      isValid = false;
    }

    if (!isValidFileSize(formData.imageFile)) {
      errors.imageFile = "El archivo no debe superar los 10MB";
      isValid = false;
    }
  }

  // Validar selección de grupo
  if (formData.grupoExistente === null) {
    errors.grupoExistente = "Debe seleccionar si el grupo existe o no";
    isValid = false;
  } else if (formData.grupoExistente === true) {
    if (!isNotEmpty(formData.grupoSeleccionado)) {
      errors.grupoSeleccionado = "Debe seleccionar un grupo existente";
      isValid = false;
    }
  } else if (formData.grupoExistente === false) {
    if (!isNotEmpty(formData.nombreNuevoGrupo)) {
      errors.nombreNuevoGrupo = "Debe ingresar el nombre del nuevo grupo";
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
    hasErrors: Object.keys(errors).length > 0
  };
};

/**
 * Valida el formulario de eliminación
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Resultado de validación con errores
 */
export const validateDeleteForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Validar técnica seleccionada
  if (!isNotEmpty(formData.selectedTechnique)) {
    errors.selectedTechnique = "Debe seleccionar una técnica";
    isValid = false;
  }

  // Validar categoría seleccionada
  if (!isNotEmpty(formData.selectedCategory)) {
    errors.selectedCategory = "Debe seleccionar una categoría";
    isValid = false;
  }

  // Validar que se haya seleccionado si eliminar grupo o imagen
  if (formData.deleteEntireGroup === null) {
    errors.deleteEntireGroup = "Debe seleccionar si eliminar grupo completo o imagen específica";
    isValid = false;
  }

  // Validar grupo seleccionado
  if (!isNotEmpty(formData.selectedGroup)) {
    errors.selectedGroup = "Debe seleccionar un grupo";
    isValid = false;
  }

  // Si NO se elimina grupo completo, validar que se haya seleccionado una imagen
  if (formData.deleteEntireGroup === false && !formData.selectedImageId) {
    errors.selectedImageId = "Debe seleccionar una imagen";
    isValid = false;
  }

  return {
    isValid,
    errors,
    hasErrors: Object.keys(errors).length > 0
  };
};

/**
 * Obtiene las categorías disponibles para una técnica
 * @param {string} technique - Nombre de la técnica
 * @param {Array} techniques - Array de técnicas disponibles
 * @returns {Array} - Array de categorías
 */
export const getCategoriesForTechnique = (technique, techniques) => {
  if (!technique || !techniques) return [];

  const found = techniques.find(t => t.title === technique);
  return found ? found.categoria : [];
};

/**
 * Valida si una clave de acceso es correcta
 * @param {string} key - Clave a validar
 * @param {string} expectedKey - Clave esperada
 * @returns {boolean} - True si es válida
 */
export const validateAccessKey = (key, expectedKey) => {
  return key === expectedKey;
};

/**
 * Sanitiza el texto removiendo caracteres peligrosos
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
export const sanitizeText = (text) => {
  if (!text) return '';

  return text
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML
    .replace(/javascript:/gi, '') // Remover javascript:
    .slice(0, 1000); // Limitar longitud
};

/**
 * Valida y formatea el nombre de archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {string} - Nombre formateado y validado
 */
export const formatFileName = (fileName) => {
  if (!fileName) return '';

  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Solo caracteres seguros
    .toLowerCase()
    .slice(0, 100); // Limitar longitud
};
