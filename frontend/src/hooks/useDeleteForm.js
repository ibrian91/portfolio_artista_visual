import { useState } from "react";

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

  // Función placeholder para eliminación (aún no implementada)
  const deleteImage = async () => {
    setIsSubmitting(true);

    // TODO: Implementar endpoint de eliminación
    alert("Funcionalidad de eliminación próximamente disponible");

    setIsSubmitting(false);
    return false;
  };

  // Validación básica (siempre false por ahora)
  const isFormValid = false; // TODO: Implementar validación cuando esté listo el endpoint

  return {
    formData,
    isSubmitting,
    isFormValid,
    updateField,
    handleTechniqueChange,
    deleteImage,
  };
};
