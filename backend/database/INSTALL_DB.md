# 📦 GUÍA DE INSTALACIÓN DE BASE DE DATOS

## PASO 1: Instalar el Schema en MySQL Local

### Opción A: Desde MySQL Workbench (RECOMENDADO)

1. **Abrir MySQL Workbench**
   - Abre MySQL Workbench en tu PC
   
2. **Conectar a tu servidor local**
   - Hostname: `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Password: (tu contraseña)

3. **Ejecutar el script SQL**
   - Ve a: **File > Open SQL Script**
   - Navega a: `backend/database/schema_simplified.sql`
   - Haz clic en el botón **Execute** (⚡ rayo)

4. **Verificar la creación**
   ```sql
   USE portfolio_db;
   SHOW TABLES;
   SELECT * FROM groups_table;
   SELECT * FROM images;
   ```

### Opción B: Desde línea de comandos

Si MySQL está en tu PATH:
```bash
cd backend
mysql -u root -p < database/schema_simplified.sql
```

---

## PASO 2: Configurar Variables de Entorno

Edita el archivo `.env` en la carpeta `backend`:

```env
# Base de datos MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=portfolio_db

# Importante: Habilitar conexión con SSL deshabilitado (desarrollo)
DB_SSL=false
```

---

## PASO 3: Verificar Conexión

Ejecuta el servidor y verifica la conexión:

```bash
cd backend
npm run dev
```

Deberías ver en consola:
```
✅ Conectado a MySQL: portfolio_db
🚀 Servidor corriendo en puerto 5000
```

---

## ESTRUCTURA DE LA BASE DE DATOS

### Tabla: `groups_table`
Almacena los grupos de imágenes organizados por técnica y categoría.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID autoincremental |
| technique | VARCHAR(100) | Ej: "Dibujo", "Pintura", "Fotografía" |
| category | VARCHAR(100) | Ej: "Digital", "Lápiz", "Acuarela" |
| group_name | VARCHAR(200) | Nombre del grupo |
| cover_image_url | VARCHAR(500) | Ruta de imagen de portada |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

### Tabla: `images`
Almacena las imágenes individuales dentro de cada grupo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT | ID único (timestamp) |
| technique | VARCHAR(100) | Técnica de la imagen |
| category | VARCHAR(100) | Categoría de la imagen |
| group_name | VARCHAR(200) | Grupo al que pertenece |
| image_name | VARCHAR(200) | Nombre de la imagen |
| description | TEXT | Descripción de la imagen |
| is_mockup_image | BOOLEAN | ¿Es mockup? |
| is_rotating_image | BOOLEAN | ¿Es imagen rotativa? |
| is_small_image | BOOLEAN | ¿Es imagen pequeña? |
| file_url | VARCHAR(500) | **RUTA del archivo** (no el archivo) |
| file_size | INT | Tamaño en bytes |
| mime_type | VARCHAR(50) | Tipo MIME (image/jpeg, etc.) |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: `file_uploads_log` (opcional)
Registro de auditoría de todas las subidas.

---

## DATOS INICIALES CARGADOS

El schema incluye los 2 grupos y 2 imágenes que ya tenías en JSON:

**Grupos:**
- Dibujo > Digital > "dibujo digital group"
- Dibujo > Fibra > "sdsd"

**Imágenes:**
- ID: 1762908827018 - "nombre dibujo" (Dibujo/Digital)
- ID: 1762917274264 - "sdsa" (Dibujo/Fibra)

---

## IMPORTANTE: ¿Qué se guarda dónde?

### En la Base de Datos (MySQL):
✅ Información de grupos (technique, category, group_name)
✅ Información de imágenes (nombre, descripción, flags)
✅ **RUTAS de los archivos** (ej: `/uploads/portfolio/Dibujo/Digital/...`)
❌ NO se guardan las imágenes en sí

### En el Sistema de Archivos (Hostinger VPS):
✅ Las imágenes físicas (.jpg, .png, etc.)
✅ Estructura de carpetas: `/uploads/portfolio/{technique}/{category}/{group}/`
❌ NO se guarda información estructurada

---

## PRÓXIMOS PASOS

Una vez instalada la BD, necesitas:

1. ✅ Migrar `groupService.js` para usar MySQL en lugar de JSON
2. ✅ Migrar `imageService.js` para usar MySQL en lugar de JSON  
3. ✅ Actualizar tests de integración
4. ✅ Probar el sistema completo localmente
5. ✅ Exportar BD para Hostinger
6. ✅ Subir código y archivos a VPS

---

## COMANDOS ÚTILES DE MYSQL

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Usar la base de datos del portfolio
USE portfolio_db;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE groups_table;
DESCRIBE images;

-- Ver todos los grupos
SELECT * FROM groups_table;

-- Ver todas las imágenes
SELECT * FROM images;

-- Ver resumen (vista)
SELECT * FROM v_portfolio_summary;

-- Contar registros
SELECT COUNT(*) FROM groups_table;
SELECT COUNT(*) FROM images;

-- Buscar por técnica
SELECT * FROM images WHERE technique = 'Dibujo';

-- Buscar por grupo
SELECT * FROM images WHERE group_name = 'dibujo digital group';

-- Eliminar todos los datos (cuidado!)
TRUNCATE TABLE images;
TRUNCATE TABLE groups_table;

-- Resetear IDs autoincrementales
ALTER TABLE groups_table AUTO_INCREMENT = 1;
```

---

## TROUBLESHOOTING

### Error: "Access denied for user 'root'@'localhost'"
- Verifica que la contraseña en `.env` sea correcta
- Verifica que MySQL esté corriendo: `services.msc` → MySQL80

### Error: "Unknown database 'portfolio_db'"
- Ejecuta el schema SQL desde MySQL Workbench
- O ejecuta manualmente: `CREATE DATABASE portfolio_db;`

### Error: "Table doesn't exist"
- Verifica que ejecutaste el schema completo
- Usa: `SHOW TABLES;` para ver qué tablas existen

### Error: "Connection refused"
- Verifica que MySQL esté corriendo
- Verifica el puerto (3306 por defecto)
- Verifica el host (127.0.0.1 o localhost)

---

## BACKUP Y RESTAURACIÓN

### Hacer backup (exportar)
```bash
mysqldump -u root -p portfolio_db > backup_portfolio.sql
```

### Restaurar backup (importar)
```bash
mysql -u root -p portfolio_db < backup_portfolio.sql
```

---

¿Listo para continuar con la migración del código?
