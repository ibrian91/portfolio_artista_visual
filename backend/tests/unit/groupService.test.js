import { jest } from '@jest/globals';
import { MOCK_GROUP, MOCK_IMAGE } from '../setup.js';

// Crear mocks antes de importar el servicio
const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockRmSync = jest.fn();
const mockUnlinkSync = jest.fn();

// Mock de fs usando jest.unstable_mockModule
await jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
    rmSync: mockRmSync,
    unlinkSync: mockUnlinkSync
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
  rmSync: mockRmSync,
  unlinkSync: mockUnlinkSync
}));

// Ahora importar el servicio (después del mock)
const groupService = (await import('../../src/services/groupService.js')).default;

describe('GroupService - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockClear();
    mockReadFileSync.mockClear();
    mockWriteFileSync.mockClear();
    mockRmSync.mockClear();
    mockUnlinkSync.mockClear();
  });

  describe('isValidTechniqueCategory', () => {
    it('debería validar combinaciones correctas de técnica y categoría', () => {
      // Arrange
      const mockTechniques = [
        { title: 'Dibujo', categorias: ['Digital', 'Fibra', 'Lapiz'] },
        { title: 'Pintura', categorias: ['Acrilico', 'Acuarela'] }
      ];
      mockReadFileSync.mockReturnValue(JSON.stringify(mockTechniques));

      // Act & Assert
      expect(groupService.isValidTechniqueCategory('Dibujo', 'Digital')).toBe(true);
      expect(groupService.isValidTechniqueCategory('Pintura', 'Acrilico')).toBe(true);
    });

    it('debería rechazar técnicas inválidas', () => {
      // Arrange
      const mockTechniques = [
        { title: 'Dibujo', categorias: ['Digital'] }
      ];
      mockReadFileSync.mockReturnValue(JSON.stringify(mockTechniques));

      // Act & Assert
      expect(groupService.isValidTechniqueCategory('TecnicaInvalida', 'Digital')).toBe(false);
    });

    it('debería rechazar categorías inválidas para una técnica', () => {
      // Arrange
      const mockTechniques = [
        { title: 'Dibujo', categorias: ['Digital', 'Fibra'] }
      ];
      mockReadFileSync.mockReturnValue(JSON.stringify(mockTechniques));

      // Act & Assert
      expect(groupService.isValidTechniqueCategory('Dibujo', 'CategoriaInvalida')).toBe(false);
    });

    it('debería manejar valores null o undefined', () => {
      // Arrange
      const mockTechniques = [
        { title: 'Dibujo', categorias: ['Digital'] }
      ];
      mockReadFileSync.mockReturnValue(JSON.stringify(mockTechniques));

      // Act & Assert
      expect(groupService.isValidTechniqueCategory(null, 'Digital')).toBe(false);
      expect(groupService.isValidTechniqueCategory('Dibujo', undefined)).toBe(false);
      expect(groupService.isValidTechniqueCategory(null, null)).toBe(false);
    });
  });

  describe('createGroup', () => {
    it('debería crear un grupo correctamente', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify([]));
      mockWriteFileSync.mockImplementation(() => {});

      // Act
      const result = await groupService.createGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result.group).toBeDefined();
      expect(result.group.group_name).toBe('Test Group');
      expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
    });

    it('debería rechazar grupo duplicado', async () => {
      // Arrange
      const existingGroup = { ...MOCK_GROUP };
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify([existingGroup]));

      // Act
      const result = await groupService.createGroup(
        existingGroup.technique, 
        existingGroup.category, 
        existingGroup.group_name
      );

      // Assert
      expect(result.error).toBeDefined();
      expect(result.error).toContain('ya existe');
    });

    it('debería crear archivo groups.json si no existe', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(false);
      mockWriteFileSync.mockImplementation(() => {});

      // Act
      const result = await groupService.createGroup('Dibujo', 'Digital', 'New Group');

      // Assert
      expect(result.group).toBeDefined();
      expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
      // Verificar que se llamó con un array que incluye el nuevo grupo
      const writeCall = mockWriteFileSync.mock.calls[0][1];
      const writtenData = JSON.parse(writeCall);
      expect(writtenData).toHaveLength(1);
      expect(writtenData[0].group_name).toBe('New Group');
    });
  });

  describe('getAllGroups', () => {
    it('debería retornar todos los grupos', async () => {
      // Arrange
      const mockGroups = [
        { ...MOCK_GROUP },
        { ...MOCK_GROUP, group_name: 'Group 2' }
      ];
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(mockGroups));

      // Act
      const result = await groupService.getAllGroups();

      // Assert
      expect(result).toHaveLength(2);
      expect(mockReadFileSync).toHaveBeenCalledTimes(1);
    });

    it('debería retornar array vacío si no hay grupos', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(false);

      // Act
      const result = await groupService.getAllGroups();

      // Assert
      expect(result).toEqual([]);
      expect(mockReadFileSync).not.toHaveBeenCalled();
    });
  });

  describe('deleteGroup', () => {
    it('debería eliminar un grupo con todas sus imágenes', async () => {
      // Arrange
      const mockGroups = [MOCK_GROUP];
      const mockImages = [
        { ...MOCK_IMAGE, id: '1', file_url: '/path/image1.jpg' },
        { ...MOCK_IMAGE, id: '2', file_url: '/path/image2.jpg' }
      ];

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync
        .mockReturnValueOnce(JSON.stringify(mockGroups))  // groups.json
        .mockReturnValueOnce(JSON.stringify(mockImages)); // images.json
      mockUnlinkSync.mockImplementation(() => {});
      mockRmSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      // Act
      const result = await groupService.deleteGroup(
        MOCK_GROUP.technique,
        MOCK_GROUP.category,
        MOCK_GROUP.group_name
      );

      // Assert
      expect(result.group_name).toBe(MOCK_GROUP.group_name);
      expect(mockUnlinkSync).toHaveBeenCalledTimes(2); // 2 imágenes
      expect(mockRmSync).toHaveBeenCalledTimes(1); // directorio
      expect(mockWriteFileSync).toHaveBeenCalledTimes(2); // images.json y groups.json
    });

    it('debería lanzar error si el grupo no existe', async () => {
      // Arrange
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify([]));

      // Act & Assert
      await expect(groupService.deleteGroup('Dibujo', 'Digital', 'NoExiste'))
        .rejects.toThrow('Grupo no encontrado');
    });

    it('debería manejar correctamente cuando no hay imágenes asociadas', async () => {
      // Arrange
      const mockGroups = [MOCK_GROUP];
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync
        .mockReturnValueOnce(JSON.stringify(mockGroups))
        .mockReturnValueOnce(JSON.stringify([])); // No images
      mockRmSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      // Act
      const result = await groupService.deleteGroup(
        MOCK_GROUP.technique,
        MOCK_GROUP.category,
        MOCK_GROUP.group_name
      );

      // Assert
      expect(result.group_name).toBe(MOCK_GROUP.group_name);
      expect(mockUnlinkSync).not.toHaveBeenCalled(); // No hay imágenes
      expect(mockRmSync).toHaveBeenCalledTimes(1); // Pero sí elimina directorio
    });
  });
});
