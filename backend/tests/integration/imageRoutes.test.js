import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock imageService antes de importar las rutas
const mockGetImagesByGroup = jest.fn();
const mockDeleteImageById = jest.fn();

await jest.unstable_mockModule('../../src/services/imageService.js', () => ({
  default: {
    getImagesByGroup: mockGetImagesByGroup,
    deleteImageById: mockDeleteImageById
  }
}));

// Ahora importar las rutas (después del mock)
const imageRoutes = (await import('../../src/routes/imageRoutes.js')).default;

describe('Image Routes - Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/images', imageRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetImagesByGroup.mockClear();
    mockDeleteImageById.mockClear();
    // Configurar UPLOAD_SECRET para los tests
    process.env.UPLOAD_SECRET = 'test_secret';
  });

  describe('GET /api/images', () => {
    it('debería retornar imágenes de un grupo específico', async () => {
      // Arrange
      const mockImages = [
        { id: '1', image_name: 'Image 1' },
        { id: '2', image_name: 'Image 2' }
      ];
      mockGetImagesByGroup.mockResolvedValue(mockImages);

      // Act
      const response = await request(app)
        .get('/api/images')
        .query({ technique: 'Dibujo', category: 'Digital', group_name: 'Test' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.images).toHaveLength(2);
      expect(mockGetImagesByGroup).toHaveBeenCalledWith('Dibujo', 'Digital', 'Test');
    });

    it('debería retornar 400 si faltan parámetros', async () => {
      // Act
      const response = await request(app)
        .get('/api/images')
        .query({ technique: 'Dibujo' }); // Falta category y group_name

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Faltan parámetros');
    });

    it('debería manejar errores del servicio', async () => {
      // Arrange
      mockGetImagesByGroup.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/images')
        .query({ technique: 'Dibujo', category: 'Digital', group_name: 'Test' });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/images/:id', () => {
    it('debería eliminar una imagen correctamente', async () => {
      // Arrange
      const mockDeletedImage = { id: '123', image_name: 'Deleted Image' };
      mockDeleteImageById.mockResolvedValue(mockDeletedImage);

      // Act
      const response = await request(app)
        .delete('/api/images/123')
        .send({ upload_key: 'test_secret' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('eliminada correctamente');
      expect(mockDeleteImageById).toHaveBeenCalledWith('123');
    });

    it('debería retornar 401 con clave incorrecta', async () => {
      // Act
      const response = await request(app)
        .delete('/api/images/123')
        .send({ upload_key: 'wrong_key' });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error).toContain('incorrecta');
      expect(mockDeleteImageById).not.toHaveBeenCalled();
    });

    it('debería retornar 404 si la imagen no existe', async () => {
      // Arrange
      mockDeleteImageById.mockRejectedValue(
        new Error('Imagen no encontrada')
      );

      // Act
      const response = await request(app)
        .delete('/api/images/999')
        .send({ upload_key: 'test_secret' });

      // Assert
      expect(response.status).toBe(404);
    });

    it('debería retornar 404 si falta el ID en la ruta', async () => {
      // Act - DELETE a la ruta sin ID retorna 404 (no encontrada)
      const response = await request(app)
        .delete('/api/images/')
        .send({ upload_key: 'test_secret' });

      // Assert
      expect(response.status).toBe(404);
    });
  });
});
