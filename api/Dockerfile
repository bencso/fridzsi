FROM node:22.8

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

USER node

EXPOSE 3000

CMD ["node", "dist/main"]