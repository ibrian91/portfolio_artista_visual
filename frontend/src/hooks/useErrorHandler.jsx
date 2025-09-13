// Hook para manejo de errores
import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const handleError = useCallback((error, context = '') => {
    console.error(`❌ Error${context ? ` in ${context}` : ''}:`, error);
    setError(error);
    setIsErrorVisible(true);

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      setIsErrorVisible(false);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsErrorVisible(false);
  }, []);

  const getErrorMessage = useCallback(() => {
    if (!error) return '';

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.message) {
      return error.message;
    }

    return 'Ha ocurrido un error inesperado';
  }, [error]);

  return {
    error,
    isErrorVisible,
    handleError,
    clearError,
    getErrorMessage,
    hasError: !!error,
  };
};

export default useErrorHandler;
