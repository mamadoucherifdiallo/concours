# syntax=docker/dockerfile:1

FROM node:16.17.0

WORKDIR /usr/src/concours

COPY ../../../package*.json /usr/src/concours/

COPY . .

RUN npm install

RUN npm run build