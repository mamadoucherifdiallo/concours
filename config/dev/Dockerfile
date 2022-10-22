# syntax=docker/dockerfile:1

FROM node:alpine3.16

WORKDIR /usr/src/concours

COPY ../../../package*.json /usr/src/concours/

RUN npm install

COPY . .

RUN npm run build