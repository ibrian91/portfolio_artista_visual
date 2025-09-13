// Funciones de validación para el portfolio

// Validar nombre de grupo
export const validateGroupName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'El nombre del grupo es requerido' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: 'El nombre del grupo no puede estar vacío' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, message: 'El nombre del grupo debe tener al menos 2 caracteres' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, message: 'El nombre del grupo no puede exceder 50 caracteres' };
  }

  // Solo permitir letras, números, espacios y algunos caracteres especiales
  const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, message: 'El nombre del grupo solo puede contener letras, números, espacios, guiones y guiones bajos' };
  }

  return { isValid: true, message: '', value: trimmed };
};

// Validar nombre de imagen
export const validateImageName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'El nombre de la imagen es requerido' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: 'El nombre de la imagen no puede estar vacío' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, message: 'El nombre de la imagen debe tener al menos 2 caracteres' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, message: 'El nombre de la imagen no puede exceder 100 caracteres' };
  }

  return { isValid: true, message: '', value: trimmed };
};

// Validar descripción de imagen
export const validateImageDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { isValid: true, message: '', value: '' }; // La descripción es opcional
  }

  const trimmed = description.trim();

  if (trimmed.length > 500) {
    return { isValid: false, message: 'La descripción no puede exceder 500 caracteres' };
  }

  return { isValid: true, message: '', value: trimmed };
};

// Validar clave de subida
export const validateUploadKey = (key) => {
  if (!key || typeof key !== 'string') {
    return { isValid: false, message: 'La clave de subida es requerida' };
  }

  const trimmed = key.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: 'La clave de subida no puede estar vacía' };
  }

  if (trimmed.length < 4) {
    return { isValid: false, message: 'La clave de subida debe tener al menos 4 caracteres' };
  }

  return { isValid: true, message: '', value: trimmed };
};

// Validar archivo de imagen
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, message: 'Debe seleccionar una imagen' };
  }

  // Verificar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)' };
  }

  // Verificar tamaño (10MB máximo)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, message: 'El archivo no puede exceder 10MB' };
  }

  // Verificar tamaño mínimo (1KB)
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    return { isValid: false, message: 'El archivo es demasiado pequeño' };
  }

  return { isValid: true, message: '', file };
};

// Validar técnica y categoría
export const validateTechniqueCategory = (technique, category) => {
  const validTechniques = ['Dibujo', 'Pintura', 'Fotografia', 'Escritos'];
  const validCategories = {
    'Dibujo': ['Digital', 'Lapiz', 'Tinta Birome', 'Tinta China', 'Fibra', 'Tecnica Mixta'],
    'Pintura': ['Acuarela', 'Acrilico', 'Pastel', 'Serigrafia', 'Tecnica Mixta'],
    'Fotografia': ['Blanco y Negro', 'Color'],
    'Escritos': ['Cronica', 'Cuento', 'Ensayo', 'Poesia']
  };

  if (!technique || !validTechniques.includes(technique)) {
    return { isValid: false, message: 'Técnica inválida' };
  }

  if (!category || !validCategories[technique]?.includes(category)) {
    return { isValid: false, message: `Categoría inválida para la técnica ${technique}` };
  }

  return { isValid: true, message: '' };
};
