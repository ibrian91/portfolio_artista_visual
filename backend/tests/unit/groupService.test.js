import { jest } from '@jest/globals';
import { MOCK_GROUP, MOCK_IMAGE } from '../setup.js';

// Crear mocks antes de importar el servicio
const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockRmSync = jest.fn();
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
    rmSync: mockRmSync,
    unlinkSync: mockUnlinkSync
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  rmSync: mockRmSync,
  unlinkSync: mockUnlinkSync
}));

// Mock del pool de MySQL
await jest.unstable_mockModule('../../src/config/database.js', () => ({
  default: mockPool
}));

// Ahora importar el servicio (después del mock)
const groupService = (await import('../../src/services/groupService.js')).default;

describe('GroupService - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockClear();
    mockReadFileSync.mockClear();
    mockRmSync.mockClear();
    mockUnlinkSync.mockClear();
    mockQuery.mockClear();
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
      // Mock para verificar si existe (retorna array vacío)
      mockQuery.mockResolvedValueOnce([[]]);
      // Mock para INSERT (retorna resultado de inserción)
      const mockResult = {
        insertId: 1,
        affectedRows: 1
      };
      mockQuery.mockResolvedValueOnce([mockResult]);

      // Act
      const result = await groupService.createGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result.group).toBeDefined();
      expect(result.group.group_name).toBe('Test Group');
      expect(result.group.technique).toBe('Dibujo');
      expect(result.group.category).toBe('Digital');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM groups_table WHERE'),
        ['Dibujo', 'Digital', 'Test Group']
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO groups_table'),
        ['Dibujo', 'Digital', 'Test Group']
      );
    });

    it('debería rechazar grupo duplicado', async () => {
      // Arrange
      const existingGroup = { 
        id: 1, 
        technique: 'Dibujo', 
        category: 'Digital', 
        group_name: 'Test Group' 
      };
      mockQuery.mockResolvedValueOnce([[existingGroup]]); // Grupo existe

      // Act
      const result = await groupService.createGroup('Dibujo', 'Digital', 'Test Group');

      // Assert
      expect(result.error).toBeDefined();
      expect(result.error).toContain('ya existe');
    });

    it('debería manejar errores de base de datos', async () => {
      // Arrange
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(groupService.createGroup('Dibujo', 'Digital', 'Test Group'))
        .rejects.toThrow('Database error');
    });
  });

  describe('getAllGroups', () => {
    it('debería retornar todos los grupos', async () => {
      // Arrange
      const mockGroups = [
        { id: 1, technique: 'Dibujo', category: 'Digital', group_name: 'Group 1', created_at: new Date() },
        { id: 2, technique: 'Dibujo', category: 'Fibra', group_name: 'Group 2', created_at: new Date() }
      ];
      mockQuery.mockResolvedValueOnce([mockGroups]);

      // Act
      const result = await groupService.getAllGroups();

      // Assert
      expect(result).toHaveLength(2);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM groups_table')
      );
    });

    it('debería retornar array vacío si no hay grupos', async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce([[]]);

      // Act
      const result = await groupService.getAllGroups();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('deleteGroup', () => {
    it('debería eliminar un grupo con todas sus imágenes', async () => {
      // Arrange
      const mockGroup = {
        id: 1,
        technique: 'Dibujo',
        category: 'Digital',
        group_name: 'TestGroup'
      };
      const mockImages = [
        { 
          id: 1, 
          file_url: '/uploads/portfolio/Dibujo/Digital/TestGroup/image1.jpg',
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'TestGroup'
        },
        { 
          id: 2, 
          file_url: '/uploads/portfolio/Dibujo/Digital/TestGroup/image2.jpg',
          technique: 'Dibujo',
          category: 'Digital',
          group_name: 'TestGroup'
        }
      ];

      // Mock para SELECT group (verificar que existe)
      mockQuery.mockResolvedValueOnce([[mockGroup]]);
      // Mock para SELECT images
      mockQuery.mockResolvedValueOnce([mockImages]);
      // Mock para DELETE images (aunque CASCADE lo maneja, el código no lo usa explícitamente)
      // Mock para DELETE group
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

      mockExistsSync.mockReturnValue(true);
      mockUnlinkSync.mockImplementation(() => {});
      mockRmSync.mockImplementation(() => {});

      // Act
      const result = await groupService.deleteGroup('Dibujo', 'Digital', 'TestGroup');

      // Assert
      expect(result.group_name).toBe('TestGroup');
      expect(mockUnlinkSync).toHaveBeenCalledTimes(2); // 2 imágenes
      expect(mockRmSync).toHaveBeenCalledTimes(1); // directorio
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM groups_table WHERE'),
        ['Dibujo', 'Digital', 'TestGroup']
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM images'),
        ['Dibujo', 'Digital', 'TestGroup']
      );
    });

    it('debería lanzar error si el grupo no existe', async () => {
      // Arrange
      mockQuery.mockResolvedValueOnce([[]]); // No group found

      // Act & Assert
      await expect(groupService.deleteGroup('Dibujo', 'Digital', 'NoExiste'))
        .rejects.toThrow('Grupo no encontrado');
    });

    it('debería manejar correctamente cuando no hay imágenes asociadas', async () => {
      // Arrange
      const mockGroup = {
        id: 1,
        technique: 'Dibujo',
        category: 'Digital',
        group_name: 'TestGroup'
      };

      mockQuery.mockResolvedValueOnce([[mockGroup]]); // Group exists
      mockQuery.mockResolvedValueOnce([[]]); // No images
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]); // Group deleted

      mockExistsSync.mockReturnValue(true);
      mockRmSync.mockImplementation(() => {});

      // Act
      const result = await groupService.deleteGroup('Dibujo', 'Digital', 'TestGroup');

      // Assert
      expect(result.group_name).toBe('TestGroup');
      expect(mockUnlinkSync).not.toHaveBeenCalled(); // No hay imágenes
      expect(mockRmSync).toHaveBeenCalledTimes(1); // Pero sí elimina directorio
    });
  });
});
