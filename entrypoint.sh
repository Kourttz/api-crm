#!/bin/bash

echo "🔍 Variáveis de ambiente recebidas:"
env | grep -E 'PORT|DB_|JWT_'

# Gera .env se não existir (por compatibilidade)
if [ ! -f /app/.env ]; then
  cat > /app/.env <<EOF
PORT=${PORT}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_DATABASE}
JWT_SECRET=${JWT_SECRET}
EOF
  echo "📄 .env gerado:"
  cat /app/.env
fi

# Aguarda banco iniciar
echo "⏳ Aguardando conexão com banco em ${DB_HOST}:${DB_PORT}..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "✅ Banco de dados disponível."

# Executa migrations
npx typeorm-ts-node-commonjs migration:run -d dist/data_source

# Executa comando principal (start:prod por padrão)
exec "$@"
