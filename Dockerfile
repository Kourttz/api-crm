FROM node:20-alpine

WORKDIR /app

# Instala bash + netcat (necessários no entrypoint)
RUN apk add --no-cache bash netcat-openbsd

# Declara ARGs para build
ARG PORT
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG JWT_SECRET

# Define ENV para runtime
ENV PORT=${PORT:-3000} \
    DB_HOST=${DB_HOST:-localhost} \
    DB_PORT=${DB_PORT:-5432} \
    DB_USERNAME=${DB_USERNAME:-postgres} \
    DB_PASSWORD=${DB_PASSWORD:-postgres} \
    DB_DATABASE=${DB_DATABASE:-crm_db} \
    JWT_SECRET=${JWT_SECRET:-secret_default}

# Copia pacotes e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o restante do código
COPY . .

# Copia e permite execução do entrypoint
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Build do projeto (compila TS para JS)
RUN npm run build

# Gera .env na build (opcional, garante consistência)
RUN echo "PORT=$PORT" > /app/.env \
 && echo "DB_HOST=$DB_HOST" >> /app/.env \
 && echo "DB_PORT=$DB_PORT" >> /app/.env \
 && echo "DB_USERNAME=$DB_USERNAME" >> /app/.env \
 && echo "DB_PASSWORD=$DB_PASSWORD" >> /app/.env \
 && echo "DB_DATABASE=$DB_DATABASE" >> /app/.env \
 && echo "JWT_SECRET=$JWT_SECRET" >> /app/.env

# Expõe porta
EXPOSE $PORT

# Entrypoint e comando padrão
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start:prod"]
