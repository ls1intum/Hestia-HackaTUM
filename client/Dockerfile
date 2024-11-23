# Taken from https://thedkpatel.medium.com/dockerizing-react-application-built-with-vite-a-simple-guide-4c41eb09defaand https://lipanski.com/posts/smallest-docker-image-static-website

FROM node:23-alpine AS build

WORKDIR /app
COPY . ./

RUN npm i
RUN npm run build

FROM busybox:1.37.0

WORKDIR /client
COPY --from=build /app/dist/ .

EXPOSE 3000
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]
