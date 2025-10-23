@echo off
echo 🚀 Configurando backend del portfolio...

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy .env.example .env
    echo ✅ Archivo .env creado. Por favor, configura tus variables de entorno.
) else (
    echo ⚠️  El archivo .env ya existe.
)

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

REM Crear directorios de uploads si no existen
echo 📁 Creando directorios de uploads...
if not exist uploads\images\techniques mkdir uploads\images\techniques
if not exist uploads\images\portfolio mkdir uploads\images\portfolio
if not exist uploads\images\biography mkdir uploads\images\biography

echo.
echo ✅ Configuración inicial completada!
echo.
echo 📋 Próximos pasos:
echo 1. Configura las variables de entorno en el archivo .env
echo 2. Crea la base de datos MySQL:
echo    mysql -u root -p -e "CREATE DATABASE portfolio_db;"
echo 3. Ejecuta el schema de la base de datos:
echo    mysql -u root -p portfolio_db ^< database\schema.sql
echo 4. ^(Opcional^) Inserta datos de ejemplo:
echo    mysql -u root -p portfolio_db ^< database\sample_data.sql
echo 5. Inicia el servidor:
echo    npm run dev
echo.
pause
