FROM node:lts-alpine3.18 AS builder

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY . .

RUN npm run build

# Actual PROD image
FROM nginx:1.25.1-alpine AS production

ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
