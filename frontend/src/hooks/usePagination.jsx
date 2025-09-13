import { useState } from 'react';
import { ITEMS_PER_PAGE } from '../utils/constants';

const usePagination = (itemsPerPage = ITEMS_PER_PAGE) => {
  const [page, setPage] = useState(1);

  const paginate = (items = []) => {
    if (!Array.isArray(items)) {
      console.warn('usePagination: items must be an array, received:', items);
      return [];
    }

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setPage(prevPage => Math.max(1, prevPage - 1));
  };

  const resetPage = () => {
    setPage(1);
  };

  // Calcular valores basados en items (necesita ser llamado con items específicos)
  const getPaginationInfo = (items = []) => {
    if (!Array.isArray(items)) {
      return {
        totalPages: 0,
        currentPage: page,
        hasItems: false,
        hasMultiplePages: false,
        isFirstPage: true,
        isLastPage: true
      };
    }

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return {
      totalPages,
      currentPage: page,
      hasItems: items.length > 0,
      hasMultiplePages: totalPages > 1,
      isFirstPage: page === 1,
      isLastPage: page === totalPages || totalPages === 0
    };
  };

  return {
    // Estados
    currentPage: page,

    // Funciones
    setPage: goToPage,
    nextPage,
    prevPage,
    resetPage,
    paginate,
    getPaginationInfo,

    // Utilidades
    itemsPerPage
  };
};

export default usePagination;
