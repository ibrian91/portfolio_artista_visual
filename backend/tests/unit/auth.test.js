import { jest } from '@jest/globals';

// Mock de jsonwebtoken
const mockJwtVerify = jest.fn();
await jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: mockJwtVerify
  },
  verify: mockJwtVerify
}));

// Importar después del mock
const auth = (await import('../../src/middleware/auth.js'));
const { authenticateToken, verifyAccessKey, verifyUploadKey, optionalAuth, validateUploadKey } = auth;

describe('Auth Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    // Mock de req, res, next
    req = {
      headers: {},
      body: {},
      query: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    
    // Configurar variables de entorno
    process.env.JWT_SECRET = 'test_jwt_secret';
    process.env.ACCESS_KEY = 'test_access_key';
    process.env.UPLOAD_SECRET = 'test_upload_secret';
    
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('debería rechazar request sin token', () => {
      // Arrange - sin header de autorización
      req.headers = {};

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token de acceso requerido',
        message: 'Debe proporcionar un token de autorización válido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería rechazar token inválido', () => {
      // Arrange
      req.headers.authorization = 'Bearer invalid_token';
      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(new Error('Token inválido'), null);
      });

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido o ha expirado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería aceptar token válido y continuar', () => {
      // Arrange
      const mockDecoded = { userId: '123', email: 'test@test.com' };
      req.headers.authorization = 'Bearer valid_token';
      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería manejar header sin Bearer prefix', () => {
      // Arrange - token sin "Bearer "
      req.headers.authorization = 'invalid_format';

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('verifyAccessKey', () => {
    it('debería rechazar sin access_key', () => {
      // Arrange - sin clave
      req.body = {};

      // Act
      verifyAccessKey(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Clave de acceso incorrecta',
        message: 'No tiene permisos para realizar esta acción'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería rechazar access_key incorrecta', () => {
      // Arrange
      req.body.access_key = 'wrong_key';

      // Act
      verifyAccessKey(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('debería aceptar access_key correcta en body', () => {
      // Arrange
      req.body.access_key = 'test_access_key';

      // Act
      verifyAccessKey(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería aceptar access_key correcta en query', () => {
      // Arrange
      req.query.access_key = 'test_access_key';

      // Act
      verifyAccessKey(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('verifyUploadKey', () => {
    it('debería rechazar sin upload_key', () => {
      // Arrange
      req.body = {};

      // Act
      verifyUploadKey(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Clave de subida incorrecta',
        message: 'No tiene permisos para subir archivos'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería rechazar upload_key incorrecta', () => {
      // Arrange
      req.body.upload_key = 'wrong_upload_key';

      // Act
      verifyUploadKey(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('debería aceptar upload_key correcta', () => {
      // Arrange
      req.body.upload_key = 'test_upload_secret';

      // Act
      verifyUploadKey(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('debería continuar sin token estableciendo user como null', () => {
      // Arrange - sin token
      req.headers = {};

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería establecer user como null con token inválido', () => {
      // Arrange
      req.headers.authorization = 'Bearer invalid_token';
      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid'), null);
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('debería establecer user con token válido', () => {
      // Arrange
      const mockDecoded = { userId: '456' };
      req.headers.authorization = 'Bearer valid_token';
      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('validateUploadKey', () => {
    it('debería retornar true con clave correcta', () => {
      // Act
      const result = validateUploadKey('test_upload_secret');

      // Assert
      expect(result).toBe(true);
    });

    it('debería retornar false con clave incorrecta', () => {
      // Act
      const result = validateUploadKey('wrong_key');

      // Assert
      expect(result).toBe(false);
    });

    it('debería retornar false con undefined', () => {
      // Act
      const result = validateUploadKey(undefined);

      // Assert
      expect(result).toBe(false);
    });

    it('debería retornar false con null', () => {
      // Act
      const result = validateUploadKey(null);

      // Assert
      expect(result).toBe(false);
    });

    it('debería retornar false con string vacío', () => {
      // Act
      const result = validateUploadKey('');

      // Assert
      expect(result).toBe(false);
    });
  });
});
