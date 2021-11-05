FROM node:14

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

RUN npm install

COPY . . 

