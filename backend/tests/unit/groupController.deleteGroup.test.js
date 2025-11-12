/**
 * Tests unitarios para groupController.deleteGroup()
 * Función: Eliminar un grupo existente con validaciones y limpieza
 * Cobertura: Validaciones de auth y params, borrado exitoso, errores
 */

import { jest } from '@jest/globals';

// ===== MOCKS =====
const mockDeleteGroup = jest.fn();

// Mock groupService
jest.unstable_mockModule('../../src/services/groupService.js', () => ({
  default: {
    deleteGroup: mockDeleteGroup,
    createGroup: jest.fn(),
    getGroups: jest.fn()
  }
}));

// Import controller AFTER mocks
const { default: groupController } = await import('../../src/controllers/groupController.js');

// Variables globales para los tests
let req, res;

describe('groupController.deleteGroup() - Unit Tests', () => {
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default successful behavior
    mockDeleteGroup.mockResolvedValue({
      technique: 'Dibujo',
      category: 'Digital',
      group_name: 'Test Group'
    });

    // Setup request/response objects
    req = {
      body: {
        technique: 'Dibujo',
        category: 'Digital',
        group_name: 'Test Group',
        upload_key: 'test_secret'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock environment variable
    process.env.UPLOAD_SECRET = 'test_secret';
  });

  afterEach(() => {
    delete process.env.UPLOAD_SECRET;
  });

  // ========================================
  // GRUPO 1: Validaciones de autenticación
  // ========================================
  describe('Validaciones de autenticación', () => {
    
    it('debería retornar 401 con clave incorrecta', async () => {
      req.body.upload_key = 'wrong_key';

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Clave de eliminación incorrecta'
      });
      expect(mockDeleteGroup).not.toHaveBeenCalled();
    });

    it('debería retornar 401 si no se proporciona clave', async () => {
      delete req.body.upload_key;

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Clave de eliminación incorrecta'
      });
      expect(mockDeleteGroup).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // GRUPO 2: Validaciones de parámetros
  // ========================================
  describe('Validaciones de parámetros', () => {
    
    it('debería retornar 400 si falta technique', async () => {
      delete req.body.technique;

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Faltan parámetros: technique, category, group_name'
      });
      expect(mockDeleteGroup).not.toHaveBeenCalled();
    });

    it('debería retornar 400 si falta category', async () => {
      delete req.body.category;

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Faltan parámetros: technique, category, group_name'
      });
      expect(mockDeleteGroup).not.toHaveBeenCalled();
    });

    it('debería retornar 400 si falta group_name', async () => {
      delete req.body.group_name;

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Faltan parámetros: technique, category, group_name'
      });
      expect(mockDeleteGroup).not.toHaveBeenCalled();
    });

    it('debería retornar 400 si faltan múltiples parámetros', async () => {
      delete req.body.technique;
      delete req.body.category;

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockDeleteGroup).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // GRUPO 3: Borrado exitoso
  // ========================================
  describe('Borrado exitoso', () => {
    
    it('debería eliminar grupo exitosamente', async () => {
      await groupController.deleteGroup(req, res);

      expect(mockDeleteGroup).toHaveBeenCalledWith('Dibujo', 'Digital', 'Test Group');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Grupo eliminado correctamente',
        deletedGroup: {
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'Test Group'
        }
      });
      expect(res.status).not.toHaveBeenCalled(); // 200 por defecto
    });

    it('debería llamar al service con los parámetros correctos', async () => {
      req.body = {
        technique: 'Pintura',
        category: 'Acuarela',
        group_name: 'Grupo Especial',
        upload_key: 'test_secret'
      };

      await groupController.deleteGroup(req, res);

      expect(mockDeleteGroup).toHaveBeenCalledWith('Pintura', 'Acuarela', 'Grupo Especial');
      expect(mockDeleteGroup).toHaveBeenCalledTimes(1);
    });

    it('debería retornar el grupo eliminado en la respuesta', async () => {
      const deletedGroup = {
        technique: 'Fotografia',
        category: 'Color',
        group_name: 'Retratos',
        images: []
      };
      mockDeleteGroup.mockResolvedValue(deletedGroup);

      await groupController.deleteGroup(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Grupo eliminado correctamente',
          deletedGroup: deletedGroup
        })
      );
    });
  });

  // ========================================
  // GRUPO 4: Manejo de errores
  // ========================================
  describe('Manejo de errores', () => {
    
    it('debería retornar 404 si el grupo no existe', async () => {
      mockDeleteGroup.mockRejectedValue(new Error('Grupo no encontrado'));

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Grupo no encontrado'
      });
    });

    it('debería retornar 500 en error del servicio', async () => {
      mockDeleteGroup.mockRejectedValue(new Error('Error eliminando archivos'));

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al eliminar el grupo: Error eliminando archivos'
      });
    });

    it('debería retornar 500 en error desconocido', async () => {
      mockDeleteGroup.mockRejectedValue(new Error('Error inesperado'));

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al eliminar el grupo: Error inesperado'
      });
    });

    it('debería manejar errores sin mensaje', async () => {
      mockDeleteGroup.mockRejectedValue(new Error());

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al eliminar el grupo: '
      });
    });
  });
});
