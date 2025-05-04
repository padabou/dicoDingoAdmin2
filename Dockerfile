FROM node:20-alpine as builder
WORKDIR /app
COPY . .
ARG VITE_APP_BACKEND_ADDRESS
ENV VITE_APP_BACKEND_ADDRESS https://equidico.fr/api
ARG VITE_APP_BACKEND_BASE_URL
ENV VITE_APP_BACKEND_BASE_URL https://equidico.fr/api
RUN npm install
RUN npm run build-production

FROM nginx:1.25.4-alpine-slim as prod
ENV NODE_ENV=production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf  /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]