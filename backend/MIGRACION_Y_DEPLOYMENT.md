# 🚀 GUÍA COMPLETA DE MIGRACIÓN JSON → MySQL Y DEPLOYMENT A HOSTINGER

## ✅ MIGRACIÓN COMPLETADA

### Archivos Migrados:
1. ✅ `src/services/groupService.js` - Ahora usa MySQL
2. ✅ `src/controllers/uploadController.js` - Ahora guarda en MySQL
3. ✅ `src/services/imageService.js` - Ahora lee de MySQL
4. ✅ Schema SQL creado: `database/schema_simplified.sql`

---

## 📋 PASO A PASO - INSTALACIÓN LOCAL

### 1. Instalar el Schema en MySQL Local

#### Opción A: Desde MySQL Workbench (RECOMENDADO)

1. **Abrir MySQL Workbench**
2. **Conectar a tu servidor:**
   - Hostname: `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Password: (tu contraseña)

3. **Ejecutar el schema:**
   - Menu: **File > Open SQL Script**
   - Seleccionar: `backend/database/schema_simplified.sql`
   - Clic en **Execute** (⚡ rayo amarillo)

4. **Verificar:**
   ```sql
   USE portfolio_db;
   SHOW TABLES;
   SELECT * FROM groups_table;
   SELECT * FROM images;
   ```

#### Opción B: Desde CMD (si MySQL está en PATH)
```bash
cd backend
mysql -u root -p < database\schema_simplified.sql
```

---

### 2. Configurar .env

Tu archivo `.env` debe tener:

```env
# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=         # ⚠️ COLOCA TU CONTRASEÑA AQUÍ
DB_NAME=portfolio_db
DB_PORT=3306
```

---

### 3. Probar el Sistema Localmente

```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Conectado a MySQL: portfolio_db
🚀 Servidor corriendo en puerto 5000
```

---

### 4. Probar Funcionalidades

**Abrir frontend:**
```bash
cd frontend
npm run dev
```

Probar:
- ✅ Ver grupos existentes
- ✅ Crear nuevo grupo
- ✅ Subir imagen a grupo
- ✅ Eliminar imagen
- ✅ Eliminar grupo

**Importante:** Los datos iniciales ya están cargados (2 grupos, 2 imágenes).

---

## 🌐 DEPLOYMENT A HOSTINGER VPS

### FASE 1: Preparación Local

#### 1. Hacer backup de MySQL local

```bash
cd backend
mysqldump -u root -p portfolio_db > database/backup_local.sql
```

Este archivo contiene:
- Estructura de tablas
- Datos actuales (grupos e imágenes)

---

### FASE 2: Configuración en Hostinger VPS

#### 1. Contratar Plan KVM 2

- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- Sistema: Ubuntu 20.04/22.04 LTS

#### 2. Acceder por SSH

```bash
ssh root@tu-ip-del-vps
```

#### 3. Actualizar Sistema

```bash
apt update && apt upgrade -y
```

#### 4. Instalar Node.js

```bash
# Instalar Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verificar
node -v  # Debe mostrar v18.x.x
npm -v
```

#### 5. Instalar MySQL

```bash
# Instalar MySQL Server
apt install -y mysql-server

# Verificar instalación
systemctl status mysql

# Configurar seguridad
mysql_secure_installation
```

Responder:
- Remove anonymous users? **Yes**
- Disallow root login remotely? **Yes** (usarás usuario local)
- Remove test database? **Yes**
- Reload privilege tables? **Yes**

#### 6. Crear Base de Datos en VPS

```bash
mysql -u root -p
```

Dentro de MySQL:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'TU_CONTRASEÑA_SEGURA';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### FASE 3: Subir Código al VPS

#### Opción A: Via Git (RECOMENDADO)

```bash
# En tu PC
cd my-app
git add .
git commit -m "Migración a MySQL completada"
git push origin main

# En el VPS
cd /var/www/
git clone https://github.com/ibrian91/portfolio_artista_visual.git
cd portfolio_artista_visual/backend
npm install --production
```

#### Opción B: Via FTP/SFTP

Usar FileZilla o WinSCP:
- Host: IP del VPS
- Usuario: root
- Puerto: 22
- Protocolo: SFTP

Subir carpetas:
- `/backend` → `/var/www/portfolio/backend`
- `/frontend/dist` → `/var/www/portfolio/frontend` (después de build)

---

### FASE 4: Subir Imágenes al VPS

```bash
# Desde tu PC (usando SCP)
scp -r backend/uploads/portfolio root@tu-ip:/var/www/portfolio/backend/uploads/

# O usando FileZilla/WinSCP
# Subir: backend/uploads/portfolio/* → /var/www/portfolio/backend/uploads/portfolio/
```

**Estructura en VPS debe quedar:**
```
/var/www/portfolio/backend/uploads/portfolio/
├── Dibujo/
│   ├── Digital/
│   │   └── dibujo digital group/
│   │       └── optimized-nombre dibujo.jpg
│   └── Fibra/
│       └── sdsd/
│           └── optimized-sdsa.jpg
```

---

### FASE 5: Configurar Backend en VPS

#### 1. Importar Base de Datos

```bash
cd /var/www/portfolio/backend
mysql -u portfolio_user -p portfolio_db < database/backup_local.sql
```

#### 2. Crear archivo .env en VPS

```bash
nano .env
```

Contenido:
```env
NODE_ENV=production
PORT=5000

# Base de datos MySQL
DB_HOST=localhost
DB_USER=portfolio_user
DB_PASSWORD=TU_CONTRASEÑA_SEGURA
DB_NAME=portfolio_db
DB_PORT=3306

# Claves de seguridad
JWT_SECRET=GENERA_UNO_NUEVO_MUY_LARGO_Y_SEGURO
ACCESS_KEY=mb_Acceso2025-Form
UPLOAD_SECRET=1

# CORS - DOMINIO REAL
FRONTEND_URL=https://tu-dominio.com

# Rutas
UPLOAD_PATH=./uploads
IMAGES_PATH=./uploads/images
```

Guardar: `Ctrl+X`, `Y`, `Enter`

#### 3. Instalar PM2 (Process Manager)

```bash
npm install -g pm2

# Iniciar backend
cd /var/www/portfolio/backend
pm2 start server.js --name "portfolio-backend"

# Configurar inicio automático
pm2 startup
pm2 save

# Ver logs
pm2 logs portfolio-backend
```

---

### FASE 6: Configurar Frontend

#### 1. Build del Frontend

**En tu PC:**
```bash
cd frontend

# Actualizar la URL del backend en .env
echo "VITE_API_URL=https://tu-dominio.com/api" > .env.production

# Build
npm run build
```

Esto genera carpeta `/frontend/dist`

#### 2. Subir dist al VPS

```bash
# Via SCP
scp -r frontend/dist/* root@tu-ip:/var/www/portfolio/frontend/

# O via FileZilla/WinSCP
```

---

### FASE 7: Configurar Nginx

#### 1. Instalar Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

#### 2. Crear configuración

```bash
nano /etc/nginx/sites-available/portfolio
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend (React)
    location / {
        root /var/www/portfolio/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Servir imágenes estáticas
    location /uploads {
        alias /var/www/portfolio/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 10M;
}
```

#### 3. Activar configuración

```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### FASE 8: Configurar SSL (HTTPS)

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Auto-renovación (verificar)
certbot renew --dry-run
```

---

## ✅ VERIFICACIÓN FINAL

### 1. Verificar Backend
```bash
curl http://localhost:5000/api/health
# Debe retornar: {"status":"OK",...}
```

### 2. Verificar MySQL
```bash
mysql -u portfolio_user -p
USE portfolio_db;
SELECT COUNT(*) FROM groups_table;
SELECT COUNT(*) FROM images;
EXIT;
```

### 3. Verificar Imágenes
```bash
ls -la /var/www/portfolio/backend/uploads/portfolio/
```

### 4. Verificar Permisos
```bash
chown -R www-data:www-data /var/www/portfolio/
chmod -R 755 /var/www/portfolio/
chmod -R 775 /var/www/portfolio/backend/uploads/
```

### 5. Abrir en Navegador
```
https://tu-dominio.com
```

---

## 🔧 COMANDOS ÚTILES

### Backend (PM2)
```bash
pm2 list                    # Ver procesos
pm2 logs portfolio-backend  # Ver logs
pm2 restart portfolio-backend
pm2 stop portfolio-backend
pm2 delete portfolio-backend
```

### MySQL
```bash
# Backup
mysqldump -u portfolio_user -p portfolio_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u portfolio_user -p portfolio_db < backup_20251115.sql

# Ver tablas
mysql -u portfolio_user -p -e "USE portfolio_db; SHOW TABLES;"
```

### Nginx
```bash
systemctl status nginx
systemctl reload nginx
systemctl restart nginx
nginx -t  # Test config
tail -f /var/log/nginx/error.log
```

---

## 📊 RESUMEN DE CAMBIOS

### Antes (JSON):
- ❌ Datos en `groups.json` e `images.json`
- ❌ Pérdida de datos al reiniciar
- ❌ No escalable
- ❌ Sin transacciones

### Ahora (MySQL):
- ✅ Datos en tablas `groups_table` e `images`
- ✅ Persistencia garantizada
- ✅ Relaciones con foreign keys
- ✅ Transacciones ACID
- ✅ Escalable y production-ready

### Archivos Físicos:
- ✅ Se siguen guardando en `/uploads/portfolio/`
- ✅ MySQL solo guarda la RUTA (file_url)
- ✅ Al eliminar registro, se elimina archivo físico también

---

## 🔐 SEGURIDAD EN PRODUCCIÓN

### 1. Firewall
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 2. Cambiar Puerto SSH (opcional)
```bash
nano /etc/ssh/sshd_config
# Cambiar: Port 22 → Port 2222
systemctl restart sshd
```

### 3. MySQL Seguro
```bash
# Solo acceso local (ya configurado)
# Usuario con contraseña fuerte
# Sin usuario root remoto
```

### 4. Variables de Entorno
- ✅ `.env` NO se sube a Git
- ✅ ACCESS_KEY y UPLOAD_SECRET únicos en producción
- ✅ JWT_SECRET largo y aleatorio

---

## 🆘 TROUBLESHOOTING

### Backend no inicia
```bash
pm2 logs portfolio-backend
# Ver errores de conexión MySQL o permisos
```

### Error: "Access denied for user"
```bash
# Verificar credenciales en .env
# Verificar usuario MySQL existe
mysql -u portfolio_user -p
```

### Imágenes no cargan
```bash
# Verificar permisos
chmod -R 775 /var/www/portfolio/backend/uploads/
chown -R www-data:www-data /var/www/portfolio/backend/uploads/

# Verificar rutas en MySQL
mysql -u portfolio_user -p
USE portfolio_db;
SELECT file_url FROM images LIMIT 5;
```

### Error 502 Bad Gateway
```bash
# Backend no está corriendo
pm2 restart portfolio-backend

# O puerto incorrecto en nginx
nano /etc/nginx/sites-available/portfolio
```

---

## 📝 BACKUP AUTOMATION

Crear script de backup automático:

```bash
nano /root/backup_portfolio.sh
```

Contenido:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup MySQL
mysqldump -u portfolio_user -pTU_PASSWORD portfolio_db > $BACKUP_DIR/db_$DATE.sql

# Backup imágenes
tar -czf $BACKUP_DIR/images_$DATE.tar.gz /var/www/portfolio/backend/uploads/

# Mantener solo últimos 7 días
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completado: $DATE"
```

Hacer ejecutable y programar:
```bash
chmod +x /root/backup_portfolio.sh
crontab -e

# Agregar: backup diario a las 3 AM
0 3 * * * /root/backup_portfolio.sh >> /var/log/portfolio_backup.log 2>&1
```

---

## ✅ CHECKLIST FINAL

### Pre-deployment:
- [x] Schema SQL ejecutado localmente
- [x] groupService migrado a MySQL
- [x] imageService migrado a MySQL
- [x] uploadController migrado a MySQL
- [x] Tests pasando (npm test)
- [x] Sistema funcionando local

### Deployment:
- [ ] VPS contratado (KVM 2)
- [ ] Node.js instalado en VPS
- [ ] MySQL instalado en VPS
- [ ] Base de datos creada en VPS
- [ ] Código subido al VPS
- [ ] Imágenes subidas al VPS
- [ ] .env configurado en VPS
- [ ] PM2 instalado y backend corriendo
- [ ] Nginx configurado
- [ ] SSL/HTTPS configurado
- [ ] Dominio apuntando a VPS
- [ ] Frontend build subido
- [ ] Todo funcionando en producción

---

## 🎉 ¡LISTO PARA ENTREGAR AL CLIENTE!

Una vez completados todos los pasos:
1. ✅ Sistema funciona en producción
2. ✅ Formulario de subida funciona
3. ✅ Cliente puede subir imágenes
4. ✅ Datos persistentes en MySQL
5. ✅ Imágenes accesibles públicamente
6. ✅ Sistema escalable y seguro

**URL Final:** `https://tu-dominio.com`

---

¿Necesitas ayuda con algún paso específico?
