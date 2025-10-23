import path from 'path';
import fs from 'fs/promises';

// Validar extensión de archivo
export const isValidImageExtension = (filename) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

// Generar nombre único para archivo
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext);
  
  return `${baseName}-${timestamp}-${random}${ext}`;
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validar tipo MIME
export const isValidImageMime = (mimetype) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  return allowedMimes.includes(mimetype);
};

// Limpiar nombre de archivo
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

// Verificar si un archivo existe
export const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Crear directorio si no existe
export const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creando directorio:', error);
    return false;
  }
};

// Eliminar archivo de forma segura
export const safeDeleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.warn('No se pudo eliminar archivo:', filePath, error.message);
    return false;
  }
};

// Obtener información de archivo
export const getFileInfo = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
};

// Validar estructura de datos del portfolio
export const validatePortfolioData = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  }

  if (!data.collection_id || isNaN(parseInt(data.collection_id))) {
    errors.push('El ID de colección es obligatorio y debe ser un número');
  }

  if (!data.main_image || typeof data.main_image !== 'string') {
    errors.push('La imagen principal es obligatoria');
  }

  if (data.name && data.name.length > 200) {
    errors.push('El nombre no puede exceder 200 caracteres');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validar estructura de datos de técnica
export const validateTechniqueData = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('El título es obligatorio');
  }

  if (data.title && data.title.length > 100) {
    errors.push('El título no puede exceder 100 caracteres');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generar slug para URLs amigables
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Parseador de query parameters para filtros
export const parseQueryFilters = (query) => {
  const filters = {};
  
  if (query.technique) {
    filters.technique = query.technique;
  }
  
  if (query.category) {
    filters.category = query.category;
  }
  
  if (query.collection) {
    filters.collection = query.collection;
  }
  
  if (query.is_small_image !== undefined) {
    filters.is_small_image = query.is_small_image === 'true';
  }
  
  if (query.is_mockup_image !== undefined) {
    filters.is_mockup_image = query.is_mockup_image === 'true';
  }
  
  if (query.is_rotating_image !== undefined) {
    filters.is_rotating_image = query.is_rotating_image === 'true';
  }
  
  return filters;
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Escapar caracteres especiales para SQL LIKE
export const escapeLikePattern = (pattern) => {
  return pattern.replace(/[%_\\]/g, '\\$&');
};
