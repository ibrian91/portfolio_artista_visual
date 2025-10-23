#!/bin/bash

# Script para configuración inicial del backend

echo "🚀 Configurando backend del portfolio..."

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor, configura tus variables de entorno."
else
    echo "⚠️  El archivo .env ya existe."
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear directorios de uploads si no existen
echo "📁 Creando directorios de uploads..."
mkdir -p uploads/images/techniques
mkdir -p uploads/images/portfolio
mkdir -p uploads/images/biography

# Configurar permisos (solo en sistemas Unix)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🔒 Configurando permisos..."
    chmod 755 uploads/
    chmod 755 uploads/images/
    chmod 755 uploads/images/techniques/
    chmod 755 uploads/images/portfolio/
    chmod 755 uploads/images/biography/
fi

echo ""
echo "✅ Configuración inicial completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en el archivo .env"
echo "2. Crea la base de datos MySQL:"
echo "   mysql -u root -p -e \"CREATE DATABASE portfolio_db;\""
echo "3. Ejecuta el schema de la base de datos:"
echo "   mysql -u root -p portfolio_db < database/schema.sql"
echo "4. (Opcional) Inserta datos de ejemplo:"
echo "   mysql -u root -p portfolio_db < database/sample_data.sql"
echo "5. Inicia el servidor:"
echo "   npm run dev"
echo ""
