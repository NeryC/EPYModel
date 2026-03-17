FROM node:20-alpine

WORKDIR /usr/app

# Instalar PM2 globalmente
RUN npm install --global pm2

# Copiar archivos de dependencias (yarn.lock resuelve conflictos de peer deps)
COPY package.json yarn.lock ./

# Instalar todas las dependencias (incluyendo devDeps necesarias para el build)
RUN yarn install --frozen-lockfile

# Copiar el resto del código
COPY . .

# ARG permite pasar la URL del backend en tiempo de build:
#   docker build --build-arg NEXT_PUBLIC_API_URL=http://tu-servidor:3001 .
# Si no se pasa, usa localhost (válido cuando frontend y backend están en el mismo servidor)
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build de producción (Next.js bake el NEXT_PUBLIC_API_URL en el bundle aquí)
RUN yarn build

# Exponer puerto del frontend
EXPOSE 3000

# Correr como usuario no-root
USER node

CMD ["pm2-runtime", "npm", "--", "start"]
