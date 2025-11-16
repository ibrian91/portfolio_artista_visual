import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middleware/errorHandler.js';

describe('errorHandler Middleware - Unit Tests', () => {
  let req, res, next, consoleErrorSpy;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset NODE_ENV
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Errores de base de datos', () => {
    it('debería manejar error de conexión (ECONNREFUSED) con status 500', () => {
      const error = new Error('Connection refused');
      error.code = 'ECONNREFUSED';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error de conexión a la base de datos'
      });
    });

    it('debería manejar duplicado MySQL (ER_DUP_ENTRY) con status 409', () => {
      const error = new Error('Duplicate entry');
      error.code = 'ER_DUP_ENTRY';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Recurso duplicado'
      });
    });

    it('debería manejar error de clave foránea (ER_NO_REFERENCED_ROW_2) con status 400', () => {
      const error = new Error('Foreign key constraint');
      error.code = 'ER_NO_REFERENCED_ROW_2';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Referencia inválida - el recurso padre no existe'
      });
    });

    it('debería manejar error de sintaxis SQL (ER_PARSE_ERROR) con status 500', () => {
      const error = new Error('Parse error in SQL');
      error.code = 'ER_PARSE_ERROR';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error de sintaxis en consulta'
      });
    });
  });

  describe('Errores de validación', () => {
    it('debería manejar ValidationError con status 400', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        name: { message: 'Name is required' },
        email: { message: 'Email is invalid' }
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name is required, Email is invalid'
      });
    });

    it('debería manejar CastError con status 400', () => {
      const error = new Error('Cast failed');
      error.name = 'CastError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'ID de recurso inválido'
      });
    });

    it('debería manejar JSON malformado con status 400', () => {
      const error = new Error('Invalid JSON');
      error.type = 'entity.parse.failed';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'JSON malformado en el cuerpo de la petición'
      });
    });
  });

  describe('Errores de JWT', () => {
    it('debería manejar JsonWebTokenError con status 401', () => {
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token de autorización inválido'
      });
    });

    it('debería manejar TokenExpiredError con status 401', () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token de autorización expirado'
      });
    });
  });

  describe('Errores genéricos', () => {
    it('debería manejar error genérico con status 500', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Something went wrong'
      });
    });

    it('debería usar mensaje por defecto si no hay mensaje en el error', () => {
      const error = new Error();
      error.message = '';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error interno del servidor'
      });
    });

    it('debería usar statusCode del error si existe', () => {
      const error = new Error('Custom error');
      error.statusCode = 403;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('Entorno de desarrollo vs producción', () => {
    it('debería incluir stack y details en desarrollo', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Dev error');
      error.stack = 'Error stack trace...';

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('stack');
      expect(jsonCall).toHaveProperty('details');
      expect(jsonCall.stack).toBe('Error stack trace...');
    });

    it('NO debería incluir stack en producción', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Prod error');
      error.stack = 'Error stack trace...';

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('stack');
      expect(jsonCall).not.toHaveProperty('details');
    });

    it('NO debería incluir stack en test', () => {
      process.env.NODE_ENV = 'test';
      const error = new Error('Test error');
      error.stack = 'Error stack trace...';

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('stack');
      expect(jsonCall).not.toHaveProperty('details');
    });
  });

  describe('Logging', () => {
    it('debería loguear el stack del error', () => {
      const error = new Error('Test error');
      error.stack = 'Full stack trace here';

      errorHandler(error, req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error Stack:', 'Full stack trace here');
    });

    it('debería loguear incluso errores sin stack', () => {
      const error = new Error('No stack');
      delete error.stack;

      errorHandler(error, req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Respuesta consistente', () => {
    it('siempre debería incluir success: false', () => {
      const error = new Error('Any error');

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.success).toBe(false);
    });

    it('siempre debería incluir un mensaje de error', () => {
      const error = new Error('Test');

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('error');
      expect(typeof jsonCall.error).toBe('string');
    });

    it('no debería llamar next()', () => {
      const error = new Error('Test');

      errorHandler(error, req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Casos edge', () => {
    it('debería manejar error sin propiedades', () => {
      const error = {};

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('debería manejar error con propiedades customizadas', () => {
      const error = new Error('Custom');
      error.customProp = 'value';
      error.statusCode = 422;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
    });

    it('debería manejar múltiples errores de validación', () => {
      const error = new Error('Validation');
      error.name = 'ValidationError';
      error.errors = {
        field1: { message: 'Error 1' },
        field2: { message: 'Error 2' },
        field3: { message: 'Error 3' }
      };

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.error).toContain('Error 1');
      expect(jsonCall.error).toContain('Error 2');
      expect(jsonCall.error).toContain('Error 3');
    });

    it('debería preservar el objeto error original', () => {
      const originalError = new Error('Original');
      originalError.code = 'TEST_CODE';
      originalError.extra = 'data';

      errorHandler(originalError, req, res, next);

      // El error no debe ser modificado permanentemente
      expect(originalError.code).toBe('TEST_CODE');
      expect(originalError.extra).toBe('data');
    });
  });
});
