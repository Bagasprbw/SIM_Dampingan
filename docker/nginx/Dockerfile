# Stage 1: build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL
ARG VITE_SUPERADMIN_WA
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPERADMIN_WA=$VITE_SUPERADMIN_WA

RUN npm run build

# Stage 2: nginx
FROM nginx:1.27-alpine

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80
