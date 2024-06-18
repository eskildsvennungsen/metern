FROM node:20.12.2-bookworm-slim as server

RUN mkdir -p /code
WORKDIR /code

RUN apt-get update

COPY package.json /code
RUN npm install

COPY . /code
EXPOSE 4000
CMD ['npm', 'start']