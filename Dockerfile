# Paso 1: Usar una imagen base de Node.js
FROM node:16-alpine as builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración del proyecto
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY .env ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Paso 2: Preparar la imagen de producción
FROM node:16-alpine

WORKDIR /app

# Copiar la salida del build del 'builder' y las dependencias necesarias
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./

# Exponer el puerto configurado en .env
EXPOSE 3030

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
