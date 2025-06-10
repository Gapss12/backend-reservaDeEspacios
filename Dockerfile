# Usa una imagen base de Node.js con Alpine (ligera)
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# 1. Copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# 2. Instala dependencias (incluyendo las de desarrollo si es necesario)
RUN npm install --production=false  

# 3. Copia el resto del código (excluyendo node_modules con .dockerignore)
COPY . .


# 6. Usa npm start en lugar de ts-node directamente (mejor práctica)
CMD ["npm", "start"]