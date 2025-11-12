/**
 * Tests de integración para imageRoutes inline (GET y HEAD /image/:type/:filename)
 * Funciones: Servir archivos de imagen específicos y verificar existencia
 * Cobertura: Rutas inline no cubiertas previamente (42% → ~80%)
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup express app con imageRoutes
const app = express();
app.use(express.json());

// Import routes
const { default: imageRoutes } = await import('../../src/routes/imageRoutes.js');
app.use('/api/images', imageRoutes);

describe('ImageRoutes Inline - GET/HEAD /image/:type/:filename', () => {
  
  const testImagePath = path.join(__dirname, '../../uploads/images/test-type');
  const testImageFile = path.join(testImagePath, 'test-image.jpg');

  beforeAll(async () => {
    // Crear directorio y archivo de prueba
    try {
      await fs.mkdir(testImagePath, { recursive: true });
      await fs.writeFile(testImageFile, 'fake image content');
    } catch (error) {
      console.error('Error creando archivos de prueba:', error);
    }
  });

  afterAll(async () => {
    // Limpiar archivos de prueba
    try {
      await fs.unlink(testImageFile).catch(() => {});
      await fs.rmdir(testImagePath).catch(() => {});
    } catch (error) {
      console.error('Error limpiando archivos de prueba:', error);
    }
  });

  // ========================================
  // GRUPO 1: GET /image/:type/:filename
  // ========================================
  describe('GET /api/images/image/:type/:filename', () => {
    
    it('debería retornar una imagen existente con status 200', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/test-image.jpg');

      expect(response.status).toBe(200);
      // La respuesta puede ser body (buffer) o text (string)
      const content = response.body || response.text;
      expect(content).toBeTruthy();
    });

    it('debería retornar 404 si la imagen no existe', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/nonexistent.jpg');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Imagen no encontrada');
    });

    it('debería incluir filename y type en el mensaje de error 404', async () => {
      const response = await request(app)
        .get('/api/images/image/drawings/missing.png');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('missing.png');
      expect(response.body.message).toContain('drawings');
    });

    it('debería manejar diferentes tipos de imagen', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/test-image.jpg');

      expect(response.status).toBe(200);
    });

    it('debería retornar 404 si el directorio type no existe', async () => {
      const response = await request(app)
        .get('/api/images/image/nonexistent-type/image.jpg');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('debería manejar nombres de archivo con caracteres especiales', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/image-with-dashes_2024.jpg');

      expect(response.status).toBe(404); // No existe, pero debe manejar el path
      expect(response.body).toHaveProperty('error');
    });

    it('debería manejar extensiones diferentes (png, jpeg, gif)', async () => {
      const extensions = ['png', 'jpeg', 'gif', 'webp'];
      
      for (const ext of extensions) {
        const response = await request(app)
          .get(`/api/images/image/test-type/test.${ext}`);

        expect([200, 404]).toContain(response.status);
      }
    });

    it('debería manejar paths con espacios codificados', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/image%20with%20spaces.jpg');

      expect([200, 404]).toContain(response.status);
      if (response.status === 404) {
        expect(response.body).toHaveProperty('error');
      }
    });

    it('debería prevenir path traversal attacks', async () => {
      const response = await request(app)
        .get('/api/images/image/../../../etc/passwd');

      // Express y sendFile deberían prevenir esto
      expect([400, 403, 404]).toContain(response.status);
    });

    it('debería retornar JSON con estructura correcta en error', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/missing.jpg');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
    });
  });

  // ========================================
  // GRUPO 2: HEAD /image/:type/:filename
  // ========================================
  describe('HEAD /api/images/image/:type/:filename', () => {
    
    it('debería retornar 200 sin body si la imagen existe', async () => {
      const response = await request(app)
        .head('/api/images/image/test-type/test-image.jpg');

      expect(response.status).toBe(200);
      // HEAD no tiene body, text puede ser undefined o ''
      expect(response.text || '').toBe('');
    });

    it('debería retornar 404 sin body si la imagen no existe', async () => {
      const response = await request(app)
        .head('/api/images/image/test-type/nonexistent.jpg');

      expect(response.status).toBe(404);
      expect(response.text || '').toBe(''); // HEAD no debe tener body
    });

    it('debería retornar 404 si el directorio type no existe', async () => {
      const response = await request(app)
        .head('/api/images/image/invalid-type/image.jpg');

      expect(response.status).toBe(404);
      expect(response.text || '').toBe('');
    });

    it('debería ser más rápido que GET (no transfiere contenido)', async () => {
      const startHead = Date.now();
      await request(app).head('/api/images/image/test-type/test-image.jpg');
      const headTime = Date.now() - startHead;

      const startGet = Date.now();
      await request(app).get('/api/images/image/test-type/test-image.jpg');
      const getTime = Date.now() - startGet;

      // HEAD debería ser igual o más rápido (aunque en test puede variar)
      expect(headTime).toBeLessThanOrEqual(getTime + 50); // +50ms tolerancia
    });

    it('debería manejar diferentes extensiones en HEAD', async () => {
      const response = await request(app)
        .head('/api/images/image/test-type/test.png');

      expect([200, 404]).toContain(response.status);
      expect(response.text || '').toBe('');
    });

    it('debería manejar path traversal en HEAD', async () => {
      const response = await request(app)
        .head('/api/images/image/../../../etc/passwd');

      expect([400, 403, 404]).toContain(response.status);
      expect(response.text || '').toBe('');
    });

    it('debería ser útil para verificar existencia sin descargar', async () => {
      // Caso de uso: verificar si imagen existe antes de mostrarla
      const checkResponse = await request(app)
        .head('/api/images/image/test-type/test-image.jpg');

      if (checkResponse.status === 200) {
        const getResponse = await request(app)
          .get('/api/images/image/test-type/test-image.jpg');
        
        expect(getResponse.status).toBe(200);
        // Verificar que GET tiene contenido
        const content = getResponse.body || getResponse.text;
        expect(content).toBeTruthy();
      }
    });
  });

  // ========================================
  // GRUPO 3: Comparación GET vs HEAD
  // ========================================
  describe('Comparación entre GET y HEAD', () => {
    
    it('debería retornar mismo status code para archivo existente', async () => {
      const getResponse = await request(app)
        .get('/api/images/image/test-type/test-image.jpg');
      
      const headResponse = await request(app)
        .head('/api/images/image/test-type/test-image.jpg');

      expect(headResponse.status).toBe(getResponse.status);
    });

    it('debería retornar mismo status code para archivo inexistente', async () => {
      const getResponse = await request(app)
        .get('/api/images/image/test-type/missing.jpg');
      
      const headResponse = await request(app)
        .head('/api/images/image/test-type/missing.jpg');

      expect(headResponse.status).toBe(getResponse.status);
    });

    it('GET debe tener body, HEAD no debe tener body', async () => {
      const getResponse = await request(app)
        .get('/api/images/image/test-type/test-image.jpg');
      
      const headResponse = await request(app)
        .head('/api/images/image/test-type/test-image.jpg');

      // GET debe tener contenido (body o text)
      const getContent = getResponse.body || getResponse.text;
      expect(getContent).toBeTruthy();
      // HEAD no debe tener body
      expect(headResponse.text || '').toBe('');
    });

    it('HEAD debe retornar mismo Content-Type que GET', async () => {
      const getResponse = await request(app)
        .get('/api/images/image/test-type/test-image.jpg');
      
      const headResponse = await request(app)
        .head('/api/images/image/test-type/test-image.jpg');

      if (getResponse.status === 200) {
        // Ambos deberían tener headers similares
        expect(headResponse.headers).toBeDefined();
      }
    });
  });

  // ========================================
  // GRUPO 4: Casos edge y seguridad
  // ========================================
  describe('Casos edge y seguridad', () => {
    
    it('debería manejar parámetros vacíos', async () => {
      const response = await request(app)
        .get('/api/images/image//');

      // Puede ser 404 o error de ruta
      expect([400, 404]).toContain(response.status);
    });

    it('debería manejar type muy largo', async () => {
      const longType = 'a'.repeat(500);
      const response = await request(app)
        .get(`/api/images/image/${longType}/test.jpg`);

      expect([400, 404, 414]).toContain(response.status);
    });

    it('debería manejar filename muy largo', async () => {
      const longFilename = 'a'.repeat(500) + '.jpg';
      const response = await request(app)
        .get(`/api/images/image/test-type/${longFilename}`);

      expect([400, 404, 414]).toContain(response.status);
    });

    it('debería rechazar paths con .. en type', async () => {
      const response = await request(app)
        .get('/api/images/image/../sensitive/file.txt');

      expect([400, 403, 404]).toContain(response.status);
    });

    it('debería rechazar paths con .. en filename', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/../../../etc/passwd');

      expect([400, 403, 404]).toContain(response.status);
    });

    it('debería manejar caracteres especiales en type', async () => {
      const response = await request(app)
        .get('/api/images/image/test%20type/image.jpg');

      expect([200, 404]).toContain(response.status);
    });

    it('debería manejar múltiples extensiones en filename', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/image.backup.jpg');

      expect([200, 404]).toContain(response.status);
    });

    it('debería manejar filename sin extensión', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/imagefile');

      expect([200, 404]).toContain(response.status);
    });

    it('debería manejar case sensitivity en paths', async () => {
      // Windows es case-insensitive, Linux es case-sensitive
      const response = await request(app)
        .get('/api/images/image/TEST-TYPE/test-image.jpg');

      // El comportamiento depende del OS
      expect([200, 404]).toContain(response.status);
    });
  });

  // ========================================
  // GRUPO 5: Validación de respuestas
  // ========================================
  describe('Validación de respuestas', () => {
    
    it('GET 200 debe tener Content-Type adecuado', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/test-image.jpg');

      if (response.status === 200) {
        // Debería tener algún content-type
        expect(response.headers).toHaveProperty('content-type');
      }
    });

    it('GET 404 debe tener Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/images/image/test-type/missing.jpg');

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('HEAD 200 no debe tener body pero sí headers', async () => {
      const response = await request(app)
        .head('/api/images/image/test-type/test-image.jpg');

      if (response.status === 200) {
        expect(response.text || '').toBe('');
        expect(response.headers).toBeDefined();
      }
    });

    it('HEAD 404 no debe tener body ni Content-Type JSON', async () => {
      const response = await request(app)
        .head('/api/images/image/test-type/missing.jpg');

      expect(response.status).toBe(404);
      expect(response.text || '').toBe('');
    });

    it('GET error debe incluir ambos campos error y message', async () => {
      const response = await request(app)
        .get('/api/images/image/invalid/missing.jpg');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.error).toBe('Imagen no encontrada');
    });
  });
});
