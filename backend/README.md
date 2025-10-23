# Portfolio Backend

Backend para el portfolio de arte desarrollado en Node.js con Express y MySQL.

## 🚀 Características

- **API RESTful** para manejo de técnicas, categorías, colecciones e items del portfolio
- **Subida de imágenes** con optimización automática usando Sharp
- **Base de datos MySQL** con estructura relacional completa
- **Autenticación** con JWT y claves de acceso
- **Validación de datos** y manejo robusto de errores
- **Rate limiting** y medidas de seguridad
- **Documentación completa** de endpoints

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (BD, etc.)
│   ├── controllers/     # Lógica de controladores
│   ├── middleware/      # Middleware personalizado
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Servicios auxiliares
│   └── utils/           # Utilidades
├── database/            # Scripts SQL y migraciones
├── uploads/             # Archivos subidos (no en git)
│   └── images/
│       ├── techniques/
│       ├── portfolio/
│       └── biography/
├── public/              # Archivos públicos
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── server.js           # Punto de entrada
```

## 🛠 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=5000

# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=portfolio_db

# Claves de seguridad
JWT_SECRET=tu_jwt_secret_muy_seguro
ACCESS_KEY=mb_Acceso2025-Form
UPLOAD_SECRET=tu_clave_secreta_para_subir

# Frontend URL para CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Base de Datos

#### Instalar MySQL:
- **Windows**: Descargar desde [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

#### Crear la base de datos:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Ejecutar el schema:

```bash
mysql -u root -p portfolio_db < database/schema.sql
```

### 4. Iniciar el Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📋 API Endpoints

### Técnicas
- `GET /api/techniques` - Obtener todas las técnicas
- `GET /api/techniques/structured` - Obtener técnicas con estructura completa
- `GET /api/techniques/:id` - Obtener técnica específica
- `POST /api/techniques` - Crear nueva técnica
- `PUT /api/techniques/:id` - Actualizar técnica
- `DELETE /api/techniques/:id` - Eliminar técnica

### Portfolio
- `GET /api/portfolio` - Obtener todos los items
- `GET /api/portfolio/search?q=termino` - Buscar items
- `GET /api/portfolio/collection/:id` - Items por colección
- `GET /api/portfolio/technique/:id` - Items por técnica
- `POST /api/portfolio` - Crear nuevo item
- `PUT /api/portfolio/:id` - Actualizar item
- `DELETE /api/portfolio/:id` - Eliminar item

### Subida de Archivos
- `POST /api/upload/images` - Subir múltiples imágenes
- `POST /api/upload/portfolio-image` - Subir imagen específica desde formulario
- `GET /api/upload/files` - Obtener archivos subidos
- `GET /api/upload/stats` - Estadísticas de archivos
- `DELETE /api/upload/files/:id` - Eliminar archivo

### Imágenes
- `GET /uploads/images/:type/:filename` - Servir imagen estática
- `GET /api/images/image/:type/:filename` - Obtener imagen con información

### Autenticación
- `POST /api/auth/login` - Login de administrador
- `POST /api/auth/verify` - Verificar token JWT
- `POST /api/auth/verify-key` - Verificar clave de acceso

## 🔐 Autenticación y Seguridad

### Claves de Acceso
El sistema utiliza múltiples niveles de autenticación:

1. **ACCESS_KEY**: Para operaciones CRUD básicas
2. **UPLOAD_SECRET**: Para subida de archivos
3. **JWT**: Para sesiones de administrador

### Rate Limiting
- 100 requests por IP cada 15 minutos
- Límites específicos en endpoints de subida

### Validación de Archivos
- Solo imágenes: JPEG, PNG, GIF, WebP
- Tamaño máximo: 10MB por archivo
- Optimización automática con Sharp

## 🗄 Base de Datos

### Tablas Principales:
- `techniques` - Técnicas principales (Dibujo, Pintura, Fotografía)
- `categories` - Categorías dentro de técnicas (Lápiz, Digital, etc.)
- `collections` - Colecciones dentro de categorías (Misceláneas, Música)
- `portfolio_items` - Items/obras principales
- `item_variants` - Variantes de cada item
- `file_uploads` - Registro de archivos subidos
- `biography` - Información de biografía
- `contact_messages` - Mensajes de contacto

## 🚢 Despliegue a Producción

### Preparar para VPS:

1. **Exportar base de datos local**:
```bash
mysqldump -u root -p portfolio_db > backup_portfolio.sql
```

2. **Transferir archivos al VPS**:
```bash
# Código
git push origin main

# Imágenes (por FTP/SFTP)
scp -r uploads/ usuario@tu-vps:/path/to/backend/
```

3. **En el VPS**:
```bash
# Instalar dependencias
npm install --production

# Importar BD
mysql -u usuario -p portfolio_db < backup_portfolio.sql

# Configurar PM2 para mantener el proceso activo
npm install -g pm2
pm2 start server.js --name "portfolio-backend"
pm2 startup
pm2 save
```

### Variables de Entorno de Producción:
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_seguro
FRONTEND_URL=https://tu-dominio.com
```

## 🔧 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar con nodemon para desarrollo
- `npm test` - Ejecutar tests (por implementar)

## 📝 Notas Importantes

- Los archivos en `/uploads` están excluidos del repositorio git
- Las imágenes se optimizan automáticamente al subirlas
- El sistema mantiene registro de todos los archivos subidos
- Las rutas de imágenes se almacenan relativamente en la BD
- El backend está preparado para manejar el formulario del frontend

## 🆘 Solución de Problemas

### Error de conexión a MySQL:
```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql
```

### Error de permisos en uploads:
```bash
chmod 755 uploads/
chmod 755 uploads/images/
```

### Puerto ya en uso:
```bash
# Cambiar PORT en .env o matar proceso
lsof -ti:5000 | xargs kill -9
```
