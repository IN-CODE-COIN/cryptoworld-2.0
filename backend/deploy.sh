#!/bin/bash

# Script de despliegue para VPS
# Ejecuta: chmod +x deploy.sh && ./deploy.sh

echo "Iniciando despliegue..."

# Detener y remover contenedores anteriores
docker-compose down

# Build y start
docker-compose up --build -d

# Esperar a que inicie
sleep 10

# Verificar estado
docker-compose ps

echo "Despliegue completado. Verifica logs con: docker-compose logs -f"
