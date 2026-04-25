import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.PORT = 5001;
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.ACCESS_KEY = 'test_access_key';

// Paths de prueba
export const TEST_UPLOADS_DIR = path.join(__dirname, '../uploads_test');
export const TEST_DATA_DIR = path.join(__dirname, '../src/data_test');

// Mock data común
export const MOCK_IMAGE = {
  id: '1234567890',
  technique: 'Dibujo',
  category: 'Digital',
  group_name: 'Test Group',
  image_name: 'Test Image',
  description: 'Test description',
  is_mockup_image: false,
  is_rotating_image: false,
  is_small_image: false,
  file_url: '/uploads/portfolio/Dibujo/Digital/Test Group/test.jpg',
  created_at: new Date().toISOString()
};

export const MOCK_GROUP = {
  technique: 'Dibujo',
  category: 'Digital',
  group_name: 'Test Group',
  cover_image_url: '/uploads/portfolio/Dibujo/Digital/Test Group/cover.jpg',
  created_at: new Date().toISOString()
};

export const VALID_TECHNIQUES = ['Dibujo', 'Pintura', 'Fotografía', 'Escritos'];
export const VALID_CATEGORIES = {
  'Dibujo': ['Digital', 'Fibra', 'Lapiz', 'Tecnica Mixta', 'Tinta Birome', 'Tinta China'],
  'Pintura': ['Acrilico', 'Acuarela', 'Pastel', 'Serigrafia', 'Tecnica Mixta'],
  'Fotografía': ['Blanco y Negro', 'Color'],
  'Escritos': ['Poesía', 'Cuento', 'Ensayo', 'Crónica']
};
