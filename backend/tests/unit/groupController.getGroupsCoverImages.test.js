/**
 * Tests unitarios para groupController.getGroupsCoverImages()
 * Función: Obtener grupos con sus imágenes de portada por technique/category
 * Cobertura: Filtrado, lectura filesystem, manejo errores, validaciones
 */

import { jest } from '@jest/globals';

// ===== MOCKS =====
const mockGetAllGroups = jest.fn();
const mockExistsSync = jest.fn();
const mockReaddirSync = jest.fn();

// Mock groupService
jest.unstable_mockModule('../../src/services/groupService.js', () => ({
  default: {
    getAllGroups: mockGetAllGroups,
    createGroup: jest.fn(),
    deleteGroup: jest.fn()
  }
}));

// Mock fs
jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: mockExistsSync,
    readdirSync: mockReaddirSync
  }
}));

// Import controller AFTER mocks
const { default: groupController } = await import('../../src/controllers/groupController.js');

// Variables globales para los tests
let req, res;

describe('groupController.getGroupsCoverImages() - Unit Tests', () => {
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default successful behavior
    mockGetAllGroups.mockResolvedValue([
      { technique: 'Dibujo', category: 'Lapiz', group_name: 'Grupo 1' },
      { technique: 'Dibujo', category: 'Lapiz', group_name: 'Grupo 2' },
      { technique: 'Pintura', category: 'Acuarela', group_name: 'Grupo 3' }
    ]);

    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(['image1.jpg', 'image2.png', 'document.txt']);

    // Setup request/response objects
    req = {
      query: {
        technique: 'Dibujo',
        category: 'Lapiz'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  // ========================================
  // GRUPO 1: Filtrado básico por technique/category
  // ========================================
  describe('Filtrado por technique y category', () => {
    
    it('debería filtrar grupos por technique y category correctamente', async () => {
      await groupController.getGroupsCoverImages(req, res);

      expect(mockGetAllGroups).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        groups: expect.arrayContaining([
          expect.objectContaining({
            group_name: 'Grupo 1',
            cover_image_url: expect.stringContaining('/uploads/portfolio/Dibujo/Lapiz/Grupo 1/')
          }),
          expect.objectContaining({
            group_name: 'Grupo 2',
            cover_image_url: expect.stringContaining('/uploads/portfolio/Dibujo/Lapiz/Grupo 2/')
          })
        ])
      });

      const response = res.json.mock.calls[0][0];
      expect(response.groups).toHaveLength(2);
      expect(response.groups.every(g => g.cover_image_url !== null)).toBe(true);
    });

    it('debería retornar solo grupos de la técnica y categoría solicitadas', async () => {
      mockGetAllGroups.mockResolvedValue([
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Correcto 1' },
        { technique: 'Dibujo', category: 'Digital', group_name: 'Incorrecto' },
        { technique: 'Pintura', category: 'Lapiz', group_name: 'Incorrecto 2' },
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Correcto 2' }
      ]);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups).toHaveLength(2);
      expect(response.groups[0].group_name).toBe('Correcto 1');
      expect(response.groups[1].group_name).toBe('Correcto 2');
    });

    it('debería retornar array vacío si no hay grupos para esa combinación', async () => {
      req.query = { technique: 'Fotografia', category: 'Color' };

      await groupController.getGroupsCoverImages(req, res);

      expect(res.json).toHaveBeenCalledWith({ groups: [] });
    });

    it('debería manejar diferentes combinaciones de technique/category', async () => {
      req.query = { technique: 'Pintura', category: 'Acuarela' };

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups).toHaveLength(1);
      expect(response.groups[0].group_name).toBe('Grupo 3');
    });
  });

  // ========================================
  // GRUPO 2: Búsqueda de imágenes en filesystem
  // ========================================
  describe('Búsqueda de archivos de portada', () => {
    
    it('debería encontrar primer archivo .jpg como portada', async () => {
      mockReaddirSync.mockReturnValue(['cover.jpg', 'other.png']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('cover.jpg');
    });

    it('debería encontrar archivo .png si es el primero', async () => {
      mockReaddirSync.mockReturnValue(['cover.png', 'other.jpg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('cover.png');
    });

    it('debería encontrar archivo .jpeg', async () => {
      mockReaddirSync.mockReturnValue(['document.pdf', 'cover.jpeg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('cover.jpeg');
    });

    it('debería ignorar archivos no-imagen', async () => {
      mockReaddirSync.mockReturnValue(['readme.txt', 'data.json', 'script.js', 'image.jpg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('image.jpg');
      expect(response.groups[0].cover_image_url).not.toContain('readme.txt');
    });

    it('debería manejar extensiones en mayúsculas correctamente', async () => {
      mockReaddirSync.mockReturnValue(['COVER.JPG', 'image.PNG']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('COVER.JPG');
    });

    it('debería verificar existencia del directorio antes de leer', async () => {
      await groupController.getGroupsCoverImages(req, res);

      expect(mockExistsSync).toHaveBeenCalled();
      const calledPath = mockExistsSync.mock.calls[0][0];
      expect(calledPath).toContain('uploads');
      expect(calledPath).toContain('portfolio');
      expect(calledPath).toContain('Dibujo');
      expect(calledPath).toContain('Lapiz');
      expect(calledPath).toContain('Grupo 1');
    });
  });

  // ========================================
  // GRUPO 3: Manejo de directorios inexistentes
  // ========================================
  describe('Manejo de directorios sin imágenes', () => {
    
    it('debería retornar null como cover_image_url si el directorio no existe', async () => {
      mockExistsSync.mockReturnValue(false);

      await groupController.getGroupsCoverImages(req, res);

      // No debe aparecer en el resultado final porque se filtran los null
      expect(res.json).toHaveBeenCalledWith({ groups: [] });
    });

    it('debería retornar null si el directorio existe pero no hay imágenes', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(['readme.txt', 'data.json']);

      await groupController.getGroupsCoverImages(req, res);

      expect(res.json).toHaveBeenCalledWith({ groups: [] });
    });

    it('debería filtrar grupos sin cover_image_url del resultado final', async () => {
      mockGetAllGroups.mockResolvedValue([
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Con Imagen' },
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Sin Imagen' }
      ]);

      // Primer grupo tiene imagen, segundo no
      mockExistsSync
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      
      mockReaddirSync.mockReturnValue(['cover.jpg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups).toHaveLength(1);
      expect(response.groups[0].group_name).toBe('Con Imagen');
    });

    it('debería manejar directorio vacío sin errores', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue([]);

      await groupController.getGroupsCoverImages(req, res);

      expect(res.json).toHaveBeenCalledWith({ groups: [] });
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // GRUPO 4: Construcción de URLs
  // ========================================
  describe('Construcción de cover_image_url', () => {
    
    it('debería construir URL correcta con technique, category y group_name', async () => {
      mockReaddirSync.mockReturnValue(['portada.jpg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toBe(
        '/uploads/portfolio/Dibujo/Lapiz/Grupo 1/portada.jpg'
      );
    });

    it('debería manejar nombres de grupo con espacios en la URL', async () => {
      mockGetAllGroups.mockResolvedValue([
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Grupo Con Espacios' }
      ]);
      mockReaddirSync.mockReturnValue(['image.jpg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toBe(
        '/uploads/portfolio/Dibujo/Lapiz/Grupo Con Espacios/image.jpg'
      );
    });

    it('debería usar el primer archivo de imagen encontrado', async () => {
      mockReaddirSync.mockReturnValue(['first.jpg', 'second.png', 'third.jpeg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('first.jpg');
    });

    it('debería retornar estructura correcta con group_name y cover_image_url', async () => {
      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      response.groups.forEach(group => {
        expect(group).toHaveProperty('group_name');
        expect(group).toHaveProperty('cover_image_url');
        expect(Object.keys(group)).toHaveLength(2);
      });
    });
  });

  // ========================================
  // GRUPO 5: Manejo de errores
  // ========================================
  describe('Manejo de errores', () => {
    
    it('debería retornar 500 si getAllGroups falla', async () => {
      mockGetAllGroups.mockRejectedValue(new Error('Database error'));

      await groupController.getGroupsCoverImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener los grupos.'
      });
    });

    it('debería retornar 500 si readdirSync lanza error', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await groupController.getGroupsCoverImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al obtener los grupos.'
      });
    });

    it('debería manejar error en existsSync', async () => {
      mockExistsSync.mockImplementation(() => {
        throw new Error('Path too long');
      });

      await groupController.getGroupsCoverImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('debería manejar grupos sin propiedades esperadas', async () => {
      mockGetAllGroups.mockResolvedValue([
        { technique: 'Dibujo', category: 'Lapiz' }, // Falta group_name
        { group_name: 'Test' } // Faltan technique y category
      ]);

      await groupController.getGroupsCoverImages(req, res);

      // Debe manejar gracefully sin crash
      expect(res.json).toHaveBeenCalled();
    });
  });

  // ========================================
  // GRUPO 6: Casos edge y validaciones
  // ========================================
  describe('Casos edge', () => {
    
    it('debería manejar technique/category undefined', async () => {
      req.query = {};

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups).toEqual([]);
    });

    it('debería manejar múltiples grupos con sus respectivas imágenes', async () => {
      mockGetAllGroups.mockResolvedValue([
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'G1' },
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'G2' },
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'G3' }
      ]);

      // Cada grupo tiene diferentes imágenes
      mockReaddirSync
        .mockReturnValueOnce(['g1.jpg'])
        .mockReturnValueOnce(['g2.png'])
        .mockReturnValueOnce(['g3.jpeg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups).toHaveLength(3);
      expect(response.groups[0].cover_image_url).toContain('g1.jpg');
      expect(response.groups[1].cover_image_url).toContain('g2.png');
      expect(response.groups[2].cover_image_url).toContain('g3.jpeg');
    });

    it('debería procesar correctamente cuando getAllGroups retorna array vacío', async () => {
      mockGetAllGroups.mockResolvedValue([]);

      await groupController.getGroupsCoverImages(req, res);

      expect(res.json).toHaveBeenCalledWith({ groups: [] });
      expect(mockExistsSync).not.toHaveBeenCalled();
    });

    it('debería manejar nombres de archivo con caracteres especiales', async () => {
      mockReaddirSync.mockReturnValue(['portada-especial_2024.jpg']);

      await groupController.getGroupsCoverImages(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.groups[0].cover_image_url).toContain('portada-especial_2024.jpg');
    });

    it('debería verificar cada directorio de grupo individualmente', async () => {
      mockGetAllGroups.mockResolvedValue([
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Grupo 1' },
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Grupo 2' }
      ]);

      await groupController.getGroupsCoverImages(req, res);

      expect(mockExistsSync).toHaveBeenCalledTimes(2);
      expect(mockExistsSync.mock.calls[0][0]).toContain('Grupo 1');
      expect(mockExistsSync.mock.calls[1][0]).toContain('Grupo 2');
    });
  });

  // ========================================
  // GRUPO 7: Integración con groupService
  // ========================================
  describe('Integración con groupService', () => {
    
    it('debería llamar a getAllGroups sin parámetros', async () => {
      await groupController.getGroupsCoverImages(req, res);

      expect(mockGetAllGroups).toHaveBeenCalledWith();
      expect(mockGetAllGroups).toHaveBeenCalledTimes(1);
    });

    it('debería procesar correctamente la respuesta de getAllGroups', async () => {
      const mockGroups = [
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Test 1' },
        { technique: 'Dibujo', category: 'Lapiz', group_name: 'Test 2' }
      ];
      mockGetAllGroups.mockResolvedValue(mockGroups);

      await groupController.getGroupsCoverImages(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.groups.length).toBeLessThanOrEqual(mockGroups.length);
    });
  });
});
