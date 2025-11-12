# Tests - Backend Portfolio

## 📋 Estructura de Tests

```
tests/
├── setup.js              # Configuración global y datos mock
├── unit/                 # Tests unitarios (lógica de negocio)
│   ├── imageService.test.js
│   └── groupService.test.js
├── integration/          # Tests de integración (HTTP endpoints)
│   ├── imageRoutes.test.js
│   └── groupRoutes.test.js
└── fixtures/            # Datos de prueba reutilizables
```

## 🚀 Instalación de Dependencias

```bash
npm install --save-dev jest supertest @faker-js/faker
```

## ▶️ Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Tests con reporte de cobertura
npm run test:coverage

# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration
```

## 📊 Cobertura de Código

El proyecto está configurado con un threshold mínimo de **70%** de cobertura en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (declaraciones)

## 🧪 Tipos de Tests

### Tests Unitarios (`tests/unit/`)
Prueban la lógica de negocio de forma aislada:
- **imageService.test.js**: Operaciones CRUD de imágenes
- **groupService.test.js**: Validación, creación y eliminación de grupos

**Características:**
- Usan `jest.mock('fs')` para mockear file system
- No requieren servidor corriendo
- Se ejecutan rápidamente
- Prueban funciones individuales

### Tests de Integración (`tests/integration/`)
Prueban los endpoints HTTP completos:
- **imageRoutes.test.js**: GET y DELETE de imágenes
- **groupRoutes.test.js**: GET y DELETE de grupos

**Características:**
- Usan `supertest` para hacer requests HTTP
- Mockean servicios pero prueban routes reales
- Verifican status codes y respuestas JSON
- Prueban autenticación y validaciones

## 🔧 Configuración

### jest.config.js
```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Variables de Entorno para Tests
Definidas en `tests/setup.js`:
- `NODE_ENV=test`
- `PORT=3001`
- `UPLOAD_SECRET=test_secret_key`

## 📝 Agregar Nuevos Tests

### Test Unitario
```javascript
import { jest } from '@jest/globals';
import myService from '../../src/services/myService.js';

jest.mock('fs');

describe('MyService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería hacer algo específico', async () => {
    // Arrange - preparar datos
    const input = { id: 1 };
    
    // Act - ejecutar función
    const result = await myService.doSomething(input);
    
    // Assert - verificar resultado
    expect(result).toBe(expected);
  });
});
```

### Test de Integración
```javascript
import request from 'supertest';
import express from 'express';
import myRoutes from '../../src/routes/myRoutes.js';

jest.mock('../../src/services/myService.js');

describe('My Routes - Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/my', myRoutes);
  });

  it('debería retornar 200 en GET exitoso', async () => {
    const response = await request(app).get('/api/my');
    expect(response.status).toBe(200);
  });
});
```

## 🎯 Mejores Prácticas

1. **Nombres descriptivos**: Tests en español, claros y específicos
2. **Arrange-Act-Assert**: Estructura clara en cada test
3. **Mocking apropiado**: Mock solo lo necesario (fs, servicios externos)
4. **Limpieza**: `beforeEach(() => jest.clearAllMocks())`
5. **Tests independientes**: No depender del orden de ejecución
6. **Cobertura de casos**: Success, errors, edge cases

## 🐛 Debugging Tests

```bash
# Con output detallado
npm test -- --verbose

# Test específico
npm test -- imageService.test.js

# Con breakpoints (VSCode)
# Agregar configuración en .vscode/launch.json
```

## 📦 Datos Mock

Los datos mock están centralizados en `tests/setup.js`:
- `MOCK_IMAGE`: Imagen de ejemplo
- `MOCK_GROUP`: Grupo de ejemplo
- `VALID_TECHNIQUES`: Técnicas válidas
- `VALID_CATEGORIES`: Categorías por técnica

## 🔍 Verificar Cobertura

Después de `npm run test:coverage`, revisar:
- `coverage/lcov-report/index.html` en navegador
- Terminal mostrará tabla de cobertura

## ⚠️ Troubleshooting

**Error: Cannot use import statement outside a module**
- Verificar `"type": "module"` en package.json
- Usar `node --experimental-vm-modules` en script de test

**Error: Cannot find module**
- Verificar paths relativos en imports
- Asegurar que moduleNameMapper en jest.config esté correcto

**Tests muy lentos**
- Separar unit de integration: `npm run test:unit`
- Verificar que no haya operaciones I/O reales
- Usar mocks apropiadamente
