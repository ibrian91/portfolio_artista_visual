import { jest } from '@jest/globals';

// Mock de multer
const MulterError = class MulterError extends Error {
  constructor(code, field) {
    super(code);
    this.code = code;
    this.field = field;
    this.name = 'MulterError';
  }
};

const mockDiskStorage = jest.fn(() => ({}));
const mockMulter = jest.fn(() => ({
  single: jest.fn(),
  array: jest.fn()
}));
mockMulter.diskStorage = mockDiskStorage;
mockMulter.MulterError = MulterError;

// Mock de multer module
await jest.unstable_mockModule('multer', () => ({
  default: mockMulter
}));

// Mock de Sharp para evitar errores
await jest.unstable_mockModule('sharp', () => ({
  default: jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue({})
  }))
}));

// Mock de database
await jest.unstable_mockModule('../../src/config/database.js', () => ({
  default: {
    query: jest.fn()
  }
}));

// Importar después del mock
const { handleMulterError } = await import('../../src/controllers/uploadController.js');
const multer = await import('multer');

describe('handleMulterError Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      file: {
        path: '/tmp/test.jpg'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('Errores de Multer', () => {
    it('debería manejar LIMIT_FILE_SIZE con status 400', () => {
      const error = new MulterError('LIMIT_FILE_SIZE');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Archivo demasiado grande',
        message: 'El archivo excede el tamaño máximo permitido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar LIMIT_FILE_COUNT con status 400', () => {
      const error = new MulterError('LIMIT_FILE_COUNT');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Demasiados archivos',
        message: 'Se excedió el número máximo de archivos permitidos'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar LIMIT_UNEXPECTED_FILE con status 400', () => {
      const error = new MulterError('LIMIT_UNEXPECTED_FILE');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Campo de archivo inesperado',
        message: 'Se recibió un archivo en un campo no esperado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería pasar errores de multer no manejados a next', () => {
      const error = new MulterError('UNKNOWN_ERROR');

      handleMulterError(error, req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('Errores de tipo de archivo', () => {
    it('debería manejar error de archivo no permitido', () => {
      const error = new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, webp, gif)');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Tipo de archivo no permitido',
        message: error.message
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar variaciones del mensaje de archivo no permitido', () => {
      const error = new Error('Solo se permiten archivos de imagen');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Tipo de archivo no permitido',
        message: error.message
      });
    });
  });

  describe('Errores genéricos', () => {
    it('debería pasar errores no relacionados con multer a next', () => {
      const error = new Error('Error genérico del servidor');

      handleMulterError(error, req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });

    it('debería pasar errores de base de datos a next', () => {
      const error = new Error('Database connection failed');
      error.code = 'ECONNREFUSED';

      handleMulterError(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('debería manejar errores sin mensaje', () => {
      const error = new Error();

      handleMulterError(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('Verificación de flujo', () => {
    it('no debería llamar next cuando maneja errores de multer', () => {
      const error = new MulterError('LIMIT_FILE_SIZE');

      handleMulterError(error, req, res, next);

      expect(next).not.toHaveBeenCalled();
    });

    it('debería retornar respuesta completa para errores manejados', () => {
      const error = new MulterError('LIMIT_FILE_COUNT');

      const result = handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toHaveProperty('error');
      expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });

    it('debería mantener el objeto de error original al pasar a next', () => {
      const originalError = new Error('Test error');
      originalError.customProperty = 'test';

      handleMulterError(originalError, req, res, next);

      expect(next).toHaveBeenCalledWith(originalError);
      expect(next.mock.calls[0][0].customProperty).toBe('test');
    });
  });

  describe('Casos edge', () => {
    it('debería manejar req sin file', () => {
      req.file = undefined;
      const error = new MulterError('LIMIT_FILE_SIZE');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debería manejar múltiples llamadas consecutivas', () => {
      const error1 = new MulterError('LIMIT_FILE_SIZE');
      const error2 = new MulterError('LIMIT_FILE_COUNT');

      handleMulterError(error1, req, res, next);
      
      // Reset mocks
      res.status.mockClear();
      res.json.mockClear();
      
      handleMulterError(error2, req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('debería manejar error con field en MulterError', () => {
      const error = new MulterError('LIMIT_UNEXPECTED_FILE', 'avatar');

      handleMulterError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
