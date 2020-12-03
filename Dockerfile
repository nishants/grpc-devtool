FROM node:12

WORKDIR /miraje

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]