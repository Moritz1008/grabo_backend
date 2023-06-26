FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENV DATABASE_URL=mongodb+srv://grabo_db:shadowpass@cluster0.toy7lbu.mongodb.net/?retryWrites=true&w=majority

ENV PORT=5000

ENV URLLENGTH=7

CMD [ "node", "server.js" ]