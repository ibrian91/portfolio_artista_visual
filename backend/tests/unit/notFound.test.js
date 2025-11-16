import { jest } from '@jest/globals';
import { notFound } from '../../src/middleware/notFound.js';

describe('notFound Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/ruta-inexistente'
    };
    res = {
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('Ruta no encontrada', () => {
    it('debería retornar status 404', () => {
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debería llamar next() con un error', () => {
      notFound(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('debería incluir la URL en el mensaje de error', () => {
      notFound(req, res, next);

      const errorPassed = next.mock.calls[0][0];
      expect(errorPassed.message).toContain('/api/ruta-inexistente');
      expect(errorPassed.message).toContain('Ruta no encontrada');
    });

    it('debería manejar rutas con query params', () => {
      req.originalUrl = '/api/test?param=value';

      notFound(req, res, next);

      const errorPassed = next.mock.calls[0][0];
      expect(errorPassed.message).toContain('/api/test?param=value');
    });

    it('debería manejar rutas raíz', () => {
      req.originalUrl = '/';

      notFound(req, res, next);

      const errorPassed = next.mock.calls[0][0];
      expect(errorPassed.message).toContain('/');
    });

    it('debería manejar rutas largas', () => {
      req.originalUrl = '/api/muy/larga/ruta/que/no/existe/test';

      notFound(req, res, next);

      const errorPassed = next.mock.calls[0][0];
      expect(errorPassed.message).toContain('/api/muy/larga/ruta/que/no/existe/test');
    });

    it('debería crear una instancia de Error', () => {
      notFound(req, res, next);

      const errorPassed = next.mock.calls[0][0];
      expect(errorPassed).toBeInstanceOf(Error);
    });

    it('debería establecer status antes de llamar next', () => {
      const callOrder = [];
      res.status = jest.fn(() => {
        callOrder.push('status');
        return res;
      });
      next = jest.fn(() => {
        callOrder.push('next');
      });

      notFound(req, res, next);

      expect(callOrder).toEqual(['status', 'next']);
    });
  });
});
