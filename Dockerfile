# Imagen base liviana con Node.js 22
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar manifiestos de dependencias asignando su propiedad
COPY --chown=node:node package*.json ./

# Instalar únicamente dependencias de producción
RUN npm ci --omit=dev

# Copiar el código de la aplicación asignando su propiedad
COPY --chown=node:node . .

# Crear directorios necesarios y asignar permisos
RUN mkdir -p uploads logs \
    && chown node:node uploads logs

# Ejecutar con un usuario sin privilegios
USER node

# Variables predeterminadas del contenedor
ENV NODE_ENV=production
ENV PORT=8080

# Puerto de la API
EXPOSE 8080

# Iniciar ShipNow
CMD ["npm", "start"]