# Estágio 1: Construir a aplicação Angular
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --silent

COPY . .

RUN npm run build --prod

# Estágio 2: Configurar o servidor web para servir a aplicação Angular
FROM nginx:alpine

COPY --from=build /app/dist/* /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
