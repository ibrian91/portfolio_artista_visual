// Constantes de la aplicación

// API
export const API_BASE_URL = 'http://localhost:5000/api';
export const IMAGE_BASE_URL = 'http://localhost:5000';

// Paginación
export const ITEMS_PER_PAGE = 8;
export const MAX_VISIBLE_PAGES = 5;

// Límites de archivos
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MIN_FILE_SIZE = 1024; // 1KB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Límites de texto
export const MAX_GROUP_NAME_LENGTH = 50;
export const MAX_IMAGE_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MIN_UPLOAD_KEY_LENGTH = 4;

// Técnicas y categorías válidas
export const VALID_TECHNIQUES = ['Dibujo', 'Pintura', 'Fotografia', 'Escritos'];

export const VALID_CATEGORIES = {
  'Dibujo': ['Digital', 'Lapiz', 'Tinta Birome', 'Tinta China', 'Fibra', 'Tecnica Mixta'],
  'Pintura': ['Acuarela', 'Acrilico', 'Pastel', 'Serigrafia', 'Tecnica Mixta'],
  'Fotografia': ['Blanco y Negro', 'Color'],
  'Escritos': ['Cronica', 'Cuento', 'Ensayo', 'Poesia']
};

// Estados de carga
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Inténtalo de nuevo más tarde.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande.',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido.',
  REQUIRED_FIELD: 'Este campo es obligatorio.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  IMAGE_UPLOADED: 'Imagen subida correctamente.',
  GROUP_CREATED: 'Grupo creado correctamente.',
  SETTINGS_SAVED: 'Configuración guardada correctamente.'
};

// Configuración de Material-UI
export const MUI_THEME = {
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

// Configuración de carrusel
export const CAROUSEL_CONFIG = {
  autoPlay: false,
  indicators: false,
  navButtonsAlwaysVisible: true,
  navButtonsProps: {
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
    }
  },
  indicatorProps: {
    style: {
      color: 'white',
    }
  },
};
