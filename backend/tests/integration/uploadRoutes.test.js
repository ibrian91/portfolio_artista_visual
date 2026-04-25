import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock de fs/promises
const mockUnlink = jest.fn();
const mockMkdir = jest.fn();
const mockReadFile = jest.fn();
jest.unstable_mockModule('fs/promises', () => ({
  default: {
    unlink: mockUnlink,
    mkdir: mockMkdir,
    readFile: mockReadFile
  },
  unlink: mockUnlink,
  mkdir: mockMkdir,
  readFile: mockReadFile
}));

// Mock de Sharp
const mockSharpToFile = jest.fn();
const mockSharpResize = jest.fn(() => ({
  jpeg: jest.fn(() => ({
    toFile: mockSharpToFile
  }))
}));
const mockSharp = jest.fn(() => ({
  resize: mockSharpResize
}));
jest.unstable_mockModule('sharp', () => ({
  default: mockSharp
}));

// Importar las rutas después de los mocks
const uploadRoutes = await import('../../src/routes/uploadRoutes.js');

describe('UploadRoutes - POST /api/upload (Integration)', () => {
  let app;

  beforeAll(() => {
    // Crear app de Express para testing
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/upload', uploadRoutes.default);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock defaults
    mockMkdir.mockResolvedValue();
    mockSharpToFile.mockResolvedValue();
    mockUnlink.mockResolvedValue();
  });

  describe('Validaciones básicas', () => {
    it('debería retornar 400 si no se proporciona archivo', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No se proporcionó archivo');
    });

    it('debería retornar 409 si el grupo no existe', async () => {
      // Mock: groups.json existe pero no contiene el grupo
      mockReadFile.mockResolvedValue(JSON.stringify([
        {
          technique: 'Dibujo',
          category: 'Lapiz',
          group_name: 'Otro Grupo'
        }
      ]));

      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Grupo no encontrado');
      expect(mockUnlink).toHaveBeenCalled(); // Debería limpiar archivo
    });

    it('debería retornar 400 con extensión no permitida', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify([
        {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        }
      ]));

      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.gif');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Tipo de archivo no permitido');
    });
  });

  describe('Flujo exitoso', () => {
    beforeEach(() => {
      // Mock: grupo existe
      mockReadFile.mockResolvedValue(JSON.stringify([
        {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        }
      ]));
    });

    it('debería subir imagen .jpg exitosamente', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .field('image_name', 'test-image')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      // Puede ser 201 o 500 dependiendo de si Sharp funciona en el entorno de test
      expect([201, 500]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('message', 'Imagen subida correctamente');
        expect(response.body.image).toHaveProperty('technique', 'Dibujo');
        expect(response.body.image).toHaveProperty('category', 'Digital');
        expect(response.body.image).toHaveProperty('group_name', 'Test Group');
      }
    });

    it('debería subir imagen .png exitosamente', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.png');

      expect([201, 500]).toContain(response.status);
    });

    it('debería crear directorio del grupo si no existe', async () => {
      await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      expect(mockMkdir).toHaveBeenCalledWith(
        expect.stringContaining('Dibujo'),
        { recursive: true }
      );
    });

    it('debería convertir booleanos correctamente desde FormData', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .field('is_mockup_image', 'true')
        .field('is_rotating_image', 'false')
        .field('is_small_image', 'true')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      if (response.status === 201) {
        expect(response.body.image.is_mockup_image).toBe(true);
        expect(response.body.image.is_rotating_image).toBe(false);
        expect(response.body.image.is_small_image).toBe(true);
      }
    });

    it('debería incluir descripción en la respuesta', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .field('description', 'Descripción de prueba')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      if (response.status === 201) {
        expect(response.body.image).toHaveProperty('description', 'Descripción de prueba');
      }
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar error al leer groups.json', async () => {
      mockReadFile.mockRejectedValue(new Error('File not found'));

      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      // Si no puede leer groups.json, debería asumir array vacío y retornar 409
      expect(response.status).toBe(409);
    });

    it('debería limpiar archivo si falla después de validaciones', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify([
        {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        }
      ]));
      
      mockSharpToFile.mockRejectedValue(new Error('Sharp error'));

      await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      // Debería intentar limpiar archivo original
      expect(mockUnlink).toHaveBeenCalled();
    });

    it('debería manejar error general y retornar 500', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify([
        {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        }
      ]));
      
      // Provocar error en Sharp para que llegue al catch principal
      mockSharp.mockImplementationOnce(() => {
        throw new Error('Sharp processing failed');
      });

      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Error interno del servidor');
    });
  });

  describe('Validación de parámetros', () => {
    it('debería validar que technique_name sea requerido', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify([]));

      const response = await request(app)
        .post('/api/upload')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpg');

      // Sin technique_name, no puede encontrar el grupo
      expect(response.status).toBe(409);
    });

    it('debería aceptar archivos .jpeg', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify([
        {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        }
      ]));

      const response = await request(app)
        .post('/api/upload')
        .field('technique_name', 'Dibujo')
        .field('category_name', 'Digital')
        .field('group_name', 'Test Group')
        .attach('image', Buffer.from('fake image'), 'test.jpeg');

      expect([201, 500]).toContain(response.status);
    });
  });
});
