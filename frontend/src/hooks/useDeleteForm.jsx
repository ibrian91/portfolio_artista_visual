import { useState } from "react";
import { validateDeleteForm } from "../utils/validation/formValidation.js";

export const useDeleteForm = () => {
  // Estados del formulario de eliminación
  const [formData, setFormData] = useState({
    selectedTechnique: "",
    selectedCategory: "",
    imageName: "",
    uploadKey: "",
  });

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Función para actualizar campos del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función para manejar selección de técnica (resetea categoría)
  const handleTechniqueChange = (value) => {
    setFormData(prev => ({
      ...prev,
      selectedTechnique: value,
      selectedCategory: ""
    }));
  };

  // Función para eliminar imagen
  const deleteImage = async () => {
    // Validar formulario antes de enviar
    const validation = validateDeleteForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    // TODO: Implementar endpoint de eliminación
    alert("Funcionalidad de eliminación próximamente disponible");

    setIsSubmitting(false);
    return false;
  };

  // Validación del formulario usando función auxiliar
  const validation = validateDeleteForm(formData);
  const isFormValid = validation.isValid;

  return {
    formData,
    isSubmitting,
    isFormValid,
    validationErrors,
    updateField,
    handleTechniqueChange,
    deleteImage,
  };
};
