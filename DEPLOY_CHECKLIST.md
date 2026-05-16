# ✅ CHECKLIST DEPLOY - Hostinger KVM 1

## Preparación Local (LISTO)
- [x] Backup MySQL: `backend/database/backup_production.sql` (20.5 KB)
- [x] Build frontend: `frontend/dist/` generado
- [x] Archivos `.env.production` creados (backend y frontend)
- [x] Rebuild frontend con dominio real: matiasborsalino.com.ar

---

## Fase 1: VPS Hostinger (cuando el cliente contrate)

### 1.1 Acceder al VPS
```bash
ssh root@IP_DEL_VPS
```

### 1.2 Actualizar sistema
```bash
apt update && apt upgrade -y
```

### 1.3 Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
node -v  # Verificar v18.x
```

### 1.4 Instalar MySQL (con configuración para 1GB RAM)
```bash
apt install -y mysql-server
mysql_secure_installation
```

**Responder:**
- Remove anonymous users? **Yes**
- Disallow root login remotely? **Yes**
- Remove test database? **Yes**
- Reload privilege tables? **Yes**

**Configurar MySQL para 1GB RAM:**
```bash
nano /etc/mysql/mysql.conf.d/mysqld.cnf
```
Agregar:
```ini
[mysqld]
innodb_buffer_pool_size = 256M
max_connections = 50
query_cache_size = 32M
tmp_table_size = 32M
max_heap_table_size = 32M
```

```bash
systemctl restart mysql
```

### 1.5 Crear base de datos y usuario
```bash
mysql -u root -p
```
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'CONTRASEÑA_SEGURA';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Fase 2: Subir Archivos al VPS

### 2.1 Opción A: Git (si está en GitHub)
```bash
cd /var/www
git clone https://github.com/ibrian91/portfolio_artista_visual.git portfolio
cd portfolio/backend
npm install --production
```

### 2.2 Opción B: SFTP (FileZilla)
- Subir `backend/` → `/var/www/portfolio/backend`
- Subir `frontend/dist/` → `/var/www/portfolio/frontend`
- Subir `database/backup_production.sql` → `/var/www/portfolio/`

### 2.3 Subir imágenes (SCP)
```bash
# Desde tu PC
scp -r backend/uploads/portfolio/* root@IP:/var/www/portfolio/backend/uploads/portfolio/
```

---

## Fase 3: Configurar Backend

### 3.1 Importar base de datos
```bash
cd /var/www/portfolio
mysql -u portfolio_user -p portfolio_db < backend/database/backup_production.sql
```

### 3.2 Crear archivo .env en VPS
```bash
cd /var/www/portfolio/backend
nano .env
```

**Contenido (copiar desde `.env.production` y modificar):**
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=portfolio_user
DB_PASSWORD=CONTRASEÑA_QUE_PUSISTE_ANTES
DB_NAME=portfolio_db
DB_PORT=3306
JWT_SECRET=GENERAR_CLAVE_LARGA_Y_SEGURA
ACCESS_KEY=mb_Acceso2025-Form
UPLOAD_SECRET=1
FRONTEND_URL=https://matiasborsalino.com.ar
UPLOAD_PATH=./uploads
IMAGES_PATH=./uploads/images
```

### 3.3 Permisos
```bash
mkdir -p uploads/portfolio
chown -R www-data:www-data /var/www/portfolio/
chmod -R 755 /var/www/portfolio/
chmod -R 775 /var/www/portfolio/backend/uploads/
```

---

## Fase 4: PM2 (Process Manager)

```bash
npm install -g pm2

cd /var/www/portfolio/backend
pm2 start server.js --name "portfolio-backend"
pm2 startup
pm2 save

# Verificar logs
pm2 logs portfolio-backend
```

---

## Fase 5: Nginx (Reverse Proxy)

### 5.1 Instalar
```bash
apt install -y nginx
```

### 5.2 Configuración
```bash
nano /etc/nginx/sites-available/portfolio
```

```nginx
server {
    listen 80;
    server_name matiasborsalino.com.ar www.matiasborsalino.com.ar;

    location / {
        root /var/www/portfolio/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/portfolio/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 10M;
}
```

### 5.3 Activar
```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## Fase 6: SSL (HTTPS) - Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d matiasborsalino.com.ar -d www.matiasborsalino.com.ar

# Verificar renovación automática
certbot renew --dry-run
```

---

## Fase 7: Swap (IMPORTANTE para KVM 1)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Verificar
free -h
```

---

## Fase 8: Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## ✅ Verificación Final

```bash
# Backend
pm2 logs portfolio-backend
curl http://localhost:5000/api/health

# MySQL
mysql -u portfolio_user -p -e "USE portfolio_db; SHOW TABLES;"

# Imágenes
ls -la /var/www/portfolio/backend/uploads/portfolio/

# Nginx
nginx -t
systemctl status nginx
```

**Abrir en navegador:** `https://matiasborsalino.com.ar`

---

## 📋 Datos del Cliente (completar)

| Dato | Valor |
|------|-------|
| Dominio | `matiasborsalino.com.ar` |
| IP del VPS | `____________________` |
| Contraseña MySQL | `____________________` |
| Contraseña root VPS | `____________________` |
| SSH Key (si aplica) | `____________________` |

---

## 🆘 Comandos útiles

```bash
# Backend
pm2 restart portfolio-backend
pm2 logs portfolio-backend
pm2 stop portfolio-backend

# MySQL
mysqldump -u portfolio_user -p portfolio_db > backup_$(date +%Y%m%d).sql

# Nginx
systemctl reload nginx
tail -f /var/log/nginx/error.log
```
