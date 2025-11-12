import { jest } from '@jest/globals';
import { MOCK_IMAGE } from '../setup.js';

// Crear mocks antes de importar el servicio
const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockUnlinkSync = jest.fn();

// Mock de fs usando jest.unstable_mockModule
await jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
    unlinkSync: mockUnlinkSync
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
  unlinkSync: mockUnlinkSync
}));

// Ahora importar el servicio (después del mock)
const imageService = (await import('../../src/services/imageService.js')).default;

describe('ImageService - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockClear();
    mockReadFileSync.mockClear();
    mockWriteFileSync.mockClear();
    mockUnlinkSync.mockClear();
  });

  describe('getImagesByGroup', () => {
    it('debería retornar imágenes filtradas por técnica, categoría y grupo', async () => {
      // Arrange
      const mockImages = [
        { ...MOCK_IMAGE, id: '1' },
        { ...MOCK_IMAGE, id: '2', group_name: 'Other Group' },
        { ...MOCK_IMAGE, id: '3' }
      ];

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(mockImages));

      // Act
      const result = await imageService.getImagesByGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
      expect(mockReadFileSync).toHaveBeenCalledTimes(1);
    });

    it('debería retornar array vacío si el archivo no existe', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(false);

      // Act
      const result = await imageService.getImagesByGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result).toEqual([]);
      expect(mockReadFileSync).not.toHaveBeenCalled();
    });

    it('debería retornar array vacío si no hay coincidencias', async () => {
      // Arrange
      const mockImages = [
        { ...MOCK_IMAGE, id: '1', technique: 'Pintura' },
        { ...MOCK_IMAGE, id: '2', category: 'Fibra' }
      ];

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(mockImages));

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
        { ...MOCK_IMAGE, id: '1' },
        { ...MOCK_IMAGE, id: '2' }
      ];

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(mockImages));

      // Act
      const result = await imageService.getAllImages();

      // Assert
      expect(result).toHaveLength(2);
      expect(mockReadFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteImageById', () => {
    it('debería eliminar una imagen correctamente', async () => {
      // Arrange
      const mockImages = [
        { ...MOCK_IMAGE, id: '123', filename: 'test.jpg' },
        { ...MOCK_IMAGE, id: '456' }
      ];

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(mockImages));
      mockUnlinkSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      // Act
      const result = await imageService.deleteImageById('123');

      // Assert
      expect(result.id).toBe('123');
      expect(mockUnlinkSync).toHaveBeenCalledTimes(1);
      expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar error si la imagen no existe', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify([]));

      // Act & Assert
      await expect(imageService.deleteImageById('999'))
        .rejects.toThrow('Imagen no encontrada');
    });

    it('debería lanzar error si el archivo images.json no existe', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(false);

      // Act & Assert
      await expect(imageService.deleteImageById('123'))
        .rejects.toThrow();
    });

    it('debería extraer filename desde file_url si filename no existe', async () => {
      // Arrange
      const mockImageWithoutFilename = {
        ...MOCK_IMAGE,
        id: '123',
        file_url: '/uploads/portfolio/Dibujo/Digital/TestGroup/image.jpg'
      };
      delete mockImageWithoutFilename.filename;

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify([mockImageWithoutFilename]));
      mockUnlinkSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      // Act
      const result = await imageService.deleteImageById('123');

      // Assert
      expect(result.id).toBe('123');
      expect(mockUnlinkSync).toHaveBeenCalled();
      // Verificar que se extrajo el filename del path
      const unlinkCall = mockUnlinkSync.mock.calls[0][0];
      expect(unlinkCall).toContain('image.jpg');
    });
  });
});
