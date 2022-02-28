FROM node:17-alpine

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build-ts

CMD [ "node", "./src/server.js" ]