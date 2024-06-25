FROM node:18-alpine AS build

RUN mkdir -p /build
WORKDIR /build

COPY . /build
RUN npm install
RUN npm run build

FROM nginx:1.21.5-alpine AS client
COPY --from=build /build/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]