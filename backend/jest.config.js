export default {
  // Usar Node para el entorno de pruebas
  testEnvironment: 'node',

  // Soporte para ES Modules
  transform: {},
  // extensionsToTreatAsEsm removido - Jest lo infiere de "type": "module" en package.json
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Patrones de archivos de prueba
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/data/**',
    '!server.js',
  ],

  // Directorios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/uploads/'
  ],

  // Timeout para pruebas (útil para operaciones de I/O)
  testTimeout: 10000,

  // Mostrar resultados detallados
  verbose: true,

  // Limpiar mocks automáticamente entre pruebas
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Configuración de cobertura
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
