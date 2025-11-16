@echo off
REM =====================================================
REM SCRIPT DE INSTALACIÓN DE BASE DE DATOS
REM Ejecutar desde MySQL Workbench o línea de comandos
REM =====================================================

echo ========================================
echo INSTALACIÓN DE BASE DE DATOS PORTFOLIO
echo ========================================
echo.

REM Buscar MySQL en ubicaciones comunes
set MYSQL_PATH=""

if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
) else if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
) else if exist "C:\MySQL\bin\mysql.exe" (
    set MYSQL_PATH="C:\MySQL\bin\mysql.exe"
)

if %MYSQL_PATH%=="" (
    echo ERROR: No se encontró MySQL en las ubicaciones comunes.
    echo.
    echo Por favor, ejecuta este script desde MySQL Workbench:
    echo 1. Abre MySQL Workbench
    echo 2. Conecta a tu servidor local
    echo 3. File ^> Open SQL Script
    echo 4. Selecciona: database/schema_simplified.sql
    echo 5. Haz clic en Execute (rayo)
    echo.
    pause
    exit /b 1
)

echo MySQL encontrado en: %MYSQL_PATH%
echo.

REM Solicitar contraseña
set /p MYSQL_PASSWORD="Ingresa la contraseña de root de MySQL: "

echo.
echo Ejecutando schema...
%MYSQL_PATH% -u root -p%MYSQL_PASSWORD% -h 127.0.0.1 -P 3306 < database\schema_simplified.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BASE DE DATOS CREADA EXITOSAMENTE
    echo ========================================
    echo.
    echo Base de datos: portfolio_db
    echo Tablas creadas: groups_table, images, file_uploads_log
    echo Datos iniciales: 2 grupos, 2 imágenes
    echo.
) else (
    echo.
    echo ERROR: Hubo un problema al crear la base de datos.
    echo.
)

pause
