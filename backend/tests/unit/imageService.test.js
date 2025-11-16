import { jest } from '@jest/globals';
import { MOCK_IMAGE } from '../setup.js';

// Crear mocks antes de importar el servicio
const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockUnlinkSync = jest.fn();

// Mock de MySQL pool
const mockQuery = jest.fn();
const mockPool = {
  query: mockQuery
};

// Mock de fs usando jest.unstable_mockModule
await jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
    unlinkSync: mockUnlinkSync
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  unlinkSync: mockUnlinkSync
}));

// Mock del pool de MySQL
await jest.unstable_mockModule('../../src/config/database.js', () => ({
  default: mockPool
}));

// Ahora importar el servicio (después del mock)
const imageService = (await import('../../src/services/imageService.js')).default;

describe('ImageService - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockClear();
    mockReadFileSync.mockClear();
    mockUnlinkSync.mockClear();
    mockQuery.mockClear();
  });

  describe('getImagesByGroup', () => {
    it('debería retornar imágenes filtradas por técnica, categoría y grupo', async () => {
      // Arrange
      const mockImages = [
        { 
          id: 1, 
          technique: 'Dibujo', 
          category: 'Digital', 
          group_name: 'Test Group',
          image_name: 'Image 1',
          file_url: '/uploads/test1.jpg',
          created_at: new Date()
        },
        { 
          id: 2, 
          technique: 'Dibujo', 
          category: 'Digital', 
          group_name: 'Test Group',
          image_name: 'Image 2',
          file_url: '/uploads/test2.jpg',
          created_at: new Date()
        }
      ];

      mockQuery.mockResolvedValueOnce([mockImages]);

      // Act
      const result = await imageService.getImagesByGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM images'),
        ['Dibujo', 'Digital', 'Test Group']
      );
    });

    it('debería retornar array vacío si no hay imágenes', async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce([[]]);

      // Act
      const result = await imageService.getImagesByGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result).toEqual([]);
    });

    it('debería retornar array vacío si no hay coincidencias', async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce([[]]);

      // Act
      const result = await imageService.getImagesByGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getAllImages', () => {
    it('debería retornar todas las imágenes', async () => {
      // Arrange
      const mockImages = [
        { 
          id: 1, 
          technique: 'Dibujo', 
          category: 'Digital', 
          group_name: 'Group 1',
          image_name: 'Image 1',
          file_url: '/uploads/test1.jpg',
          created_at: new Date()
        },
        { 
          id: 2, 
          technique: 'Pintura', 
          category: 'Acrilico', 
          group_name: 'Group 2',
          image_name: 'Image 2',
          file_url: '/uploads/test2.jpg',
          created_at: new Date()
        }
      ];

      mockQuery.mockResolvedValueOnce([mockImages]);

      // Act
      const result = await imageService.getAllImages();

      // Assert
      expect(result).toHaveLength(2);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM images')
      );
    });
  });

  describe('deleteImageById', () => {
    it('debería eliminar una imagen correctamente', async () => {
      // Arrange
      const mockImage = {
        id: 123,
        technique: 'Dibujo',
        category: 'Digital',
        group_name: 'Test Group',
        image_name: 'test.jpg',
        file_url: '/uploads/portfolio/Dibujo/Digital/TestGroup/test.jpg'
      };

      mockQuery
        .mockResolvedValueOnce([[mockImage]]) // SELECT query returns array of rows
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // DELETE query

      mockExistsSync.mockReturnValue(true);
      mockUnlinkSync.mockImplementation(() => {});

      // Act
      const result = await imageService.deleteImageById(123);

      // Assert
      expect(result.id).toBe(123);
      expect(mockUnlinkSync).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM images WHERE id = ?'),
        [123]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM images WHERE id = ?'),
        [123]
      );
    });

    it('debería lanzar error si la imagen no existe', async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce([[]]); // No image found (empty array)

      // Act & Assert
      await expect(imageService.deleteImageById(999))
        .rejects.toThrow('Imagen no encontrada');
    });

    it('debería manejar errores de base de datos', async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(imageService.deleteImageById(123))
        .rejects.toThrow('Database error');
    });

    it('debería extraer filename desde file_url si filename no existe', async () => {
      // Arrange
      const mockImage = {
        id: 123,
        technique: 'Dibujo',
        category: 'Digital',
        group_name: 'TestGroup',
        file_url: '/uploads/portfolio/Dibujo/Digital/TestGroup/optimized-image.jpg'
      };

      mockQuery
        .mockResolvedValueOnce([[mockImage]]) // SELECT query
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // DELETE query

      mockExistsSync.mockReturnValue(true);
      mockUnlinkSync.mockImplementation(() => {});

      // Act
      const result = await imageService.deleteImageById(123);

      // Assert
      expect(result.id).toBe(123);
      expect(mockUnlinkSync).toHaveBeenCalled();
      // Verificar que se extrajo el filename del path
      const unlinkCall = mockUnlinkSync.mock.calls[0][0];
      expect(unlinkCall).toContain('optimized-image.jpg');
    });
  });
});
