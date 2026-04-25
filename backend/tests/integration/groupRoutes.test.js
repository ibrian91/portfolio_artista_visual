import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock groupService antes de importar las rutas
const mockGetAllGroups = jest.fn();
const mockDeleteGroup = jest.fn();

await jest.unstable_mockModule('../../src/services/groupService.js', () => ({
  default: {
    getAllGroups: mockGetAllGroups,
    deleteGroup: mockDeleteGroup
  }
}));

// Ahora importar las rutas (después del mock)
const groupRoutes = (await import('../../src/routes/groupRoutes.js')).default;

describe('Group Routes - Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/groups', groupRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllGroups.mockClear();
    mockDeleteGroup.mockClear();
  });

  describe('GET /api/groups', () => {
    it('debería retornar todos los grupos', async () => {
      // Arrange
      const mockGroups = [
        { group_name: 'Group 1', technique: 'Dibujo' },
        { group_name: 'Group 2', technique: 'Pintura' }
      ];
      mockGetAllGroups.mockResolvedValue(mockGroups);

      // Act
      const response = await request(app).get('/api/groups');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.groups).toHaveLength(2);
    });

    it('debería filtrar grupos por técnica y categoría', async () => {
      // Arrange
      const allGroups = [
        { technique: 'Dibujo', category: 'Digital', group_name: 'Group 1' },
        { technique: 'Dibujo', category: 'Fibra', group_name: 'Group 2' },
        { technique: 'Pintura', category: 'Acrilico', group_name: 'Group 3' }
      ];
      mockGetAllGroups.mockResolvedValue(allGroups);

      // Act
      const response = await request(app)
        .get('/api/groups')
        .query({ technique: 'Dibujo', category: 'Digital' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.groups).toHaveLength(1);
      expect(response.body.groups[0].group_name).toBe('Group 1');
    });

    it('debería manejar errores del servicio', async () => {
      // Arrange
      mockGetAllGroups.mockRejectedValue(new Error('Error interno'));

      // Act
      const response = await request(app).get('/api/groups');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.error).toBeTruthy();
    });
  });

  describe('GET /api/groups/cover-images', () => {
    it('debería retornar grupos con imágenes de portada', async () => {
      // Arrange
      const mockGroups = [
        {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Group 1'
        }
      ];
      mockGetAllGroups.mockResolvedValue(mockGroups);

      // Act
      const response = await request(app)
        .get('/api/groups/cover-images')
        .query({ technique: 'Dibujo', category: 'Digital' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.groups).toBeDefined();
    });
  });

  describe('DELETE /api/groups', () => {
    it('debería eliminar un grupo correctamente', async () => {
      // Arrange
      const mockDeletedGroup = {
        technique: 'Dibujo',
        category: 'Digital',
        group_name: 'Test Group'
      };
      mockDeleteGroup.mockResolvedValue(mockDeletedGroup);

      // Act
      const response = await request(app)
        .delete('/api/groups')
        .send({
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('eliminado correctamente');
      expect(response.body.deletedGroup).toEqual(mockDeletedGroup);
    });

    it('debería retornar 400 si faltan parámetros', async () => {
      // Act
      const response = await request(app)
        .delete('/api/groups')
        .send({
          technique: 'Dibujo',
          // Falta category y group_name
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Faltan parámetros');
    });

    it('debería retornar 404 si el grupo no existe', async () => {
      // Arrange
      mockDeleteGroup.mockRejectedValue(
        new Error('Grupo no encontrado')
      );

      // Act
      const response = await request(app)
        .delete('/api/groups')
        .send({
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Inexistente'
        });

      // Assert
      expect(response.status).toBe(404);
    });
  });
});
