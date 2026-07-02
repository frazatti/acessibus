# syntax=docker/dockerfile:1
# Etapa 1: Build da aplicação React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
RUN npm run build

# Etapa 2: Servir os arquivos com Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copia como template para habilitar variáveis de ambiente via envsubst
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
