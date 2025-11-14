FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# a nestjs/swagger@11.x a @nestjs/common 11-et várja de nálam a 10 van
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
