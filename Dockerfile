FROM node:20.15 AS base

RUN mkdir /src
WORKDIR /src

COPY package*.json .
RUN npm install

COPY . .

FROM base AS dev

CMD ["npm", "run", "dev"]

FROM base AS build

ENV NITRO_PRESET=node-server

RUN npm run build

FROM node:20.15 AS prod

RUN mkdir /app
WORKDIR /app

COPY --from=build /src/.output/ .

CMD ["node", "server/index.mjs"]