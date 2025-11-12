/**
 * Tests unitarios para uploadController.uploadImages()
 * Función: Subir y procesar múltiples imágenes con optimización Sharp
 * Cobertura: Validaciones, procesamiento exitoso, errores, limpieza
 */

import { jest } from '@jest/globals';

// ===== MOCKS =====
const mockUnlink = jest.fn();
const mockMkdir = jest.fn();
const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();
const mockStat = jest.fn();
const mockResize = jest.fn();
const mockJpeg = jest.fn();
const mockToFile = jest.fn();
const mockSharp = jest.fn();

// Mock fs/promises
jest.unstable_mockModule('fs/promises', () => ({
  default: {
    unlink: mockUnlink,
    mkdir: mockMkdir,
    readFile: mockReadFile,
    writeFile: mockWriteFile,
    stat: mockStat
  }
}));

// Mock sharp
jest.unstable_mockModule('sharp', () => ({
  default: mockSharp
}));

// Import controller AFTER mocks
const { default: uploadController } = await import('../../src/controllers/uploadController.js');

// Variables globales para los tests
let req, res;

describe('uploadController.uploadImages() - Unit Tests', () => {
  
  beforeAll(() => {
    // Setup default mock implementations
    mockMkdir.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue('[]');
    mockWriteFile.mockResolvedValue(undefined);
    mockStat.mockResolvedValue({ isFile: () => true });
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default behavior for common mocks
    mockUnlink.mockResolvedValue(undefined);
    mockToFile.mockResolvedValue(undefined);
    mockSharp.mockReturnValue({
      resize: mockResize.mockReturnThis(),
      jpeg: mockJpeg.mockReturnThis(),
      toFile: mockToFile
    });

    // Setup request/response objects
    req = {
      body: {
        upload_key: 'test_secret',
        upload_type: 'portfolio'
      },
      files: []
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
  // GRUPO 1: Validaciones básicas
  // ========================================
  describe('Validaciones básicas', () => {
    
    it('debería retornar 400 si no se proporcionan archivos', async () => {
      req.files = undefined;

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No se proporcionaron archivos',
        message: 'Debe seleccionar al menos una imagen para subir'
      });
    });

    it('debería retornar 400 si req.files está vacío', async () => {
      req.files = [];

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No se proporcionaron archivos',
        message: 'Debe seleccionar al menos una imagen para subir'
      });
    });

    it('debería retornar 401 con clave incorrecta y eliminar archivos', async () => {
      req.body.upload_key = 'wrong_key';
      req.files = [
        { path: '/uploads/test1.jpg', filename: 'test1.jpg', originalname: 'img1.jpg' },
        { path: '/uploads/test2.jpg', filename: 'test2.jpg', originalname: 'img2.jpg' }
      ];

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Clave de acceso incorrecta',
        message: 'No tiene permisos para subir archivos'
      });
      // Verificar que se eliminaron ambos archivos
      expect(mockUnlink).toHaveBeenCalledTimes(2);
      expect(mockUnlink).toHaveBeenCalledWith('/uploads/test1.jpg');
      expect(mockUnlink).toHaveBeenCalledWith('/uploads/test2.jpg');
    });
  });

  // ========================================
  // GRUPO 2: Procesamiento exitoso
  // ========================================
  describe('Procesamiento exitoso', () => {
    
    it('debería procesar un solo archivo exitosamente', async () => {
      req.files = [
        { path: '/uploads/test.jpg', filename: 'test.jpg', originalname: 'original.jpg' }
      ];

      await uploadController.uploadImages(req, res);

      expect(mockSharp).toHaveBeenCalledWith('/uploads/test.jpg');
      expect(mockResize).toHaveBeenCalledWith(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true
      });
      expect(mockJpeg).toHaveBeenCalledWith({
        quality: 85,
        progressive: true
      });
      expect(mockToFile).toHaveBeenCalled();
      expect(mockUnlink).toHaveBeenCalledWith('/uploads/test.jpg'); // Eliminar original
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '1 archivo(s) subido(s) exitosamente',
        files: expect.arrayContaining([
          expect.objectContaining({
            originalName: 'original.jpg',
            optimizedFileName: expect.stringContaining('optimized-')
          })
        ]),
        upload_type: 'portfolio'
      }));
    });

    it('debería procesar múltiples archivos exitosamente', async () => {
      req.files = [
        { path: '/uploads/test1.jpg', filename: 'test1.jpg', originalname: 'img1.jpg' },
        { path: '/uploads/test2.jpg', filename: 'test2.jpg', originalname: 'img2.jpg' },
        { path: '/uploads/test3.jpg', filename: 'test3.jpg', originalname: 'img3.jpg' }
      ];

      await uploadController.uploadImages(req, res);

      expect(mockSharp).toHaveBeenCalledTimes(3);
      expect(mockUnlink).toHaveBeenCalledTimes(3); // Eliminar los 3 originales
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '3 archivo(s) subido(s) exitosamente',
        files: expect.any(Array)
      }));
      const response = res.json.mock.calls[0][0];
      expect(response.files).toHaveLength(3);
    });

    it('debería respetar el upload_type personalizado', async () => {
      req.body.upload_type = 'gallery';
      req.files = [
        { path: '/uploads/test.jpg', filename: 'test.jpg', originalname: 'img.jpg' }
      ];

      await uploadController.uploadImages(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        upload_type: 'gallery'
      }));
    });

    it('debería usar "portfolio" como upload_type default', async () => {
      delete req.body.upload_type;
      req.files = [
        { path: '/uploads/test.jpg', filename: 'test.jpg', originalname: 'img.jpg' }
      ];

      await uploadController.uploadImages(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        upload_type: 'portfolio'
      }));
    });
  });

  // ========================================
  // GRUPO 3: Manejo de errores parciales
  // ========================================
  describe('Manejo de errores parciales', () => {
    
    it('debería procesar archivos correctamente aunque algunos fallen', async () => {
      req.files = [
        { path: '/uploads/test1.jpg', filename: 'test1.jpg', originalname: 'img1.jpg' },
        { path: '/uploads/test2.jpg', filename: 'test2.jpg', originalname: 'img2.jpg' },
        { path: '/uploads/test3.jpg', filename: 'test3.jpg', originalname: 'img3.jpg' }
      ];

      // Hacer que el segundo archivo falle
      mockSharp
        .mockReturnValueOnce({
          resize: mockResize.mockReturnThis(),
          jpeg: mockJpeg.mockReturnThis(),
          toFile: mockToFile.mockResolvedValueOnce(undefined)
        })
        .mockImplementationOnce(() => {
          throw new Error('Sharp processing failed');
        })
        .mockReturnValueOnce({
          resize: mockResize.mockReturnThis(),
          jpeg: mockJpeg.mockReturnThis(),
          toFile: mockToFile.mockResolvedValueOnce(undefined)
        });

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '2 archivo(s) subido(s) exitosamente', // Solo 2 de 3
        files: expect.any(Array)
      }));
      const response = res.json.mock.calls[0][0];
      expect(response.files).toHaveLength(2); // Solo los exitosos
    });

    it('debería retornar 500 si todos los archivos fallan al procesarse', async () => {
      req.files = [
        { path: '/uploads/test1.jpg', filename: 'test1.jpg', originalname: 'img1.jpg' },
        { path: '/uploads/test2.jpg', filename: 'test2.jpg', originalname: 'img2.jpg' }
      ];

      // Hacer que todos fallen
      mockSharp.mockImplementation(() => {
        throw new Error('Sharp always fails');
      });

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error procesando archivos',
        message: 'No se pudo procesar ningún archivo'
      });
      // Verificar que se intentó eliminar los archivos fallidos
      expect(mockUnlink).toHaveBeenCalledTimes(2);
    });

    it('debería limpiar archivo original incluso si unlink falla', async () => {
      req.files = [
        { path: '/uploads/test.jpg', filename: 'test.jpg', originalname: 'img.jpg' }
      ];

      // Simular fallo en Sharp pero exitoso toFile
      mockSharp.mockReturnValueOnce({
        resize: mockResize.mockReturnThis(),
        jpeg: mockJpeg.mockReturnThis(),
        toFile: mockToFile.mockRejectedValueOnce(new Error('toFile failed'))
      });

      mockUnlink.mockRejectedValueOnce(new Error('unlink failed'));

      await uploadController.uploadImages(req, res);

      // Debe intentar eliminar aunque falle
      expect(mockUnlink).toHaveBeenCalledWith('/uploads/test.jpg');
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ========================================
  // GRUPO 4: Manejo de errores generales
  // ========================================
  describe('Manejo de errores generales', () => {
    
    it('debería manejar error general y limpiar todos los archivos', async () => {
      req.files = [
        { path: '/uploads/test1.jpg', filename: 'test1.jpg', originalname: 'img1.jpg' },
        { path: '/uploads/test2.jpg', filename: 'test2.jpg', originalname: 'img2.jpg' }
      ];

      // Simular error catastrófico (por ejemplo, req.body es null)
      req.body = null;

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error interno del servidor',
        message: 'No se pudieron subir los archivos'
      });
      // Verificar limpieza de archivos
      expect(mockUnlink).toHaveBeenCalledTimes(2);
    });

    it('debería manejar req.files sin limpiar si es undefined en catch', async () => {
      req.files = undefined;
      req.body = null; // Provocar error

      await uploadController.uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400); // Ya falla en la validación inicial
      expect(mockUnlink).not.toHaveBeenCalled();
    });
  });
});
