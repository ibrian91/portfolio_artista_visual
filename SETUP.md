# 🚀 Guía de Configuración del Portfolio

Esta guía te ayudará a configurar y ejecutar el proyecto completo desde cero.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([descargar](https://nodejs.org/))
- **MySQL 8.0** ([descargar](https://dev.mysql.com/downloads/installer/))
- **Git** (opcional, para clonar el repositorio)

---

## 🗄️ Paso 1: Configuración de la Base de Datos

### 1.1 Iniciar MySQL

**Opción A: Usando el Servicio de Windows**

```powershell
# Abrir PowerShell como Administrador
Start-Service MySQL80
```

**Opción B: Usando MySQL en modo consola (si el servicio no inicia)**

```powershell
# Abrir PowerShell como Administrador
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --console
```

> ⚠️ **Importante:** Si usas la Opción B, deja esa ventana de PowerShell abierta mientras trabajas.

---

### 1.2 Crear la Base de Datos

**Opción A: Desde la terminal**

```powershell
# Conectarse a MySQL (password vacía - solo presiona Enter)
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p

# Una vez conectado, ejecutar:
```

```sql
CREATE DATABASE portfolio_db;
USE portfolio_db;
SOURCE C:/Users/usuario/Desktop/CompuNueva/Ibri/Ibri/Laburar por mi cuenta/portfolio matias/proyecto/my-app/backend/database/schema.sql;
SOURCE C:/Users/usuario/Desktop/CompuNueva/Ibri/Ibri/Laburar por mi cuenta/portfolio matias/proyecto/my-app/backend/database/sample_data.sql;
EXIT;
```

> 📝 **Nota:** Reemplaza la ruta con la ubicación real de tu proyecto. Usa barras `/` en lugar de `\`.

**Opción B: Desde MySQL Workbench (Recomendado)**

1. Abre **MySQL Workbench**
2. Conecta al servidor local (`localhost:3306`)
   - Username: `root`
   - Password: *(vacío - deja en blanco)*
3. Ve a **File → Open SQL Script**
4. Navega a `backend/database/schema.sql` y ábrelo
5. Click en el botón ⚡ **Execute** para crear las tablas
6. Repite los pasos 3-5 con `backend/database/sample_data.sql` para cargar datos de ejemplo

---

### 1.3 Verificar la Instalación

En MySQL Workbench o en terminal:

```sql
USE portfolio_db;
SHOW TABLES;
```

Deberías ver estas tablas:
- `groups`
- `images`
- `portfolio_images`

---

## 🔧 Paso 2: Configuración del Backend

### 2.1 Instalar Dependencias

```powershell
# Navegar a la carpeta del backend
cd backend

# Instalar paquetes de Node.js
npm install
```

---

### 2.2 Configurar Variables de Entorno

El archivo `.env` ya está configurado con valores por defecto. **Verifica que coincida con tu configuración de MySQL:**

```env
# backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=           # ← Vacío si no configuraste contraseña
DB_NAME=portfolio_db
DB_PORT=3306
```

> ⚠️ **Si tu MySQL tiene contraseña**, actualiza `DB_PASSWORD=tu_contraseña`

---

### 2.3 Iniciar el Servidor Backend

```powershell
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

**Salida esperada:**

```
🚀 Servidor corriendo en http://localhost:5000
✅ Conectado a la base de datos MySQL
```

---

## ⚛️ Paso 3: Configuración del Frontend

### 3.1 Instalar Dependencias

```powershell
# Navegar a la carpeta del frontend (desde la raíz del proyecto)
cd frontend

# Instalar paquetes
npm install
```

---

### 3.2 Configurar Variables de Entorno

El archivo `.env` del frontend debe contener:

```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_ACCESS_KEY=mb_Acceso2025-Form
```

> 📝 Ya está configurado por defecto, no necesitas modificarlo para desarrollo local.

---

### 3.3 Iniciar el Servidor de Desarrollo

```powershell
# Iniciar frontend con Vite
npm run dev
```

**Salida esperada:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🌐 Paso 4: Acceder a la Aplicación

### Rutas principales:

- **Homepage:** [http://localhost:5173/](http://localhost:5173/)
- **Portfolio:** [http://localhost:5173/techniques](http://localhost:5173/techniques)
- **Biografía:** [http://localhost:5173/about](http://localhost:5173/about)
- **Contacto:** [http://localhost:5173/contact](http://localhost:5173/contact)
- **Formulario Admin:** [http://localhost:5173/form_images/key/mb_Acceso2025-Form](http://localhost:5173/form_images/key/mb_Acceso2025-Form)

---

## 🛠️ Solución de Problemas

### ❌ Error: `ECONNREFUSED` en el backend

**Causa:** MySQL no está corriendo.

**Solución:**

```powershell
# Verificar estado del servicio
Get-Service MySQL80

# Si está detenido, iniciarlo
Start-Service MySQL80

# O usar modo consola
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --console
```

---

### ❌ Error: `Access denied for user 'root'@'localhost'`

**Causa:** La contraseña en `.env` no coincide con MySQL.

**Solución:**

1. Verifica la contraseña de MySQL:
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
   ```

2. Actualiza `backend/.env`:
   ```env
   DB_PASSWORD=tu_contraseña_correcta
   ```

3. Reinicia el backend:
   ```powershell
   npm run dev
   ```

---

### ❌ Error: `Unknown database 'portfolio_db'`

**Causa:** La base de datos no fue creada.

**Solución:** Regresa al **Paso 1.2** y ejecuta los scripts SQL.

---

### ❌ Frontend no se conecta al backend

**Causa:** Backend no está corriendo o URL incorrecta.

**Solución:**

1. Verifica que el backend esté corriendo en `http://localhost:5000`
2. Verifica `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Reinicia el frontend:
   ```powershell
   npm run dev
   ```

---

## 📂 Estructura del Proyecto

```
my-app/
├── backend/
│   ├── database/
│   │   ├── schema.sql          # Estructura de tablas
│   │   └── sample_data.sql     # Datos de ejemplo
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Configuración MySQL
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── routes/             # Endpoints API
│   │   ├── services/           # Servicios de datos
│   │   └── middleware/         # Middleware Express
│   ├── uploads/                # Imágenes subidas
│   ├── .env                    # Variables de entorno
│   ├── package.json
│   └── server.js               # Punto de entrada
│
├── frontend/
│   ├── public/
│   │   └── assets/             # Recursos estáticos
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas principales
│   │   ├── hooks/              # Custom hooks
│   │   └── utils/              # Utilidades
│   ├── .env                    # Variables de entorno
│   ├── package.json
│   └── vite.config.js          # Configuración Vite
│
└── SETUP.md                    # Este archivo
```

---

## 🧪 Testing

### Backend Tests

```powershell
cd backend
npm test                        # Ejecutar todos los tests
npm test -- --coverage          # Con reporte de cobertura
```

**Cobertura actual:** ~70-75% (236 tests passing)

---

## 🚀 Scripts Disponibles

### Backend

```powershell
npm start          # Iniciar servidor (producción)
npm run dev        # Iniciar con nodemon (desarrollo)
npm test           # Ejecutar tests
npm run test:watch # Tests en modo watch
```

### Frontend

```powershell
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Linting con ESLint
```

---

## 📝 Notas Importantes

1. **MySQL debe estar corriendo** antes de iniciar el backend
2. **Password de MySQL es vacía** por defecto (`DB_PASSWORD=`)
3. **Puerto backend:** 5000
4. **Puerto frontend:** 5173
5. **Formulario admin requiere clave de acceso:** `mb_Acceso2025-Form`

---

## 🔐 Acceso al Formulario de Administración

Para subir/eliminar imágenes, accede a:

```
http://localhost:5173/form_images/key/mb_Acceso2025-Form
```

La clave de acceso está configurada en `backend/.env`:

```env
ACCESS_KEY=mb_Acceso2025-Form
```

---

## 📞 Soporte

Si encuentras problemas no listados aquí:

1. Revisa los logs del backend y frontend
2. Verifica que MySQL esté corriendo: `Get-Service MySQL80`
3. Verifica las variables de entorno en ambos `.env`
4. Asegúrate de que los puertos 3306, 5000 y 5173 no estén en uso

---

## ✅ Checklist de Inicio Rápido

- [ ] MySQL instalado e iniciado
- [ ] Base de datos `portfolio_db` creada
- [ ] Tablas creadas desde `schema.sql`
- [ ] Datos de ejemplo cargados desde `sample_data.sql`
- [ ] Backend: `npm install` ejecutado
- [ ] Backend: `.env` configurado correctamente
- [ ] Backend iniciado en `http://localhost:5000`
- [ ] Frontend: `npm install` ejecutado
- [ ] Frontend: `.env` configurado correctamente
- [ ] Frontend iniciado en `http://localhost:5173`
- [ ] ✅ Aplicación funcionando correctamente

---

**¡Listo para desarrollar! 🎉**
